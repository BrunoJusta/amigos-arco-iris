import { createIcons, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock, Cookie, Ear, Eye, EyeOff, Flame, Frown, Hash, HeartHandshake, Lock, Maximize, Megaphone, MessageCircle, Paintbrush, Palette, Pause, Pencil, Play, Rainbow, RefreshCw, Repeat1, RotateCcw, Scissors, Search, Shuffle, SkipBack, SkipForward, Smile, Sparkles, Square, Star, ThumbsUp, Trash2, Type, User, UserX, Users, Volume2, VolumeX, Wind, X } from 'lucide';
const ICONES=Object.fromEntries(Object.entries({ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock, Cookie, Ear, Eye, EyeOff, Flame, Frown, Hash, HeartHandshake, Lock, Maximize, Megaphone, MessageCircle, Paintbrush, Palette, Pause, Pencil, Play, Rainbow, RefreshCw, Repeat1, RotateCcw, Scissors, Search, Shuffle, SkipBack, SkipForward, Smile, Sparkles, Square, Star, ThumbsUp, Trash2, Type, User, UserX, Users, Volume2, VolumeX, Wind, X}).filter(([,v])=>v));

export function iniciar(C){

const IMG={}, NOME={}, DIZ={}, TOM={narr:{p:1.05,r:.92}};
(C.personagens||[]).forEach(p=>{ IMG[p.id]=p.img; NOME[p.id]=p.nome; if(p.frase) DIZ[p.id]=p.frase; TOM[p.id]=p.tom||{p:1,r:.92}; });
document.querySelectorAll('[data-img]').forEach(i=>{ if(IMG[i.dataset.img]) i.src=IMG[i.dataset.img]; });

/* ---------- Ícones (Lucide, com símbolo de recurso) ---------- */
const ic = (n,f) => '<i class="ic" data-lucide="'+n+'" data-f="'+(f||'')+'" aria-hidden="true"></i>';
function icones(){ try{ createIcons({icons:ICONES,attrs:{'stroke-width':2.6}}); }catch(e){} }
const BALDE = '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M30 34 Q60 -4 90 34" fill="none" stroke="#B57A00" stroke-width="6" stroke-linecap="round"/><path d="M22 34h76l-9 56H31z" fill="#F7BC2F" stroke="#B57A00" stroke-width="4" stroke-linejoin="round"/><rect x="17" y="28" width="86" height="12" rx="6" fill="#FFD86B" stroke="#B57A00" stroke-width="4"/><circle cx="42" cy="58" r="3" fill="#fff"/><circle cx="62" cy="68" r="2.5" fill="#fff"/><circle cx="78" cy="55" r="3" fill="#fff"/></svg>';
const ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.3l6.6-.8z" fill="currentColor"/></svg>';

/* ---------- Desenhos simples para respostas sem leitura ---------- */
const DESENHOS={
  balde:BALDE,
  bola:'<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="38" fill="#3E92E0"/><path d="M14 44c20 10 52 10 72 0M14 62c20-10 52-10 72 0" stroke="#fff" stroke-width="7" fill="none"/><circle cx="38" cy="36" r="6" fill="#fff" opacity=".6"/></svg>',
  flor:'<svg viewBox="0 0 100 100"><path d="M50 58v36" stroke="#2FB383" stroke-width="6" stroke-linecap="round"/><path d="M50 80c-12-2-18-10-18-16 10 0 16 6 18 16z" fill="#2FB383"/><g fill="#EE6FA0"><circle cx="50" cy="24" r="13"/><circle cx="70" cy="40" r="13"/><circle cx="62" cy="62" r="13"/><circle cx="38" cy="62" r="13"/><circle cx="30" cy="40" r="13"/></g><circle cx="50" cy="45" r="11" fill="#F7BC2F"/></svg>',
  aquario:'<svg viewBox="0 0 100 100"><path d="M40 86l-6 10M60 86l6 10" stroke="#C99A2E" stroke-width="5" stroke-linecap="round"/><path d="M18 50l-12-6M82 50l12-6" stroke="#C99A2E" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="52" r="36" fill="#BFE8FF" stroke="#7FC4EA" stroke-width="4"/><path d="M18 44h64" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M38 58q12-14 24 0q-12 14-24 0z" fill="#F28C28"/><path d="M62 58l10-8v16z" fill="#F28C28"/><circle cx="44" cy="56" r="2.4" fill="#1E2A56"/></svg>',
  mota:'<svg viewBox="0 0 100 100"><circle cx="24" cy="70" r="16" fill="#22263D"/><circle cx="76" cy="70" r="16" fill="#22263D"/><circle cx="24" cy="70" r="6" fill="#C9CCDA"/><circle cx="76" cy="70" r="6" fill="#C9CCDA"/><path d="M18 62q8-26 34-26h16l14 22z" fill="#E5484D"/><rect x="34" y="28" width="26" height="9" rx="4" fill="#2B2B33"/><path d="M74 44l8-14" stroke="#55628E" stroke-width="5" stroke-linecap="round"/><circle cx="86" cy="54" r="5" fill="#FFE07A"/></svg>',
  capacete:'<svg viewBox="0 0 100 100"><path d="M14 66q0-44 40-44q34 0 36 40v6H14z" fill="#E5484D"/><path d="M54 40h34q2 10 2 22H54z" fill="#BFE8FF" stroke="#2B2B33" stroke-width="3"/><rect x="12" y="66" width="80" height="10" rx="5" fill="#2B2B33"/><path d="M26 44q8-14 22-16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/></svg>',
  coroa:'<svg viewBox="0 0 100 100"><path d="M14 74l-4-44 22 18 18-26 18 26 22-18-4 44z" fill="#F7BC2F" stroke="#C98A06" stroke-width="3" stroke-linejoin="round"/><rect x="14" y="72" width="72" height="12" rx="4" fill="#E6A817"/><circle cx="50" cy="56" r="6" fill="#EE6FA0"/><circle cx="30" cy="62" r="4" fill="#3E92E0"/><circle cx="70" cy="62" r="4" fill="#2FB383"/></svg>',
  mapa:'<svg viewBox="0 0 100 100"><path d="M10 22l26-8 28 8 26-8v64l-26 8-28-8-26 8z" fill="#F4E3B5" stroke="#C9A86A" stroke-width="3" stroke-linejoin="round"/><path d="M36 14v64M64 22v64" stroke="#C9A86A" stroke-width="2"/><path d="M20 66q14-18 30-8t28-24" fill="none" stroke="#E5484D" stroke-width="3" stroke-dasharray="5 4"/><path d="M72 28l8 8M80 28l-8 8" stroke="#E5484D" stroke-width="4" stroke-linecap="round"/></svg>',
  sandes:'<svg viewBox="0 0 100 100"><path d="M12 70L50 18l38 52z" fill="#E9C27A" stroke="#C99A55" stroke-width="3" stroke-linejoin="round"/><path d="M18 70h64" stroke="#8FCB6E" stroke-width="8" stroke-linecap="round"/><path d="M16 78h68" stroke="#F3B44B" stroke-width="7" stroke-linecap="round"/><path d="M14 86h72" stroke="#E9C27A" stroke-width="8" stroke-linecap="round"/></svg>',
  estrela:'<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.3l6.6-.8z" fill="#F7BC2F" stroke="#C98A06" stroke-width=".8"/></svg>',
  borboleta:'<svg viewBox="0 0 100 100"><ellipse cx="30" cy="38" rx="22" ry="18" fill="#7FB3E8"/><ellipse cx="70" cy="38" rx="22" ry="18" fill="#7FB3E8"/><ellipse cx="34" cy="66" rx="15" ry="13" fill="#B79CEB"/><ellipse cx="66" cy="66" rx="15" ry="13" fill="#B79CEB"/><circle cx="28" cy="36" r="6" fill="#fff" opacity=".7"/><circle cx="72" cy="36" r="6" fill="#fff" opacity=".7"/><rect x="46" y="24" width="8" height="54" rx="4" fill="#3B2F4A"/><path d="M48 24q-8-12-14-14M52 24q8-12 14-14" stroke="#3B2F4A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  lua:'<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="20" fill="#1E2850"/><circle cx="56" cy="46" r="24" fill="#F4F1D8"/><circle cx="66" cy="38" r="22" fill="#1E2850"/><g fill="#fff"><circle cx="24" cy="24" r="2.5"/><circle cx="80" cy="74" r="2.5"/><circle cx="28" cy="72" r="2"/><circle cx="78" cy="20" r="2"/></g></svg>',
  lanterna:'<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="40" fill="#FFF3C4" opacity=".6"/><path d="M38 28q12-20 24 0" fill="none" stroke="#9AA3B5" stroke-width="5"/><rect x="32" y="28" width="36" height="52" rx="8" fill="#DDE2EA" stroke="#9AA3B5" stroke-width="4"/><rect x="40" y="38" width="20" height="32" rx="4" fill="#FFE07A"/><rect x="28" y="78" width="44" height="10" rx="5" fill="#9AA3B5"/></svg>',
  gelo:'<svg viewBox="0 0 100 100"><g stroke="#7FC4EA" stroke-width="7" stroke-linecap="round"><path d="M50 10v80M15 30l70 40M15 70l70-40"/></g><g stroke="#BFE8FF" stroke-width="5" stroke-linecap="round"><path d="M50 24l-8-8M50 24l8-8M50 76l-8 8M50 76l8 8"/></g><circle cx="50" cy="50" r="9" fill="#BFE8FF"/></svg>',
  arcoiris:'<svg viewBox="0 0 100 100"><g fill="none" stroke-width="7">'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#9A5BD6'].map((c,i)=>'<path d="M'+(8+i*6)+' 76A'+(42-i*6)+' '+(42-i*6)+' 0 0 1 '+(92-i*6)+' 76" stroke="'+c+'"/>').join('')+'</g><g fill="#fff"><ellipse cx="16" cy="80" rx="14" ry="8"/><ellipse cx="84" cy="80" rx="14" ry="8"/></g></svg>',
  escama:'<svg viewBox="0 0 100 100"><path d="M50 10q30 22 26 52q-6 26-26 30q-20-4-26-30q-4-30 26-52z" fill="#F7B6D2" stroke="#EE6FA0" stroke-width="4"/><path d="M40 34q4-10 12-14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/><g fill="#fff"><path d="M74 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M22 70l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/></g></svg>'
};
const CARAS={alegre:'#F7BC2F',triste:'#7FB3E8',medo:'#B79CEB',zangada:'#F2786A',calma:'#7FD1A8'};
function cara(t){
  const c=CARAS[t]; let f='';
  if(t==='alegre') f='<circle cx="36" cy="42" r="5"/><circle cx="64" cy="42" r="5"/><path d="M30 60q20 22 40 0" fill="none" stroke="#3B2A10" stroke-width="5" stroke-linecap="round"/>';
  if(t==='triste') f='<circle cx="36" cy="44" r="5"/><circle cx="64" cy="44" r="5"/><path d="M32 72q18-16 36 0" fill="none" stroke="#1E2A56" stroke-width="5" stroke-linecap="round"/><path d="M34 52q-4 8 0 12q4-4 0-12z" fill="#3E92E0"/>';
  if(t==='medo') f='<circle cx="36" cy="44" r="8" fill="#fff" stroke="#1E2A56" stroke-width="3"/><circle cx="64" cy="44" r="8" fill="#fff" stroke="#1E2A56" stroke-width="3"/><circle cx="36" cy="45" r="3"/><circle cx="64" cy="45" r="3"/><path d="M28 30l12-4M72 30l-12-4" stroke="#1E2A56" stroke-width="4" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="7" ry="9" fill="#1E2A56"/>';
  if(t==='zangada') f='<path d="M26 32l18 8M74 32l-18 8" stroke="#3B1A10" stroke-width="5" stroke-linecap="round"/><circle cx="37" cy="46" r="5"/><circle cx="63" cy="46" r="5"/><path d="M34 70q16-10 32 0" fill="none" stroke="#3B1A10" stroke-width="5" stroke-linecap="round"/>';
  if(t==='calma') f='<path d="M28 44q8 6 16 0M56 44q8 6 16 0" fill="none" stroke="#1E3A2A" stroke-width="4.5" stroke-linecap="round"/><path d="M38 64q12 8 24 0" fill="none" stroke="#1E3A2A" stroke-width="4.5" stroke-linecap="round"/><circle cx="28" cy="58" r="6" fill="#F48FB8" opacity=".6"/><circle cx="72" cy="58" r="6" fill="#F48FB8" opacity=".6"/>';
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="'+c+'"/><g fill="#1E2A56">'+f+'</g></svg>';
}
/* ---------- Guardar progresso (só neste telemóvel) ---------- */
function ler(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } }
function gravar(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
/* Reposição pedida no backoffice: apaga o progresso deste telemóvel uma única vez por pedido */
try{ const t=C.reset||''; if(t && localStorage.getItem('ami-reset')!==t){ Object.keys(localStorage).filter(k=>/^(ami-feito|rec-|fac-|part-niv)/.test(k)).forEach(k=>localStorage.removeItem(k)); localStorage.setItem('ami-reset',t); } }catch(e){}
let feito = ler('ami-feito',{})||{};
let somOn = ler('ami-som',true);
const nEstrelas = () => Object.keys(feito).length;

/* ---------- Sons (Web Audio) ---------- */
let actx=null;
function ctx(){ try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); return actx; }catch(e){ return null; } }
function tom(f,t0,d,tipo,vol){ const c=actx,o=c.createOscillator(),g=c.createGain(); o.type=tipo||'sine'; o.frequency.setValueAtTime(f,t0); g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol||.18,t0+.015); g.gain.exponentialRampToValueAtTime(.001,t0+d); o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0+d+.02); return o; }
function sfx(n){
  if(!somOn) return; const c=ctx(); if(!c) return; const t=c.currentTime;
  if(n==='pop'){ const o=tom(520,t,.12,'sine',.16); o.frequency.exponentialRampToValueAtTime(880,t+.08); }
  else if(n==='certo'){ [660,880,1320].forEach((f,i)=>tom(f,t+i*.09,.28,'triangle',.15)); }
  else if(n==='errado'){ const o=tom(300,t,.25,'sine',.14); o.frequency.exponentialRampToValueAtTime(190,t+.22); }
  else if(n==='virar'){ const o=tom(900,t,.14,'triangle',.06); o.frequency.exponentialRampToValueAtTime(350,t+.12); }
  else if(n==='estrela'){ [988,1319,1568,1976].forEach((f,i)=>tom(f,t+i*.07,.35,'sine',.12)); }
  else if(n==='plim'){ tom(1568,t,.5,'sine',.14); tom(2093,t+.05,.45,'sine',.08); }
}

/* ---------- Voz (provisória: voz do telemóvel) ---------- */
let vozes=[]; function carregaVozes(){ try{ vozes=speechSynthesis.getVoices(); }catch(e){} }
try{ carregaVozes(); speechSynthesis.onvoiceschanged=carregaVozes; }catch(e){}
const vozPT = () => vozes.find(v=>/pt[-_]PT/i.test(v.lang)) || vozes.find(v=>/^pt/i.test(v.lang));
let filaId=0;
function calar(){ filaId++; try{ speechSynthesis.cancel(); }catch(e){} document.querySelectorAll('.w.ag,.lendo').forEach(w=>w.classList.remove('ag','lendo')); }
/* partes: [{t, quem, el}]: fala uma a uma e acende a palavra a ser dita */
function falarFila(partes, fim){
  calar(); const id=filaId; let i=0;
  const seg=()=>{
    if(id!==filaId) return;
    if(i>=partes.length){ document.querySelectorAll('.w.ag,.lendo').forEach(w=>w.classList.remove('ag','lendo')); if(fim) fim(); return; }
    const p=partes[i++]; const tm=TOM[p.quem]||TOM.narr; document.querySelectorAll('.lendo').forEach(x=>x.classList.remove('lendo')); if(p.alvo) p.alvo.classList.add('lendo');
    let feitoU=false; const prox=()=>{ if(feitoU) return; feitoU=true; setTimeout(seg,250); };
    try{
      if(!('speechSynthesis' in window)) throw 0;
      const u=new SpeechSynthesisUtterance(p.t); u.lang='pt-PT'; const v=vozPT(); if(v) u.voice=v; u.pitch=tm.p; u.rate=tm.r;
      if(p.el){ const ws=[...p.el.querySelectorAll('.w')]; u.onboundary=e=>{ if(id!==filaId) return; let a=null; for(const w of ws){ if(+w.dataset.s<=e.charIndex) a=w; else break; } ws.forEach(w=>w.classList.toggle('ag',w===a)); }; }
      u.onend=prox; u.onerror=prox; speechSynthesis.speak(u);
      setTimeout(()=>{ if(id===filaId && !speechSynthesis.speaking && !speechSynthesis.pending) prox(); }, 1500 + p.t.length*90);
    }catch(e){ setTimeout(prox, 900 + p.t.length*55); }
  };
  seg();
}
const falar = (t,quem,fim) => falarFila([{t,quem}],fim);
function palavras(t){ let h='',pos=0; t.split(/(\s+)/).forEach(tok=>{ if(/^\s+$/.test(tok)||!tok){ h+=tok; } else { h+='<span class="w" data-s="'+pos+'">'+esc(tok)+'</span>'; } pos+=tok.length; }); return h; }
const esc = s => String(s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ---------- Cenários (provisórios, até haver ilustrações) ---------- */
const CENAS = {
  quarto:{dentro:'quarto'}, sala:{dentro:'sala'},
  rua:{ceu:['#9ED6FF','#E3F4FF'],chao:'#8FD07A',chao2:'#7BC267',sol:1,nuvens:'#fff',casas:1},
  portao:{ceu:['#BFCDDC','#E5EBF1'],chao:'#ACB596',chao2:'#9CA587',nuvens:'#F3F5F7',arvores:'#92A38A',portao:1},
  triste:{ceu:['#B4C0CC','#DDE3E8'],chao:'#B0B39A',chao2:'#A0A38B',nuvens:'#ECEFF2',arvores:'#92A38A',flores:1},
  rio:{ceu:['#BBC9D6','#E2E9EE'],chao:'#B1BC99',chao2:'#A2AD8A',nuvens:'#F0F2F5',arvores:'#92A38A',rio:'#97AAB6'},
  pedra:{ceu:['#BBC9D6','#E2E9EE'],chao:'#B1BC99',chao2:'#A2AD8A',nuvens:'#F0F2F5',rio:'#97AAB6',pedra:1,arvores:'#92A38A'},
  campo:{ceu:['#C3D0DC','#E8EDF1'],chao:'#B6C29C',chao2:'#A7B48D',nuvens:'#F2F4F6',margaridas:1},
  estrada:{ceu:['#C3D0DC','#E8EDF1'],chao:'#B3BE98',chao2:'#A5B08A',nuvens:'#F2F4F6',estrada:1,arvores:'#97A68E'},
  floresta:{ceu:['#AFC0C6','#D9E3E2'],chao:'#93A27F',chao2:'#869572',arvoreGrande:1},
  mata:{ceu:['#9DB3B2','#C9D8D2'],chao:'#869672',chao2:'#7A8A66',mata:1},
  castelo:{ceu:['#C8CCE6','#ECEBF6'],chao:'#AEB99A',chao2:'#A1AC8C',nuvens:'#F6F4FA',castelo:1},
  caverna:{ceu:['#AEBBC4','#D7DEE2'],chao:'#99A285',chao2:'#8A9377',caverna:1},
  colina:{ceu:['#C9DDEE','#EEF5FA'],chao:'#E9F1F7',chao2:'#DCE7F0',nuvens:'#fff',colina:1},
  bosque:{ceu:['#1E2850','#3B4A7C'],chao:'#C9D6E8',chao2:'#B4C3DA',bosque:1,estrelas:1},
  torre:{ceu:['#A4AEBC','#CFD5DC'],chao:'#A9B293',chao2:'#9BA486',torre:1},
  fonte:{ceu:['#BBC9D6','#E2E9EE'],chao:'#B1BC99',chao2:'#A2AD8A',nuvens:'#F0F2F5',arvores:'#92A38A',fonte:1},
  feliz:{ceu:['#7FC8FF','#DDF1FF'],chao:'#7CCB6A',chao2:'#64B957',sol:1,nuvens:'#fff',arvores:'#4FB063',rio:'#5BB8EC',flores:'feliz'},
  ceu:{ceu:['#F7C6DD','#BFE2FF'],nuvensGrandes:1}
};
const BORB=(x,y,s,c1,c2,r)=>'<g transform="translate('+x+' '+y+') scale('+s+') rotate('+(r||0)+')"><ellipse cx="-7" cy="-4" rx="8" ry="6" fill="'+c1+'"/><ellipse cx="7" cy="-4" rx="8" ry="6" fill="'+c1+'"/><ellipse cx="-5" cy="5" rx="5" ry="4" fill="'+c2+'"/><ellipse cx="5" cy="5" rx="5" ry="4" fill="'+c2+'"/><rect x="-1.2" y="-8" width="2.4" height="16" rx="1.2" fill="#3B2F4A"/></g>';
let cid=0;
function cena(key, quem=[], o={}){
  const c=CENAS[key]||CENAS.rio; let s=''; const id='g'+(++cid);
  if(c.dentro==='quarto'){
    s+='<rect width="400" height="250" fill="'+(o.noite?'#E9D3E4':'#FCE6EE')+'"/><g fill="#F8D3E0" opacity=".7">'+[40,120,200,280,360].map(x=>'<circle cx="'+x+'" cy="24" r="5"/><circle cx="'+(x+40)+'" cy="64" r="5"/><circle cx="'+x+'" cy="104" r="5"/>').join('')+'</g><rect y="198" width="400" height="52" fill="#E9CBAA"/>';
    s+='<rect x="258" y="30" width="118" height="110" rx="14" fill="#fff"/><rect x="266" y="38" width="102" height="94" rx="8" fill="'+(o.noite?'#33407A':'#BFE3FF')+'"/>'+(o.noite?'<circle cx="345" cy="62" r="10" fill="#FFF3C4"/>':'<circle cx="345" cy="62" r="11" fill="#FFE07A"/>');
    if(o.passaro) s+='<path d="M290 80q8-9 16 0q8-9 16 0" fill="none" stroke="#4A4A6A" stroke-width="3.5" stroke-linecap="round"/>';
    s+='<path d="M317 38v94M266 85h102" stroke="#fff" stroke-width="6"/><rect x="252" y="136" width="130" height="10" rx="5" fill="#fff"/>';
    s+='<rect x="16" y="146" width="156" height="58" rx="18" fill="#F4A9C6"/><rect x="16" y="128" width="48" height="32" rx="12" fill="#fff"/><rect x="22" y="200" width="10" height="16" rx="3" fill="#C69A74"/><rect x="156" y="200" width="10" height="16" rx="3" fill="#C69A74"/>';
    s+='<g transform="translate(205 70)"><circle r="24" fill="#fff" stroke="#9A78E8" stroke-width="5"/><path d="M0 0V-13M0 0h10" stroke="#1E2A56" stroke-width="3.5" stroke-linecap="round"/>'+(o.relogio?'<g transform="translate(0 46)"><rect x="-34" y="-13" width="68" height="24" rx="12" fill="#9A78E8"/><text y="4" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="800" fill="#fff">parado!</text></g>':'')+'</g>';
    if(o.desenho) s+='<g transform="translate(36 132) rotate(-9)"><rect width="40" height="30" rx="3" fill="#fff" stroke="#E2C6D2" stroke-width="2"/><circle cx="14" cy="13" r="6" fill="#F7BC2F"/><path d="M24 20h10" stroke="#EE6FA0" stroke-width="3" stroke-linecap="round"/></g>';
    if(o.caneca) s+='<g transform="translate(330 112)"><rect x="-12" y="-22" width="24" height="24" rx="4" fill="#fff" stroke="#9A78E8" stroke-width="2.5"/><path d="M12 -16q9 0 9 7t-9 7" fill="none" stroke="#9A78E8" stroke-width="2.5"/><path d="M-7 -6q3-7 7-3l3-4 2 5q3 0 3 3h-14z" fill="#2FB383"/><path d="M-4 -30q-3-5 0-9M3 -30q-3-5 0-9" stroke="#C9D2E6" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  } else if(c.dentro==='sala'){
    s+='<rect width="400" height="250" fill="#5C5480"/><rect y="200" width="400" height="50" fill="#463F66"/><circle cx="330" cy="70" r="38" fill="#A8B8D8"/><path d="M330 32v76M292 70h76" stroke="#5C5480" stroke-width="5"/>';
    [[30,60],[30,120]].forEach(([x,y])=>{ s+='<rect x="'+x+'" y="'+(y+28)+'" width="220" height="6" rx="3" fill="#8B7355"/>'; ['#EE6FA0','#F7BC2F','#2FB383','#3E92E0','#9A78E8','#F28C28','#E5484D'].forEach((cor,i)=>{ s+='<rect x="'+(x+8+i*30)+'" y="'+(y+6+(i%2)*4)+'" width="16" height="'+(22-(i%2)*4)+'" rx="5" fill="'+cor+'" opacity=".9"/><rect x="'+(x+12+i*30)+'" y="'+(y+2+(i%2)*4)+'" width="8" height="6" rx="2" fill="#C9B79C"/>'; }); });
  } else {
    s+='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.ceu[0]+'"/><stop offset="1" stop-color="'+c.ceu[1]+'"/></linearGradient></defs><rect width="400" height="250" fill="url(#'+id+')"/>';
    if(c.estrelas) s+='<g fill="#fff">'+[[40,30],[90,60],[150,25],[220,50],[300,30],[360,70],[260,90],[120,100]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="1.6" opacity=".8"/>').join('')+'</g><circle cx="330" cy="44" r="16" fill="#F4F1D8"/><circle cx="337" cy="40" r="14" fill="#1E2850"/>';
    if(c.sol) s+='<circle cx="342" cy="46" r="34" fill="#FFE9A0" opacity=".6"/><circle cx="342" cy="46" r="24" fill="#FFD86B"/>';
    if(c.nuvens) s+='<g fill="'+c.nuvens+'"><ellipse cx="78" cy="50" rx="40" ry="15"/><ellipse cx="104" cy="40" rx="26" ry="16"/><ellipse cx="236" cy="32" rx="32" ry="11"/><ellipse cx="256" cy="26" rx="18" ry="10"/></g>';
    if(c.nuvensGrandes) s+='<g fill="#fff">'+[[70,170,60],[190,200,70],[320,165,62],[110,70,40],[300,60,46]].map(([x,y,r])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*.42)+'"/><ellipse cx="'+(x-r*.35)+'" cy="'+(y-r*.25)+'" rx="'+(r*.45)+'" ry="'+(r*.38)+'"/><ellipse cx="'+(x+r*.3)+'" cy="'+(y-r*.3)+'" rx="'+(r*.5)+'" ry="'+(r*.45)+'"/>').join('')+'</g>';
    if(o.arco) s+='<g fill="none" stroke-width="7" opacity=".85">'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#4B4BB5','#9A5BD6'].map((cr,i)=>'<path d="M'+(20+i*7)+' 180 A'+(180-i*7)+' '+(150-i*7)+' 0 0 1 '+(380-i*7)+' 180" stroke="'+cr+'"/>').join('')+'</g>';
    if(c.casas) s+='<g><rect x="244" y="118" width="62" height="60" rx="6" fill="#FFE3EE"/><path d="M236 122l39-32 39 32z" fill="#EE6FA0" stroke="#EE6FA0" stroke-width="6" stroke-linejoin="round"/><rect x="266" y="146" width="18" height="32" rx="9" fill="#9A78E8"/><rect x="316" y="132" width="54" height="46" rx="6" fill="#EEE7FB"/><path d="M309 135l34-26 34 26z" fill="#9A78E8" stroke="#9A78E8" stroke-width="6" stroke-linejoin="round"/></g>';
    if(c.castelo) s+='<g transform="translate(250 60)"><rect x="10" y="40" width="110" height="82" rx="6" fill="#C7B3EE"/><rect x="0" y="20" width="32" height="102" rx="5" fill="#B39BE6"/><rect x="98" y="20" width="32" height="102" rx="5" fill="#B39BE6"/><path d="M-4 22l20-34 20 34z" fill="#8F6FD6"/><path d="M94 22l20-34 20 34z" fill="#8F6FD6"/><path d="M16 -12v-14l12 5-12 5" fill="#EE6FA0"/><path d="M114 -12v-14l12 5-12 5" fill="#F7BC2F"/><path d="M50 122v-30a15 15 0 0 1 30 0v30z" fill="#7553C2"/><circle cx="16" cy="56" r="7" fill="#F4EEFF"/><circle cx="114" cy="56" r="7" fill="#F4EEFF"/></g><g transform="translate(220 176)"><rect x="-3" y="0" width="6" height="12" fill="#F4EEFF"/><path d="M-12 2a12 9 0 0 1 24 0z" fill="#E5484D"/><circle cx="-4" cy="-2" r="2" fill="#fff"/><circle cx="4" cy="-4" r="1.6" fill="#fff"/></g>';
    if(c.torre) s+='<g><rect x="250" y="40" width="70" height="150" rx="6" fill="#8E95A6"/><path d="M244 44l41-34 41 34z" fill="#6C7385"/><circle cx="285" cy="72" r="12" fill="#3E4558"/><rect x="274" y="'+(o.escada?150:150)+'" width="22" height="40" rx="11" fill="#5A6074"/><g fill="#7B8296">'+[60,90,120].map(y=>'<rect x="256" y="'+y+'" width="12" height="8" rx="2"/><rect x="300" y="'+(y+14)+'" width="12" height="8" rx="2"/>').join('')+'</g></g>'+(o.escada?'':'<g fill="#7D8496"><ellipse cx="270" cy="22" rx="46" ry="16"/><ellipse cx="300" cy="14" rx="34" ry="14"/></g><g stroke="#8FA0B8" stroke-width="2" stroke-linecap="round">'+[250,268,286,304,322].map(x=>'<path d="M'+x+' 38l-3 9"/>').join('')+'</g>');
    if(c.chao) s+='<path d="M0 176 Q100 156 200 176 T400 168 V250 H0Z" fill="'+c.chao+'"/><path d="M0 205 Q120 190 240 206 T400 200 V250 H0Z" fill="'+c.chao2+'"/>';
    if(c.colina) s+='<path d="M60 200 Q200 70 360 200Z" fill="#fff"/><path d="M120 150 Q200 90 280 150" fill="none" stroke="#DCE8F3" stroke-width="6"/><ellipse cx="290" cy="150" rx="30" ry="18" fill="#A3A5B5"/><ellipse cx="286" cy="141" rx="20" ry="7" fill="#EDF3F9"/>';
    if(c.estrada) s+='<path d="M0 214 Q200 196 400 210 V236 Q200 222 0 240Z" fill="#9A9AA6"/><path d="M10 226 Q200 210 390 222" fill="none" stroke="#F4EEDA" stroke-width="3" stroke-dasharray="14 12"/>';
    if(c.caverna) s+='<path d="M170 200 Q180 60 300 70 Q400 80 400 200Z" fill="#8C8A97"/><path d="M230 200 Q232 120 280 118 Q330 120 332 200Z" fill="#26243A"/><path d="M190 120q20-20 40-10M330 100q20 0 30 20" stroke="#A5A3B0" stroke-width="5" fill="none" stroke-linecap="round"/>';
    if(c.arvores) s+=['30','372'].map(x=>'<g transform="translate('+x+' 0)"><rect x="-7" y="126" width="14" height="56" rx="5" fill="#8D6E52"/><circle cy="112" r="32" fill="'+c.arvores+'"/><circle cx="-18" cy="130" r="20" fill="'+c.arvores+'"/><circle cx="18" cy="130" r="20" fill="'+c.arvores+'"/></g>').join('');
    if(c.arvoreGrande) s+='<g><rect x="300" y="40" width="40" height="160" rx="10" fill="#6E5640"/><circle cx="320" cy="40" r="70" fill="#5E7D57"/><circle cx="260" cy="70" r="45" fill="#6B8A62"/><circle cx="380" cy="80" r="40" fill="#6B8A62"/><rect x="20" y="90" width="18" height="110" rx="6" fill="#7A6049"/><circle cx="29" cy="80" r="38" fill="#6B8A62"/></g>';
    if(c.mata) s+='<g>'+[[20,0,'#5D7A55'],[90,10,'#4F6D49'],[170,-5,'#5D7A55'],[250,8,'#4F6D49'],[330,0,'#5D7A55'],[390,10,'#4F6D49']].map(([x,dy,cr])=>'<rect x="'+(x-8)+'" y="'+(70+dy)+'" width="16" height="'+(130-dy)+'" rx="5" fill="#6E5640"/><circle cx="'+x+'" cy="'+(60+dy)+'" r="40" fill="'+cr+'"/>').join('')+'</g><g fill="#6E8F5F">'+[60,140,300].map(x=>'<path d="M'+x+' 205q-14-20-2-34q4 18 2 34zM'+(x+6)+' 205q14-20 2-34q-4 18-2 34z"/>').join('')+'</g>';
    if(c.bosque) s+='<g>'+[[30,'#16203F'],[110,'#1C2750'],[200,'#16203F'],[290,'#1C2750'],[370,'#16203F']].map(([x,cr])=>'<rect x="'+(x-7)+'" y="60" width="14" height="140" fill="#2A2238"/><path d="M'+(x-34)+' 150l34-110 34 110z" fill="'+cr+'"/>').join('')+'</g><g fill="#fff" opacity=".7">'+[50,130,240,330].map(x=>'<path d="M'+x+' 205l3-6 3 6-6 0z"/>').join('')+'</g>';
    if(c.portao) s+='<g stroke="#55628E" stroke-width="6" stroke-linecap="round"><path d="M118 182V98M282 182V98"/><path d="M118 108 Q200 80 282 108" fill="none"/><g stroke-width="3.5">'+[140,160,180,200,220,240,260].map((x,i)=>'<path d="M'+x+' 182V'+(104-Math.min(i,6-i)*3)+'"/>').join('')+'</g></g><text x="200" y="92" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#55628E">Parque dos Sonhos</text>';
    if(c.rio) s+='<path d="M0 214 Q100 198 200 214 T400 206 V234 Q300 222 200 238 T0 232Z" fill="'+c.rio+'"/><path d="M60 222h30M220 226h24M320 218h28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="'+(key==='feliz'?.9:.5)+'"/>';
    if(c.pedra) s+='<ellipse cx="300" cy="196" rx="76" ry="27" fill="#A3A5B5"/><ellipse cx="290" cy="186" rx="52" ry="12" fill="#BCBECB"/>';
    if(c.fonte) s+='<g transform="translate(300 150)"><ellipse cx="0" cy="44" rx="70" ry="16" fill="#9EA3B4"/><rect x="-60" y="22" width="120" height="22" fill="#B4B9C8"/><ellipse cx="0" cy="22" rx="60" ry="12" fill="'+(o.acesa?'#8FD7FF':'#8C99A6')+'"/><rect x="-8" y="-24" width="16" height="44" rx="4" fill="#B4B9C8"/><ellipse cx="0" cy="-24" rx="26" ry="7" fill="#B4B9C8"/>'+(o.acesa?'<circle cx="0" cy="-10" r="60" fill="#FFE08A" opacity=".35"/><g fill="#FFF3B0">'+[[-30,-40],[25,-50],[40,-10],[-45,0],[0,-62]].map(([x,y])=>'<path d="M'+x+' '+(y-7)+'l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>').join('')+'</g><path d="M0 -30q-20 -30 -40 6M0 -30q20 -30 40 6" stroke="#BDE9FF" stroke-width="4" fill="none"/>':'')+'</g>';
    if(c.margaridas) s+=[30,70,110,150,190,230,270,310,350,385].map((x,i)=>'<g transform="translate('+x+' '+(198+(i%3)*8)+')"><path d="M0 0v-12" stroke="#7D8C6E" stroke-width="2.5"/><circle cy="-14" r="5" fill="#E9E7DE"/><circle cy="-14" r="2.2" fill="#D9C27A"/></g>').join('');
    if(c.flores==='feliz') s+=[40,100,150,230,280,350].map((x,i)=>'<g transform="translate('+x+' '+(204+(i%2)*10)+')"><path d="M0 0v-16" stroke="#3E8E3E" stroke-width="3"/><g fill="'+['#EE6FA0','#F7BC2F','#9A78E8','#E5484D','#3E92E0','#F28C28'][i]+'"><circle cx="0" cy="-24" r="5"/><circle cx="6" cy="-18" r="5"/><circle cx="-6" cy="-18" r="5"/><circle cx="0" cy="-13" r="5"/></g><circle cy="-19" r="3.5" fill="#FFF3C4"/></g>').join('');
    else if(c.flores) s+=[64,150,232,330].map(x=>'<g transform="translate('+x+' 204)"><path d="M0 0v-16" stroke="#7D8C6E" stroke-width="3" stroke-linecap="round"/><path d="M0 -16q9 6 6 13" fill="none" stroke="#B9A6B8" stroke-width="6" stroke-linecap="round"/></g>').join('');
  }
  /* objetos por cima do cenário */
  if(o.escada) s+='<g fill="none" stroke-width="6" stroke-linecap="round">'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#9A5BD6'].map((cr,i)=>'<path d="M'+(120+i*6)+' 205 Q'+(150+i*4)+' '+(120-i*3)+' '+(274-i*2)+' '+(158+i*5)+'" stroke="'+cr+'"/>').join('')+'</g>';
  if(o.mapa) s+='<g transform="translate(250 30)"><rect width="130" height="88" rx="10" fill="#BFEFFF" opacity=".55" stroke="#7FD6F7" stroke-width="2"/><path d="M14 60q30-40 60-10t45-30" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5"/>'+[[24,58],[62,30],[110,22],[88,66]].map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="#FFD86B" opacity=".6"/><circle cx="'+x+'" cy="'+y+'" r="4" fill="#F7BC2F"/>'+(i===3?'<path d="M'+(x+8)+' '+y+'h12m-4-4 4 4-4 4" stroke="#F7BC2F" stroke-width="2" fill="none"/>':'')).join('')+'</g>';
  if(o.luz) s+='<g transform="translate('+(c.dentro||key==='caverna'?282:330)+' '+(key==='caverna'?168:120)+')"><circle r="34" fill="#FFE08A" opacity=".3"/><circle r="20" fill="#FFE9A0" opacity=".7"/><circle r="11" fill="#FFF8DC"/></g>';
  if(o.lanterna) s+='<g transform="translate(282 160)"><circle r="30" fill="#FFF3C4" opacity=".35"/><rect x="-8" y="-12" width="16" height="22" rx="4" fill="#DDE2EA" stroke="#9AA3B5" stroke-width="2"/><rect x="-5" y="-8" width="10" height="13" rx="2" fill="#FFE9A0"/><path d="M-5 -12q5-8 10 0" fill="none" stroke="#9AA3B5" stroke-width="2"/></g>';
  if(o.mota) s+='<g transform="translate(330 196)"><circle cx="-26" cy="10" r="12" fill="#22263D"/><circle cx="26" cy="10" r="12" fill="#22263D"/><circle cx="-26" cy="10" r="4" fill="#C9CCDA"/><circle cx="26" cy="10" r="4" fill="#C9CCDA"/><path d="M-30 4q6-18 26-18h18l12 14z" fill="#E5484D"/><rect x="-14" y="-18" width="22" height="7" rx="3" fill="#2B2B33"/><path d="M22 -12l8-10" stroke="#55628E" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="-4" r="4" fill="#FFE07A"/></g>';
  if(o.borboletas){ const cs=[['#7FB3E8','#B79CEB'],['#F48FB8','#F7BC2F'],['#9FE0C0','#7FB3E8'],['#F7BC2F','#F28C28']]; for(let i=0;i<o.borboletas;i++){ const x=40+((i*73)%330), y=30+((i*41)%110); s+=BORB(x,y,.9+(i%3)*.2,cs[i%4][0],cs[i%4][1],(i%5)*12-24); } }
  if(o.escamas) s+='<g fill="#F7B6D2" stroke="#fff" stroke-width="1.5">'+[[60,40],[120,90],[200,30],[260,110],[330,60],[160,150],[90,130],[300,150]].map(([x,y],i)=>'<path transform="translate('+x+' '+y+') rotate('+(i*37)+')" d="M0 -8q7 4 0 14q-7-10 0-14z"/>').join('')+'</g>';
  if(o.balde){ const bx = quem.length ? 312 : 290; s+='<g class="balde-c" transform="translate('+bx+' '+(c.dentro?128:140)+') scale(.62)">'+BALDE.replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</g>'; }
  const temObj=o.balde||o.luz||o.mota||o.lanterna||o.mapa||(c.dentro==='quarto')||c.castelo||c.torre||c.caverna||c.fonte||c.arvoreGrande;
  const n=quem.length, tam = n<=1?120:n==2?106:n==3?88:n==4?74:62, larg = temObj?(c.dentro==='quarto'&&!o.balde?380:250):380, x0 = 10+(larg-n*tam-(n-1)*8)/2;
  quem.forEach((k,i)=>{
    const x=x0+i*(tam+8), y=224-tam, cl=id+'c'+i, cx=x+tam/2, cy=y+tam/2;
    s+='<g class="pers entra-p" data-k="'+k+'" style="animation-delay:'+(150+i*90)+'ms" role="button" tabindex="0" aria-label="'+(NOME[k]||k)+'"><clipPath id="'+cl+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+(tam/2)+'"/></clipPath>'+
      '<ellipse cx="'+cx+'" cy="'+(y+tam+4)+'" rx="'+(tam*.38)+'" ry="6" fill="#000" opacity=".12"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(tam/2+5)+'" fill="#fff"/>'+
      '<image href="'+IMG[k]+'" x="'+x+'" y="'+y+'" width="'+tam+'" height="'+tam+'" clip-path="url(#'+cl+')" preserveAspectRatio="xMidYMid slice"/></g>';
  });
  return '<svg viewBox="0 0 400 250" role="img" aria-label="'+(quem.map(k=>NOME[k]).join(', ')||'Cenário')+'">'+s+'</svg>';
}

const LIVROS = C.livros||[];

/* ---------- Estrutura ---------- */
const vista=document.getElementById('vista');
let tab='historias';
const TABS=['historias','aprender','jogos','musicas'];

function topo(){
  return '<header class="topo entra" style="--i:0"><span class="avatar"><img src="'+IMG.francisca+'" alt=""></span><div class="tx"><h1>Olá, Francisca!</h1><p>'+({historias:'Que história vamos ler?',aprender:'O Banzé tem coisas para te ensinar.',jogos:'O Balu quer brincar contigo!',musicas:'A Coelhita quer cantar.'})[tab]+'</p></div>'+
    '<span class="contador" id="contador" aria-label="'+nEstrelas()+' estrelas"><span class="b">'+BALDE+'</span><span id="n-estr">'+nEstrelas()+'</span></span>'+
    '<button class="som-t" id="som-t" aria-label="'+(somOn?'Desligar sons':'Ligar sons')+'">'+ic(somOn?'volume-2':'volume-x',somOn?'♪':'×')+'</button></header>';
}
function render(){
  document.body.dataset.zona=tab;
  let h=topo();
  if(tab==='historias') h+=vHistorias();
  else if(tab==='aprender') h+=vAprender();
  else if(tab==='jogos') h+=vJogos();
  else h+=vMusicas();
  vista.innerHTML=h; icones();
  const i=TABS.indexOf(tab);
  document.querySelectorAll('#nav button').forEach((b,k)=>b.setAttribute('aria-current',k===i?'page':'false'));
  document.getElementById('nav-ind').style.transform='translateX('+(i*100)+'%)';
  document.getElementById('som-t').onclick=()=>{ somOn=!somOn; gravar('ami-som',somOn); if(!somOn) calar(); else sfx('pop'); render(); };
  if(tab==='historias') desenhaFio();
  if(tab==='musicas') ligarMusicas();
}
function atualIdx(){ const i=LIVROS.findIndex(l=>l.pags&&l.pags.length && !feito['livro'+l.n]); return i<0?0:i; }
function vHistorias(){
  const a=atualIdx(), l=LIVROS[a], p=l.pags[0];
  let h='<section class="continuar entra" style="--i:1"><div class="cena-mini">'+cena(p.c,p.q||[],Object.assign({balde:p.b},p.o||{}))+'</div><div class="info"><span class="rot">'+(feito['livro'+l.n]?'Ler outra vez':'Livro '+l.n)+'</span><h2>'+esc(l.t)+'</h2><button class="btn btn-ouro largo" data-livro="'+a+'">'+ic('book-open','›')+' Ler agora</button></div></section>';
  h+='<h2 class="sec-t entra" style="--i:2">O caminho do balde</h2><p class="sec-s entra" style="--i:2">Catorze livrinhos. Juntos, contam a aventura toda.</p>';
  h+='<div class="caminho entra" style="--i:3" id="caminho"><svg class="fio" id="fio" aria-hidden="true"></svg>';
  const xs=[50,74,50,26];
  LIVROS.forEach((l,i)=>{
    const ok=!!(l.pags&&l.pags.length), lido=feito['livro'+l.n], at=ok&&i===a&&!lido;
    const cls=lido?'lido':at?'atual':ok?'':'breve';
    h+='<div class="no '+cls+'" data-x="'+xs[i%4]+'"><button class="no-b" style="left:'+xs[i%4]+'%" '+(ok?'data-livro="'+i+'"':'data-breve="'+i+'"')+' aria-label="Livro '+l.n+': '+esc(l.t)+(ok?'':', em breve')+'">'+
      '<span class="no-c"><img src="'+IMG[l.capa]+'" alt="" loading="lazy"><span class="no-n">'+(lido?ic('check','✓'):l.n)+'</span>'+(l.luz?'<span class="luz-m" title="Aqui encontra-se uma Luz"></span>':'')+'</span><span class="no-t">'+esc(l.t)+'</span></button></div>';
  });
  return h+'</div>';
}
function desenhaFio(){
  const cam=document.getElementById('caminho'), fio=document.getElementById('fio'); if(!cam) return;
  const W=cam.clientWidth, nos=[...cam.querySelectorAll('.no')];
  const pts=nos.map(n=>[W*(+n.dataset.x)/100, n.offsetTop+58]);
  let d='M'+pts[0][0]+' '+pts[0][1];
  for(let i=1;i<pts.length;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i], m=(y0+y1)/2; d+=' C'+x0+' '+m+' '+x1+' '+m+' '+x1+' '+y1; }
  const a=atualIdx();
  fio.setAttribute('viewBox','0 0 '+W+' '+cam.clientHeight);
  fio.innerHTML='<path d="'+d+'" fill="none" stroke="var(--cartao)" stroke-width="18" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="var(--z)" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 16" opacity=".55"/>';
}
window.addEventListener('resize',()=>{ if(tab==='historias') desenhaFio(); });

function tile(id,cls,img,t,s,i,grande){
  return '<button class="tile '+cls+(grande?' grande':'')+' entra" style="--i:'+i+'" data-abrir="'+id+'"><span class="padrao"></span><span class="fig"><img src="'+IMG[img]+'" alt=""></span>'+(feito[id]?'<span class="feito">'+ESTRELA.replace('<svg','<svg width="14" height="14"')+' Feito</span>':'')+'<h3>'+esc(t)+'</h3><p>'+esc(s)+'</p></button>';
}
function vAprender(){
  return '<h2 class="sec-t entra" style="--i:1">Aprender com os amigos</h2><p class="sec-s entra" style="--i:1">Coisas importantes, contadas por quem já passou por elas.</p><div class="bento">'+
    tile('sentir','t-verde','gelino','Como te sentes?','Os amigos ajudam com as emoções',2,1)+
    tile('dentes','t-azul','tuninho','Dentes a brilhar','Dois minutos com o Tuninho',3)+
    tile('partilhar','t-ouro','joao','Partilhar','Dividir e ajudar',4)+
    tile('sabias','t-lilas','girafa','Sabias que…?','200 factos curiosos em 10 temas',5,1)+'</div>';
}
function vJogos(){
  const r=(id,t)=>{ const v=ler('rec-'+id,0); return v?'Recorde: '+v:t; };
  return '<h2 class="sec-t entra" style="--i:1">Jogos de ação</h2><p class="sec-s entra" style="--i:1">Joga, ganha pontos e bate o teu recorde!</p><div class="bento">'+
    tile('a-gelino','t-azul','gelino','Voa, Gelino!',r('a-gelino','Voa entre os pilares de gelo'),2,1)+
    tile('a-rugido','t-coral','rugido','Corrida do Rugido',r('a-rugido','Salta os obstáculos'),3)+
    tile('a-coelhita','t-rosa','coelhita','Salta, Coelhita!',r('a-coelhita','De nuvem em nuvem'),4)+
    tile('a-tuninho','t-verde','tuninho','Tuninho Mergulhador',r('a-tuninho','Apanha as bolhas'),5,1)+
    tile('a-luzes','t-ouro','francisca','Apanha as Luzes',r('a-luzes','Enche o balde e conta até dez'),6,1)+'</div>'+
    '<h2 class="sec-t entra" style="--i:7">Jogos de pensar</h2><p class="sec-s entra" style="--i:7">Sempre diferentes, sempre a aprender.</p><div class="bento">'+
    tile('memoria','t-coral','balu','Memória','5 maneiras de jogar',8,1)+
    tile('quem','t-lilas','cavaleiro','Quem é?','4 jogos de adivinhar',9)+
    tile('cores','t-azul','coelhita','Cores','Arco-íris e misturas',10)+'</div>';
}

document.getElementById('nav').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b||b.dataset.tab===tab) return;
  tab=b.dataset.tab; sfx('pop'); fecharOv(); render(); window.scrollTo({top:0});
  try{ history.replaceState(null,'','#'+tab); }catch(err){}
});
vista.addEventListener('click',e=>{
  const l=e.target.closest('[data-livro]'); if(l){ sfx('pop'); return abrirLivro(+l.dataset.livro); }
  const br=e.target.closest('[data-breve]');
  if(br){ sfx('errado'); const c=br.querySelector('.no-c'); c.classList.remove('abana'); void c.offsetWidth; c.classList.add('abana');
    if(!br.querySelector('.balao')){ const s=document.createElement('span'); s.className='balao'; s.textContent='Em breve!'; br.appendChild(s); setTimeout(()=>s.remove(),1600); }
    falar('Este livro ainda está a ser escrito. Em breve!'); return; }
  const a=e.target.closest('[data-abrir]'); if(!a) return;
  sfx('pop'); const id=a.dataset.abrir;
  const f=({sentir:abrirSentir,dentes:abrirDentes,partilhar:abrirPartilhar,sabias:abrirSabias,memoria:abrirMemoria,cores:abrirCores,quem:abrirQuem,'a-luzes':()=>arcade(J_LUZES),'a-gelino':()=>arcade(J_GELINO),'a-rugido':()=>arcade(J_RUGIDO),'a-coelhita':()=>arcade(J_COELHITA),'a-tuninho':()=>arcade(J_TUNINHO)})[id];
  if(f) f();
});

/* ---------- Ecrã cheio ---------- */
const ov=document.getElementById('ov'), ovIn=document.getElementById('ov-in');
let aoFechar=null;
function abrirOv(titulo, extra){
  fecharExtras(); ov.classList.remove('cheio','leitor');
  ovIn.innerHTML='<div class="ov-top"><button class="fechar" id="fechar" aria-label="Fechar">'+ic('x','×')+'</button>'+(extra||'<h2 id="ov-t">'+esc(titulo)+'</h2>')+'</div><div id="corpo" class="ov-in"></div>';
  ov.hidden=false; ov.scrollTop=0; document.body.style.overflow='hidden'; icones();
  document.getElementById('fechar').onclick=()=>{ sfx('pop'); fecharOv(); render(); };
}
function corpo(h){ const c=document.getElementById('corpo'); c.innerHTML=h; icones(); return c; }
function fecharExtras(){ calar(); pararMusica(); if(aoFechar){ aoFechar(); aoFechar=null; } }
function fecharOv(){ fecharExtras(); ov.hidden=true; ov.classList.remove('cheio','leitor'); document.body.style.overflow=''; sairEcraCheio(); }
function ecraCheio(){ try{ const el=document.documentElement; if(!document.fullscreenElement&&el.requestFullscreen) el.requestFullscreen({navigationUI:'hide'}).catch(()=>{}); }catch(e){} }
function sairEcraCheio(){ try{ if(document.fullscreenElement&&document.exitFullscreen) document.exitFullscreen().catch(()=>{}); }catch(e){} }
const baralha=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

/* Recompensa: a estrela voa do sítio onde tocaste até ao balde do topo */
function ganhar(id, origem){
  const novo=!feito[id]; feito[id]=1; gravar('ami-feito',feito);
  if(!novo) return;
  sfx('estrela');
  const r=(origem&&origem.getBoundingClientRect())||{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
  const alvo=document.getElementById('contador'); const ra=alvo?alvo.getBoundingClientRect():{left:innerWidth-60,top:20,width:40,height:40};
  const s=document.createElement('span'); s.className='estrela-v'; s.innerHTML=ESTRELA; document.body.appendChild(s);
  const x0=r.left+r.width/2-22, y0=r.top+r.height/2-22, x1=ra.left+ra.width/2-22, y1=ra.top+ra.height/2-22;
  s.style.left='0px'; s.style.top='0px';
  try{
    const an=s.animate([{transform:'translate('+x0+'px,'+y0+'px) scale(.4)',opacity:0},{transform:'translate('+x0+'px,'+(y0-60)+'px) scale(1.5)',opacity:1,offset:.3},{transform:'translate('+x1+'px,'+y1+'px) scale(.6)',opacity:1}],{duration:1000,easing:'cubic-bezier(.5,0,.3,1)'});
    an.onfinish=()=>{ s.remove(); const n=document.getElementById('n-estr'); if(n){ n.textContent=nEstrelas(); const c=document.getElementById('contador'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } };
  }catch(e){ s.remove(); }
}
function confete(origem){
  const c=document.getElementById('confete'); const cores=['#E5484D','#F28C28','#F7BC2F','#2FB383','#3E92E0','#9A78E8','#EE6FA0'];
  const r=origem?origem.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2.5,width:0,height:0};
  const ox=r.left+r.width/2, oy=r.top+r.height/2;
  for(let i=0;i<46;i++){
    const p=document.createElement('i'); p.style.background=cores[i%7]; p.style.left=ox+'px'; p.style.top=oy+'px'; c.appendChild(p);
    const ang=Math.random()*Math.PI*2, v=120+Math.random()*220, dx=Math.cos(ang)*v, dy=Math.sin(ang)*v-160;
    try{ p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) rotate('+(Math.random()*400)+'deg)',opacity:1,offset:.45},{transform:'translate('+(dx*1.2)+'px,'+(dy+520)+'px) rotate('+(Math.random()*900)+'deg)',opacity:0}],{duration:1600+Math.random()*600,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=()=>p.remove(); }catch(e){ p.remove(); }
  }
}
function festa(id, quem, titulo, texto, botao, acao, origem){
  const novo=!feito[id];
  const c=corpo('<div class="festa"><span class="heroi"><img src="'+IMG[quem]+'" alt=""></span><h3>'+esc(titulo)+'</h3><p>'+esc(texto)+'</p>'+(novo?'<span class="ganhou">'+ESTRELA.replace('<svg','<svg width="22" height="22"')+' Ganhaste uma estrela!</span>':'')+(botao?'<button class="btn btn-zona largo" id="festa-b">'+esc(botao)+'</button>':'')+'<button class="btn btn-claro largo" id="festa-s">Voltar</button></div>');
  confete(c.querySelector('.heroi')); sfx('certo');
  setTimeout(()=>ganhar(id,c.querySelector('.ganhou')||c.querySelector('.heroi')),600);
  falar(titulo+' '+texto, quem);
  if(botao) document.getElementById('festa-b').onclick=()=>{ sfx('pop'); acao(); };
  document.getElementById('festa-s').onclick=()=>{ sfx('pop'); fecharOv(); render(); };
}

/* ---------- Leitor de livros ---------- */
let L=null, sozinho=false;
function abrirLivro(i){
  L={b:LIVROS[i],i:0,idx:i};
  abrirOv('', '<div class="progresso" id="prog" aria-hidden="true"></div>'); ov.classList.add('leitor'); ecraCheio();
  pagina(1);
}
function pagina(dir){
  const b=L.b, total=b.pags.length+1;
  document.getElementById('prog').innerHTML=Array.from({length:total},(_,k)=>'<i'+(k<=L.i?' class="on"':'')+'></i>').join('');
  if(L.i>=b.pags.length) return pergunta();
  const p=b.pags[L.i];
  let tx='';
  p.x.forEach((pt,k)=>{
    if(typeof pt==='string') tx+='<p class="narr" data-p="'+k+'">'+palavras(pt)+'</p>';
    else tx+='<div class="fala"><img src="'+IMG[pt[0]]+'" alt=""><p class="bal" data-p="'+k+'"><b>'+NOME[pt[0]]+'</b>'+palavras(pt[1])+'</p></div>';
  });
  corpo('<div class="pagina '+(dir<0?'vem':'vai')+'"><div class="cena">'+cena(p.c,p.q||[],Object.assign({balde:p.b},p.o||{}))+'</div><div class="texto">'+tx+'</div>'+
    '<div class="controlos"><button class="btn btn-claro btn-redondo" id="ant" aria-label="Página anterior" '+(L.i?'':'disabled')+'>'+ic('chevron-left','‹')+'</button>'+
    '<button class="btn btn-ouro" id="ouvir">'+ic('volume-2','♪')+' Ouvir</button>'+
    '<button class="btn btn-zona btn-redondo" id="seg" aria-label="Página seguinte">'+ic('chevron-right','›')+'</button></div>'+
    '<div class="sozinho"><button class="interruptor" id="sozinho" role="switch" aria-checked="'+sozinho+'" aria-labelledby="soz-l"></button><span id="soz-l">Virar as páginas sozinho</span></div></div>');
  if(p.plim) setTimeout(()=>sfx('plim'),500);
  document.getElementById('ant').onclick=()=>{ sfx('virar'); calar(); L.i--; pagina(-1); };
  document.getElementById('seg').onclick=()=>{ sfx('virar'); calar(); L.i++; pagina(1); };
  document.getElementById('ouvir').onclick=()=>lerPagina();
  document.getElementById('sozinho').onclick=e=>{ sozinho=!sozinho; e.currentTarget.setAttribute('aria-checked',sozinho); sfx('pop'); };
  { const idx=L.i; setTimeout(()=>{ if(L&&L.i===idx&&!ov.hidden) lerPagina(); },650); }
}
function lerPagina(){
  const p=L.b.pags[L.i], atual=L.i;
  const partes=p.x.map((pt,k)=>{ const el=document.querySelector('[data-p="'+k+'"]'); return typeof pt==='string'?{t:pt,quem:'narr',el}:{t:pt[1],quem:pt[0],el}; });
  falarFila(partes,()=>{ if(sozinho && L && L.i===atual && !ov.hidden) setTimeout(()=>{ if(L.i===atual){ sfx('virar'); L.i++; pagina(1); } },1800); });
}
function opVisual(o){
  if(o.img) return '<img src="'+IMG[o.img]+'" alt="'+NOME[o.img]+'">';
  if(o.cor) return '<span class="pote" style="background:'+COR[o.cor]+'"></span>';
  if(o.num) return '<span class="luzes-c">'+'<i></i>'.repeat(o.num)+'</span>';
  if(o.cena) return '<span class="op-cena">'+cena(o.cena,[],{})+'</span>';
  if(o.svg) return '<span class="op-svg">'+DESENHOS[o.svg]+'</span>';
  return '';
}
function pergunta(){
  const qs=L.b.perg; let qi=0;
  const mostra=()=>{
    const q=qs[qi];
    corpo('<div class="pagina vai"><div class="cartao"><div class="quem"><img src="'+IMG[q.quem]+'" alt=""><div class="tx"><small>Pergunta '+(qi+1)+' de '+qs.length+'</small><h3>'+esc(q.q)+'</h3></div></div></div>'+
      '<div class="opv'+(q.ops.some(o=>o.cena)?' largas':'')+'">'+q.ops.map((o,i)=>'<button class="opv-b entra" style="--i:'+i+'" data-op="'+i+'" aria-label="'+esc(o.d||(o.img?NOME[o.img]:'Opção '+(i+1)))+'">'+opVisual(o)+(o.num?'<b class="opv-n">'+o.num+'</b>':'')+'</button>').join('')+'</div>'+
      '<p class="aviso" id="aviso" aria-live="polite"></p>'+
      '<div class="controlos"><button class="btn btn-claro btn-redondo" id="ant" aria-label="Voltar ao livro">'+ic('chevron-left','‹')+'</button><button class="btn btn-ouro" id="ouvir">'+ic('volume-2','♪')+' Ouvir outra vez</button><span></span></div></div>');
    const bts=[...document.querySelectorAll('[data-op]')];
    const dizer=()=>falarFila([{t:q.q,quem:q.quem}].concat(q.ops.some(o=>o.d)?q.ops.map((o,i)=>({t:(i?'Ou ':'')+o.d+'?',quem:'narr',alvo:bts[i]})):[]));
    dizer(); document.getElementById('ouvir').onclick=dizer;
    document.getElementById('ant').onclick=()=>{ sfx('virar'); L.i--; pagina(-1); };
    bts.forEach(b=>b.onclick=()=>{
      const o=q.ops[+b.dataset.op];
      if(+b.dataset.op===q.ok){
        b.classList.add('certo','pop'); sfx('certo'); bts.forEach(x=>x.onclick=null);
        if(qi<qs.length-1){ falar('Isso mesmo!','narr'); qi++; setTimeout(mostra,1300); return; }
        const prox=LIVROS[L.idx+1], tem=prox&&prox.pags&&prox.pags.length;
        setTimeout(()=>festa('livro'+L.b.n, L.b.capa, 'Muito bem!', 'Acabaste o livro '+L.b.n+'.', tem?'Ler o livro '+prox.n:null, ()=>abrirLivro(L.idx+1)),900);
      } else { sfx('errado'); b.classList.remove('abana'); void b.offsetWidth; b.classList.add('abana','errado'); falar('Quase! Tenta outra vez.','narr'); }
    });
  };
  mostra();
}

/* ---------- Aprender: emoções ---------- */
const SENT=[
  {n:"Alegre",c:"alegre",q:"balu",t:"Que bom! A alegria é para partilhar. Vai dar um abraço a alguém de quem gostas e conta-lhe porque estás contente."},
  {n:"Triste",c:"triste",q:"gelino",t:"Eu também já estive triste e sozinho. Aprendi que posso pedir ajuda. Quando estás triste, podes dizer: preciso de um abraço.",r:1},
  {n:"Com medo",c:"medo",q:"ketchup",t:"Nós tínhamos medo do escuro! Não faz mal ter medo. Conta a um adulto o que sentes. O medo fica mais pequenino.",r:1},
  {n:"Zangada",c:"zangada",q:"rugido",t:"Às vezes eu também me zango! Antes de fazer alguma coisa, paro e respiro devagar. Depois digo com palavras o que me chateou.",r:1},
  {n:"Calma",c:"calma",q:"banze",t:"Devagar também se chega. Quando estás calma, consegues ouvir os outros e pensar bem."}
];
function abrirSentir(){
  abrirOv('Como te sentes?');
  corpo('<p class="grande-t entra">Como te sentes hoje?</p><div class="sentir">'+SENT.map((s,i)=>'<button class="entra" style="--i:'+(i+1)+'" data-s="'+i+'" aria-label="'+s.n+'"><span class="cara">'+cara(s.c)+'<img class="cara-p" src="'+IMG[s.q]+'" alt=""></span><b>'+s.n+'</b></button>').join('')+'</div>');
  const bs=[...document.querySelectorAll('[data-s]')];
  falarFila([{t:'Como te sentes hoje? Toca na carinha que é igual a ti.',quem:'banze'}].concat(SENT.map((s,i)=>({t:s.n+'?',quem:'narr',alvo:bs[i]}))));
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ sfx('pop'); dicaSentir(+b.dataset.s,b); });
}
function dicaSentir(i,orig){
  const s=SENT[i];
  const c=corpo('<div class="cara-g entra">'+cara(s.c)+'</div><div class="cartao entra"><div class="quem"><img src="'+IMG[s.q]+'" alt=""><div class="tx"><small>'+NOME[s.q]+'</small><h3>Estás '+s.n.toLowerCase()+'. Está tudo bem.</h3></div></div><p class="lido-t">'+esc(s.t)+'</p><button class="btn btn-claro" id="ouvir">'+ic('volume-2','♪')+' Ouvir</button></div>'+
    (s.r?'<button class="btn btn-zona largo entra" style="--i:1" id="resp">'+ic('wind','~')+' Respirar com o Cavaleiro</button>':'')+
    '<button class="btn btn-claro largo entra" style="--i:2" id="volta">Escolher outro</button>');
  ganhar('sentir',c.querySelector('.quem img'));
  falar(s.t,s.q); document.getElementById('ouvir').onclick=()=>falar(s.t,s.q);
  document.getElementById('volta').onclick=()=>{ sfx('pop'); abrirSentir(); };
  if(s.r) document.getElementById('resp').onclick=()=>{ sfx('pop'); respirar(); };
}
function respirar(){
  corpo('<div class="cartao"><div class="quem"><img src="'+IMG.cavaleiro+'" alt=""><div class="tx"><small>Cavaleiro</small><h3>Uma cor de cada vez</h3></div></div><p class="lido-t">Quando a bola crescer, cheira a flor. Quando encolher, sopra a vela.</p></div>'+
    '<div class="respira"><div class="bola" id="bola"></div></div><p class="grande-t" id="rt" aria-live="polite">Pronta?</p><button class="btn btn-ouro largo" id="go">'+ic('play','▶')+' Começar</button>');
  falar('Vamos respirar três vezes. Quando a bola crescer, cheira a flor. Quando encolher, sopra a vela.','cavaleiro');
  let tm=[]; aoFechar=()=>tm.forEach(clearTimeout);
  document.getElementById('go').onclick=e=>{
    const b=e.currentTarget; b.disabled=true; calar(); const bola=document.getElementById('bola'), rt=document.getElementById('rt');
    for(let k=0;k<3;k++){
      tm.push(setTimeout(()=>{ bola.classList.add('cheia'); rt.textContent='Cheira a flor…'; falar('Cheira a flor','cavaleiro'); },k*9000));
      tm.push(setTimeout(()=>{ bola.classList.remove('cheia'); rt.textContent='Sopra a vela…'; falar('Sopra a vela','cavaleiro'); },k*9000+4500));
    }
    tm.push(setTimeout(()=>{ rt.textContent='Muito bem!'; sfx('certo'); falar('Muito bem! Já te sentes mais calma?','cavaleiro'); b.disabled=false; b.innerHTML=ic('rotate-ccw','↺')+' Outra vez'; icones(); },27000));
  };
}

/* ---------- Aprender: dentes ---------- */
const FASES=["Dentes de cima, por fora","Dentes de baixo, por fora","Agora por dentro","Onde se mastiga, e a língua!"];
function abrirDentes(){
  abrirOv('Dentes a brilhar');
  corpo('<div class="cartao entra"><div class="quem"><img src="'+IMG.tuninho+'" alt=""><div class="tx"><small>Tuninho</small><h3>Bip-bop! Escova na mão?</h3></div></div><p class="lido-t">Lavamos os dentes de manhã e à noite, durante dois minutos. Eu conto o tempo e digo-te onde escovar.</p></div>'+
    '<ul class="passos">'+['Pasta pequenina, do tamanho de uma ervilha.','Escova às voltinhas, devagarinho.','No fim, cospe a espuma. Não é para engolir!'].map((t,i)=>'<li class="entra" style="--i:'+(i+1)+'"><span>'+(i+1)+'</span>'+t+'</li>').join('')+'</ul>'+
    '<button class="btn btn-ouro largo entra" style="--i:4" id="go">'+ic('play','▶')+' Começar os 2 minutos</button>');
  falar('Bip-bop! Lavamos os dentes de manhã e à noite, durante dois minutos. Eu conto o tempo e digo-te onde escovar.','tuninho');
  document.getElementById('go').onclick=()=>{ sfx('pop'); escovar(); };
}
function escovar(){
  const T=120; let t=0, fase=0; const R=98, C=2*Math.PI*R;
  corpo('<div class="relogio"><svg viewBox="0 0 230 230"><circle cx="115" cy="115" r="'+R+'" fill="none" stroke="var(--cartao)" stroke-width="20"/><circle id="arco" cx="115" cy="115" r="'+R+'" fill="none" stroke="var(--z)" stroke-width="20" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 115 115)" style="transition:stroke-dashoffset 1s linear"/></svg><span class="tempo" id="tempo">2:00</span></div>'+
    '<p class="grande-t" id="fase" aria-live="polite">'+FASES[0]+'</p><div class="cartao"><div class="quem"><img src="'+IMG.tuninho+'" alt=""><div class="tx"><h3 id="dica-t">Bip! Vamos lá!</h3></div></div></div>'+
    '<button class="btn btn-claro largo" id="parar">'+ic('square','■')+' Parar</button>');
  falar(FASES[0],'tuninho');
  const iv=setInterval(()=>{
    t++; const f=Math.min(3,Math.floor(t/30));
    document.getElementById('arco').setAttribute('stroke-dashoffset',C*(1-t/T));
    const r=T-t; document.getElementById('tempo').textContent=Math.floor(r/60)+':'+String(r%60).padStart(2,'0');
    if(f!==fase && t<T){ fase=f; const fe=document.getElementById('fase'); fe.textContent=FASES[f]; fe.classList.remove('pop'); void fe.offsetWidth; fe.classList.add('pop'); document.getElementById('dica-t').textContent=['Bip! Vamos lá!','Bip-bop, muito bem!','Já vamos a meio!','Quase, quase!'][f]; sfx('plim'); falar(FASES[f],'tuninho'); }
    if(t>=T){ clearInterval(iv); aoFechar=null; festa('dentes','tuninho','Dentes a brilhar!','Agora cospe a espuma e passa por água.',null); }
  },1000);
  aoFechar=()=>clearInterval(iv);
  document.getElementById('parar').onclick=()=>{ clearInterval(iv); aoFechar=null; sfx('pop'); abrirDentes(); };
}

/* ---------- Sabias que: 200 factos em 10 temas ---------- */
const TEMAS = C.factos||[];
function abrirSabias(){
  abrirOv('Sabias que…?');
  const total=TEMAS.reduce((a,t)=>a+t.f.length,0);
  corpo('<div class="cartao entra"><div class="quem"><img src="'+IMG.girafa+'" alt=""><div class="tx"><small>Girafa</small><h3>'+total+' coisas para descobrir!</h3></div></div><button class="btn btn-ouro" id="calhas">'+ic('shuffle','?')+' Ao calhas</button></div>'+
    '<div class="bento">'+TEMAS.map((t,i)=>{ const lidos=(ler('fac-'+t.id,[])||[]).length; return '<button class="tile '+t.cls+' entra pequeno" style="--i:'+(i+1)+'" data-tema="'+i+'"><span class="padrao"></span><span class="fig"><img src="'+IMG[t.q]+'" alt=""></span>'+(feito['sabias-'+t.id]?'<span class="feito">'+ESTRELA.replace('<svg','<svg width="14" height="14"')+'</span>':'')+'<h3>'+t.t+'</h3><p>'+lidos+' de '+t.f.length+'</p></button>'; }).join('')+'</div>');
  falar('Sabias que? Escolhe um tema, ou toca em ao calhas.','girafa');
  document.getElementById('calhas').onclick=()=>{ sfx('pop'); verFactos(null); };
  document.querySelectorAll('[data-tema]').forEach(b=>b.onclick=()=>{ sfx('pop'); verFactos(+b.dataset.tema); });
}
function verFactos(ti){
  let lista=[];
  if(ti==null) TEMAS.forEach((t,i)=>t.f.forEach((f,k)=>lista.push({ti:i,k}))); else TEMAS[ti].f.forEach((f,k)=>lista.push({ti,k}));
  const lidosDe=t=>ler('fac-'+TEMAS[t].id,[])||[];
  lista=baralha(lista).sort((a,b)=>lidosDe(a.ti).includes(a.k)-lidosDe(b.ti).includes(b.k));
  if(ti==null) lista=lista.slice(0,20);
  let i=0;
  abrirOv('','<div class="progresso" id="prog" aria-hidden="true"></div>');
  const mostra=dir=>{
    const it=lista[i], t=TEMAS[it.ti], f=t.f[it.k];
    const l=lidosDe(it.ti); if(!l.includes(it.k)){ l.push(it.k); gravar('fac-'+t.id,l); if(l.length>=10) setTimeout(()=>ganhar('sabias-'+t.id,document.querySelector('.quem img')),400); }
    document.getElementById('prog').innerHTML=lista.map((_,k)=>'<i'+(k<=i?' class="on"':'')+'></i>').join('');
    corpo('<div class="pagina '+(dir<0?'vem':'vai')+'"><div class="cartao"><div class="quem"><img src="'+IMG[t.q]+'" alt=""><div class="tx"><small>'+t.t+'</small><h3>Sabias que…</h3></div></div><p class="lido-t facto" data-p="0">'+palavras(f)+'</p></div>'+
      '<div class="controlos"><button class="btn btn-claro btn-redondo" id="ant" aria-label="Anterior" '+(i?'':'disabled')+'>'+ic('chevron-left','‹')+'</button><button class="btn btn-ouro" id="ouvir">'+ic('volume-2','♪')+' Ouvir</button><button class="btn btn-zona btn-redondo" id="seg" aria-label="Seguinte" '+(i<lista.length-1?'':'disabled')+'>'+ic('chevron-right','›')+'</button></div></div>');
    const diz=()=>falarFila([{t:'Sabias que '+f.charAt(0).toLowerCase()+f.slice(1),quem:t.q}]);
    document.getElementById('ant').onclick=()=>{ sfx('virar'); i--; mostra(-1); };
    document.getElementById('seg').onclick=()=>{ sfx('virar'); i++; mostra(1); };
    document.getElementById('ouvir').onclick=diz; diz();
  };
  mostra(1);
}

/* ---------- Escolher modo ---------- */
function modos(titulo, host, intro, lista, cb){
  abrirOv(titulo);
  corpo('<div class="cartao entra"><div class="quem"><img src="'+IMG[host]+'" alt=""><div class="tx"><small>'+NOME[host]+'</small><h3>'+esc(intro)+'</h3></div></div></div><div class="modos">'+
    lista.map((m,i)=>'<button class="modo entra" style="--i:'+(i+1)+'" data-m="'+i+'"><span class="modo-ic">'+ic(m.ic,m.f||'•')+'</span><span class="tx"><b>'+esc(m.t)+'</b><small>'+esc(m.s)+'</small></span>'+(feito[m.id]?'<span class="modo-ok">'+ESTRELA+'</span>':'')+'</button>').join('')+'</div>');
  const bs=[...document.querySelectorAll('[data-m]')];
  falarFila([{t:intro,quem:host}].concat(lista.map((m,i)=>({t:m.t+'. '+m.s+'.',quem:'narr',alvo:bs[i]}))));
  bs.forEach(b=>b.onclick=()=>{ sfx('pop'); cb(lista[+b.dataset.m]); });
}
const TODOS=(C.personagens||[]).filter(p=>!p.extra).map(p=>p.id);
const NUM=["Uma","Duas","Três","Quatro","Cinco","Seis","Sete","Oito","Nove","Dez"];
const NUMS=["zero","um","dois","três","quatro","cinco","seis","sete","oito","nove","dez"];
function shake(el){ el.classList.remove('abana'); void el.offsetWidth; el.classList.add('abana'); }

/* ---------- Jogo: memória ---------- */
function abrirMemoria(){
  modos('Memória','balu','Como queres jogar?',[
    {id:'mem-f',t:'Fácil',s:'4 pares de amigos',ic:'smile',f:'1',n:4},
    {id:'mem-n',t:'Normal',s:'6 pares de amigos',ic:'star',f:'2',n:6},
    {id:'mem-d',t:'Difícil',s:'8 pares de amigos',ic:'flame',f:'3',n:8},
    {id:'mem-nome',t:'Nome e cara',s:'Junta cada amigo ao seu nome',ic:'type',f:'A',n:6,tipo:'nome'},
    {id:'mem-num',t:'Números',s:'Junta o número às Luzes',ic:'hash',f:'#',n:6,tipo:'num'}],memoria);
}
function memoria(m){
  let deck=[];
  if(m.tipo==='num'){ baralha([1,2,3,4,5,6,7,8,9,10]).slice(0,m.n).forEach(v=>{ deck.push({k:v,f:'num'}); deck.push({k:v,f:'luzes'}); }); }
  else baralha(TODOS).slice(0,m.n).forEach(k=>{ deck.push({k,f:'img'}); deck.push({k,f:m.tipo==='nome'?'nome':'img'}); });
  deck=baralha(deck);
  const cols=m.n===6?3:4; let abertas=[], pares=0, jog=0, ocupado=false;
  const face=c=> c.f==='img'?'<img src="'+IMG[c.k]+'" alt="">' : c.f==='nome'?'<span class="nome-c">'+esc(NOME[c.k])+'</span>' : c.f==='num'?'<span class="num-c">'+c.k+'</span>' : '<span class="luzes-c">'+'<i></i>'.repeat(c.k)+'</span>';
  abrirOv(m.t);
  corpo('<p class="aviso" id="jog">Jogadas: 0</p><div class="memoria" style="grid-template-columns:repeat('+cols+',1fr)">'+deck.map((c,i)=>'<button class="carta entra" style="--i:'+i+'" data-i="'+i+'" aria-label="Carta '+(i+1)+'"><span class="v">'+ic('sparkles','✦')+'</span><span class="f">'+face(c)+'</span></button>').join('')+'</div>');
  falar(m.tipo==='num'?'Junta cada número ao mesmo número de Luzes!':m.tipo==='nome'?'Junta cada amigo ao seu nome!':'Vira duas cartas e encontra os amigos iguais!','balu');
  document.querySelectorAll('.carta').forEach(c=>c.onclick=()=>{
    if(ocupado||c.classList.contains('virada')) return;
    c.classList.add('virada'); sfx('virar'); abertas.push(c);
    const d=deck[c.dataset.i];
    if(d.f==='nome') falar(NOME[d.k],'narr'); else if(d.f==='num'||d.f==='luzes') falar(NUMS[d.k],'narr');
    if(abertas.length===2){
      jog++; document.getElementById('jog').textContent='Jogadas: '+jog;
      const [a,b]=abertas, da=deck[a.dataset.i], db=deck[b.dataset.i];
      if(da.k===db.k){ abertas=[]; pares++; setTimeout(()=>{ a.classList.add('par','pop'); b.classList.add('par','pop'); sfx('certo'); },350);
        if(m.tipo!=='num') setTimeout(()=>falar(DIZ[da.k]||NOME[da.k],da.k),500);
        if(pares===m.n) setTimeout(()=>{ const e=jog<=m.n+2?3:jog<=m.n*2?2:1; festa(m.id,'balu',['','Boa!','Muito bem!','Fantástico!'][e],'Conseguiste em '+jog+' jogadas.','Jogar outra vez',()=>memoria(m)); },1400);
      } else { ocupado=true; setTimeout(()=>{ sfx('errado'); a.classList.remove('virada'); b.classList.remove('virada'); abertas=[]; ocupado=false; },1100); }
    }
  });
}

/* ---------- Jogo: quem é? ---------- */
const FRASES=C.frases||[];
const ADIVINHAS=C.adivinhas||{};
function abrirQuem(){
  modos('Quem é?','cavaleiro','Escolhe um jogo de adivinhar.',[
    {id:'quem-disse',t:'Quem disse?',s:'Ouve a frase e descobre quem a disse',ic:'message-circle',f:'"',tipo:'disse'},
    {id:'quem-adiv',t:'Adivinha',s:'Ouve as pistas e descobre o amigo',ic:'search',f:'?',tipo:'adiv'},
    {id:'quem-ouve',t:'Ouve e encontra',s:'Toca no amigo que ouvires',ic:'ear',f:'♪',tipo:'ouve'},
    {id:'quem-falta',t:'Quem desapareceu?',s:'Olha bem e descobre quem fugiu',ic:'eye',f:'◉',tipo:'falta'}],quemJogo);
}
function quemJogo(m){
  const N=8; let r=0, certas=0, rondas;
  if(m.tipo==='disse') rondas=baralha(FRASES).slice(0,N).map(([k,f])=>({k,f}));
  else if(m.tipo==='adiv') rondas=baralha(Object.keys(ADIVINHAS)).slice(0,N).map(k=>({k,f:baralha(ADIVINHAS[k])[0]}));
  else rondas=baralha(TODOS).slice(0,N).map(k=>({k}));
  abrirOv('','<div class="progresso" id="prog" aria-hidden="true"></div>');
  const prog=()=>document.getElementById('prog').innerHTML=rondas.map((_,i)=>'<i'+(i<r?' class="on"':'')+'></i>').join('');
  const fim=()=>festa(m.id,'cavaleiro',certas>=N-1?'Conheces bem os amigos!':'Muito bem!','Acertaste '+certas+' de '+N+'.','Jogar outra vez',()=>quemJogo(m));
  const prox=()=>{ r++; if(r>=N) setTimeout(fim,900); else setTimeout(ronda,1200); };
  const escolher=(k,nOps,primeira)=>{
    const ops=baralha([k].concat(baralha(TODOS.filter(x=>x!==k)).slice(0,nOps-1)));
    return '<div class="trio" style="grid-template-columns:repeat('+(nOps===4?2:3)+',1fr)">'+ops.map((o,i)=>'<button class="entra" style="--i:'+i+'" data-q="'+o+'"><img src="'+IMG[o]+'" alt=""><span>'+NOME[o]+'</span></button>').join('')+'</div><p class="aviso" id="aviso" aria-live="polite"></p>';
  };
  const ligar=k=>{ let erro=false; document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
    if(b.dataset.q===k){ b.classList.add('certo','pop'); sfx('certo'); if(!erro) certas++; falar('Isso! '+NOME[k]+'!','narr'); document.querySelectorAll('[data-q]').forEach(x=>x.onclick=null); prox(); }
    else { erro=true; sfx('errado'); shake(b); b.classList.add('errado'); document.getElementById('aviso').textContent='Não foi. Tenta outra vez!'; }
  }); };
  const ronda=()=>{
    prog(); const R=rondas[r];
    if(m.tipo==='disse'||m.tipo==='adiv'){
      corpo('<div class="pagina vai"><p class="grande-t">'+(m.tipo==='disse'?'Quem disse?':'Quem sou eu?')+'</p><div class="frase-g">«'+esc(R.f)+'»</div><button class="btn btn-ouro" id="ouvir">'+ic('volume-2','♪')+' Ouvir</button>'+escolher(R.k,3)+'</div>');
      const diz=()=>falar(R.f, m.tipo==='disse'?R.k:'narr'); diz(); document.getElementById('ouvir').onclick=diz; icones(); ligar(R.k);
    } else if(m.tipo==='ouve'){
      corpo('<div class="pagina vai"><p class="grande-t">Toca no amigo que ouvires!</p><button class="btn btn-ouro" id="ouvir">'+ic('volume-2','♪')+' Ouvir outra vez</button>'+escolher(R.k,4)+'</div>');
      const diz=()=>falar('Onde está '+(['maia','tartarugas','coelhita','lila','francisca','maria'].includes(R.k)?'a ':'o ')+NOME[R.k]+'?','narr'); diz(); document.getElementById('ouvir').onclick=diz; icones(); ligar(R.k);
    } else {
      const grupo=baralha(TODOS).slice(0,4); const k=grupo[Math.floor(Math.random()*4)]; R.k=k;
      corpo('<div class="pagina vai"><p class="grande-t" id="ft">Olha bem para estes amigos!</p><div class="trio" style="grid-template-columns:repeat(2,1fr)">'+grupo.map((o,i)=>'<div class="slot entra" style="--i:'+i+'" data-s="'+o+'"><img src="'+IMG[o]+'" alt=""><span>'+NOME[o]+'</span></div>').join('')+'</div><div class="contagem" id="cont">3</div></div>');
      falar('Olha bem para estes amigos!','narr');
      let c=3; const iv=setInterval(()=>{ c--; const el=document.getElementById('cont'); if(!el){ clearInterval(iv); return; } if(c>0){ el.textContent=c; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); sfx('pop'); } else { clearInterval(iv);
        const s=document.querySelector('[data-s="'+k+'"]'); s.classList.add('fugiu'); s.innerHTML='<span class="interroga">?</span>';
        el.remove(); document.getElementById('ft').textContent='Quem desapareceu?'; falar('Quem desapareceu?','narr');
        const extra=baralha(TODOS.filter(x=>!grupo.includes(x))).slice(0,2);
        const div=document.createElement('div'); div.innerHTML='<div class="trio">'+baralha([k].concat(extra)).map((o,i)=>'<button class="entra" style="--i:'+i+'" data-q="'+o+'"><img src="'+IMG[o]+'" alt=""><span>'+NOME[o]+'</span></button>').join('')+'</div><p class="aviso" id="aviso" aria-live="polite"></p>';
        document.querySelector('.pagina').appendChild(div); ligar(k);
      } },1300);
      aoFechar=()=>clearInterval(iv);
    }
  };
  ronda();
}

/* ---------- Jogo: cores ---------- */
const ARCO=[{n:"vermelho",c:"#E5484D"},{n:"laranja",c:"#F28C28"},{n:"amarelo",c:"#F5C518"},{n:"verde",c:"#2FB383"},{n:"azul",c:"#3E92E0"},{n:"anil",c:"#4B4BB5"},{n:"violeta",c:"#9A5BD6"}];
const COR={vermelho:"#E5484D",laranja:"#F28C28",amarelo:"#F5C518",verde:"#2FB383",azul:"#3E92E0",roxo:"#8B5CF6","cor-de-rosa":"#F48FB8",branco:"#FFFFFF",preto:"#2B2B33",cinzento:"#9CA0AE","azul-claro":"#9FD3F5",castanho:"#9A6A45"};
const MISTURAS=[["azul","amarelo","verde"],["vermelho","amarelo","laranja"],["vermelho","azul","roxo"],["vermelho","branco","cor-de-rosa"],["preto","branco","cinzento"],["azul","branco","azul-claro"]].flatMap(([a,b,c])=>[[a,b,c],[b,a,c]]);
const DE_QUE_COR=C.cores||[];
const artigo=n=>/^(cor-de-rosa)$/.test(n)?'':'o ';
function bola(c,extra){ return '<span class="pote" style="background:'+COR[c]+(c==='branco'?';border-color:var(--linha)':'')+'"'+(extra||'')+'></span>'; }
function abrirCores(){
  modos('Cores','coelhita','Vamos brincar com as cores!',[
    {id:'cor-arco',t:'Arco-íris',s:'Põe as cores pela ordem certa',ic:'rainbow',f:'◠',tipo:'arco'},
    {id:'cor-mist',t:'Misturas',s:'Que cor nasce quando misturamos?',ic:'palette',f:'+',tipo:'mist'},
    {id:'cor-qual',t:'De que cor é?',s:'Adivinha a cor das coisas',ic:'paintbrush',f:'?',tipo:'qual'}],coresJogo);
}
function arcoSVG(k){ let s=''; ARCO.forEach((c,i)=>{ const r=152-i*14; s+='<path d="M'+(160-r)+' 162 A'+r+' '+r+' 0 0 1 '+(160+r)+' 162" fill="none" stroke="'+(i<k?c.c:'var(--cartao)')+'" stroke-width="12" stroke-linecap="round" style="transition:stroke .5s"/>'; }); return '<svg viewBox="0 0 320 172" aria-label="Arco-íris com '+k+' cores">'+s+'</svg>'; }
function coresJogo(m){
  abrirOv(m.t);
  if(m.tipo==='arco'){
    let k=0;
    const des=()=>{
      corpo('<div class="arco">'+arcoSVG(k)+'</div><div class="cartao"><div class="quem"><img src="'+IMG.cavaleiro+'" alt=""><div class="tx"><small>Cavaleiro</small><h3 id="pede">'+(k<7?'Qual é a cor que vem a seguir?':'Arco-íris completo!')+'</h3></div></div></div>'+
        '<div class="paleta paleta7">'+baralha(ARCO).map((c,i)=>'<button class="entra'+(ARCO.indexOf(c)<k?' usada':'')+'" style="--i:'+i+';background:'+c.c+';box-shadow:0 6px 0 color-mix(in srgb,'+c.c+' 70%,#000)" data-c="'+c.n+'"><span>'+c.n+'</span></button>').join('')+'</div><p class="aviso" id="aviso" aria-live="polite"></p>');
      document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{
        if(b.classList.contains('usada')) return;
        if(b.dataset.c===ARCO[k].n){ k++; sfx('certo'); b.classList.add('usada','pop'); document.querySelector('.arco').innerHTML=arcoSVG(k); falar(ARCO[k-1].n,'coelhita');
          if(k===7) setTimeout(()=>festa(m.id,'coelhita','Arco-íris completo!','Vermelho, laranja, amarelo, verde, azul, anil e violeta.','Jogar outra vez',()=>coresJogo(m)),900);
        } else { sfx('errado'); shake(b); document.getElementById('aviso').textContent='Ainda não. Primeiro vem o '+ARCO[k].n+'.'; falar('Ainda não. Primeiro vem o '+ARCO[k].n+'.','cavaleiro'); }
      });
    };
    des(); falar('No arco-íris, as cores estão sempre pela mesma ordem. Começa pelo vermelho!','cavaleiro');
  } else if(m.tipo==='mist'){
    const rondas=baralha(MISTURAS).slice(0,10); let r=0, certas=0;
    const ronda=()=>{
      const [a,b,res]=rondas[r]; let erro=false;
      const ops=baralha([res].concat(baralha(Object.keys(COR).filter(x=>x!==res&&x!==a&&x!==b)).slice(0,2)));
      corpo('<div class="pagina vai"><p class="grande-t">'+(r+1)+' de '+rondas.length+'</p><div class="mistura">'+bola(a)+'<span class="mais">+</span>'+bola(b)+'<span class="mais">=</span><span class="pote vazio" id="res">?</span></div>'+
        '<p class="lido-t" style="text-align:center">'+artigo(a)+a+' com '+artigo(b)+b+' dá que cor?</p><div class="opcoes-c">'+ops.map(o=>'<button data-o="'+o+'">'+bola(o)+'<span>'+o+'</span></button>').join('')+'</div><p class="aviso" id="aviso"></p></div>');
      falar('Se misturarmos '+a+' com '+b+', que cor dá?','coelhita');
      document.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{
        if(bt.dataset.o===res){ if(!erro) certas++; sfx('certo'); const el=document.getElementById('res'); el.classList.remove('vazio'); el.textContent=''; el.style.background=COR[res]; el.classList.add('pop'); falar(a+' e '+b+' dá '+res+'!','coelhita'); r++;
          if(r>=rondas.length) setTimeout(()=>festa(m.id,'coelhita','És uma pintora!','Acertaste '+certas+' de '+rondas.length+' misturas.','Jogar outra vez',()=>coresJogo(m)),1400); else setTimeout(ronda,1700);
        } else { erro=true; sfx('errado'); shake(bt); document.getElementById('aviso').textContent='Hmm, não. Tenta outra!'; }
      });
    };
    ronda();
  } else {
    const rondas=baralha(DE_QUE_COR).slice(0,10); let r=0, certas=0;
    const ronda=()=>{
      const [q,coisa,res]=rondas[r]; let erro=false;
      const ops=baralha([res].concat(baralha(Object.keys(COR).filter(x=>x!==res&&x!=='azul-claro')).slice(0,3)));
      corpo('<div class="pagina vai"><div class="cartao"><div class="quem"><img src="'+IMG[q]+'" alt=""><div class="tx"><small>'+(r+1)+' de 10</small><h3>De que cor é '+esc(coisa)+'?</h3></div></div></div><div class="opcoes-c">'+ops.map(o=>'<button data-o="'+o+'">'+bola(o)+'<span>'+o+'</span></button>').join('')+'</div><p class="aviso" id="aviso"></p></div>');
      falar('De que cor é '+coisa+'?','coelhita');
      document.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{
        if(bt.dataset.o===res){ if(!erro) certas++; sfx('certo'); bt.classList.add('certo','pop'); falar(res+'!','coelhita'); r++;
          if(r>=rondas.length) setTimeout(()=>festa(m.id,'coelhita','Que olho para as cores!','Acertaste '+certas+' de 10.','Jogar outra vez',()=>coresJogo(m)),1100); else setTimeout(ronda,1300);
        } else { erro=true; sfx('errado'); shake(bt); bt.classList.add('errado'); document.getElementById('aviso').textContent='Não é '+bt.dataset.o+'. Tenta outra vez!'; }
      });
    };
    ronda();
  }
}

/* ---------- Aprender: partilhar ---------- */
const NIVEIS_P=[{n:4,a:2,it:'morango'},{n:6,a:2,it:'bolacha'},{n:6,a:3,it:'uva'},{n:8,a:4,it:'morango'},{n:9,a:3,it:'bolacha'},{n:7,a:2,it:'morango'},{n:10,a:5,it:'uva'},{n:12,a:3,it:'bolacha'},{n:10,a:3,it:'morango'},{n:12,a:4,it:'uva'}];
const ITEM_NOME={morango:['morango','morangos'],bolacha:['bolacha','bolachas'],uva:['uva','uvas']};
const ITEM_SVG={
  morango:'<svg viewBox="0 0 40 40"><path d="M20 36C10 30 5 21 7 15c2-5 9-6 13-3 4-3 11-2 13 3 2 6-3 15-13 21z" fill="#E5484D"/><path d="M13 11l7 4 7-4-3-4-4 3-4-3z" fill="#2FB383"/><g fill="#FFE07A"><circle cx="14" cy="20" r="1.3"/><circle cx="21" cy="24" r="1.3"/><circle cx="26" cy="18" r="1.3"/><circle cx="17" cy="28" r="1.3"/></g></svg>',
  bolacha:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#D9A15B"/><circle cx="20" cy="20" r="16" fill="none" stroke="#B57C3A" stroke-width="2"/><g fill="#6B3E1E"><circle cx="14" cy="15" r="2.2"/><circle cx="24" cy="13" r="2"/><circle cx="26" cy="23" r="2.3"/><circle cx="16" cy="25" r="2"/></g></svg>',
  uva:'<svg viewBox="0 0 40 40"><g fill="#8B5CF6"><circle cx="15" cy="14" r="5.5"/><circle cx="25" cy="14" r="5.5"/><circle cx="20" cy="22" r="5.5"/><circle cx="12" cy="23" r="5"/><circle cx="28" cy="23" r="5"/><circle cx="20" cy="31" r="5"/></g><path d="M20 9V3" stroke="#2FB383" stroke-width="3" stroke-linecap="round"/></svg>'};
const SITUACOES=C.situacoes||[];
function abrirPartilhar(){
  modos('Partilhar','joao','Partilhar é dar a cada um o mesmo. Vamos treinar?',[
    {id:'part-justa',t:'Partilha justa',s:'Divide os lanches pelos amigos',ic:'cookie',f:'◍',tipo:'justa'},
    {id:'part-ese',t:'E se…?',s:'O que farias tu?',ic:'heart-handshake',f:'♥',tipo:'ese'}],m=> m.tipo==='justa'?partilhaJusta(Math.min(ler('part-niv',0),NIVEIS_P.length-1)):eSe());
}
function partilhaJusta(nv){
  const L=NIVEIS_P[nv], am=baralha(TODOS.filter(k=>!['joao','dragao','tartarugas','ketchup'].includes(k))).slice(0,L.a);
  const resto=L.n%L.a, cada=Math.floor(L.n/L.a), [um,muitos]=ITEM_NOME[L.it];
  let monte=L.n, pratos=am.map(()=>0);
  abrirOv('Nível '+(nv+1)+' de '+NIVEIS_P.length);
  const des=()=>{
    corpo('<div class="cartao"><div class="quem"><img src="'+IMG.joao+'" alt=""><div class="tx"><small>João</small><h3>Tenho '+L.n+' '+muitos+' para '+L.a+' amigos. Dá a cada um o mesmo!</h3></div></div>'+
      '<div class="prato grande" id="monte" aria-label="'+monte+' '+muitos+' no prato">'+Array.from({length:monte},()=>'<span class="it">'+ITEM_SVG[L.it]+'</span>').join('')+(monte?'':'<small>Prato vazio</small>')+'</div></div>'+
      '<p class="aviso" id="aviso" aria-live="polite">Toca num amigo para lhe dares um '+um+'.</p>'+
      '<div class="pratos" style="grid-template-columns:repeat('+Math.min(L.a,3)+',1fr)">'+am.map((k,i)=>'<button class="amigo-p" data-a="'+i+'"><img src="'+IMG[k]+'" alt=""><span>'+NOME[k]+'</span><span class="prato">'+Array.from({length:pratos[i]},()=>'<span class="it peq" data-tira="'+i+'">'+ITEM_SVG[L.it]+'</span>').join('')+'</span><b class="conta-p">'+pratos[i]+'</b></button>').join('')+'</div>'+
      '<button class="btn btn-zona largo" id="pronto">'+ic('check','✓')+' Já está!</button>');
    document.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{
      const t=e.target.closest('[data-tira]');
      if(t){ pratos[+t.dataset.tira]--; monte++; sfx('virar'); des(); return; }
      if(!monte){ sfx('errado'); document.getElementById('aviso').textContent='O prato do João já está vazio!'; return; }
      const i=+b.dataset.a; pratos[i]++; monte--; sfx('pop'); falar(NUMS[pratos[i]] ? (pratos[i]===1&&L.it==='bolacha'?'uma':pratos[i]===2&&L.it==='bolacha'?'duas':NUMS[pratos[i]]) : String(pratos[i]),'narr'); des();
      const nb=document.querySelector('[data-a="'+i+'"]'); nb.classList.add('pop');
      if(monte<L.a) setTimeout(()=>{ const p=document.getElementById('pronto'); if(p) p.click(); },900);
    });
    document.getElementById('pronto').onclick=()=>{
      const max=Math.max(...pratos), min=Math.min(...pratos);
      if(max!==min){ const iM=pratos.indexOf(max), im=pratos.indexOf(min); sfx('errado'); const t='Hmm... '+NOME[am[iM]]+' tem '+max+' e '+NOME[am[im]]+' tem '+min+'. Assim não é justo!'; document.getElementById('aviso').textContent=t; falar(t,'joao'); shake(document.querySelector('.pratos')); return; }
      if(monte>=L.a){ sfx('errado'); const t='Ainda há '+muitos+' no prato. Dá mais um a cada amigo!'; document.getElementById('aviso').textContent=t; falar(t,'joao'); return; }
      if(monte>0){ return sobra(); }
      ok();
    };
  };
  const ok=()=>{ const prox=nv+1<NIVEIS_P.length?nv+1:nv; gravar('part-niv',Math.max(ler('part-niv',0),prox));
    festa('part-'+(nv+1),'joao','Partilha justa!','Cada amigo ficou com '+cada+' '+(cada===1?um:muitos)+'. Ninguém ficou com mais!', nv+1<NIVEIS_P.length?'Próximo nível':'Jogar outra vez', ()=>partilhaJusta(prox)); };
  const sobra=()=>{
    corpo('<div class="cartao"><div class="quem"><img src="'+IMG.joao+'" alt=""><div class="tx"><small>João</small><h3>Cada um tem '+cada+'. Mas sobrou '+(resto===1?um==='bolacha'||um==='uva'?'uma':'um':resto)+'! O que fazemos?</h3></div></div><div class="prato grande">'+Array.from({length:resto},()=>'<span class="it">'+ITEM_SVG[L.it]+'</span>').join('')+'</div></div>'+
      '<div class="escolhas tres">'+baralha([['Partimos em bocadinhos iguais para todos','scissors',1,'Isso! Assim todos ficam com o mesmo.'],['Damos só a um amigo','user',0,'Assim esse amigo fica com mais do que os outros. Não é justo.'],['Deitamos fora','trash-2',0,'Não se deita comida fora! Há uma ideia melhor.']]).map((o,i)=>'<div class="esc"><button class="esc-b" data-s="'+i+'" data-ok="'+o[2]+'" data-r="'+esc(o[3])+'" aria-label="'+esc(o[0])+'"><span class="esc-ic">'+ic(o[1],'•')+'</span><span class="esc-t">'+esc(o[0])+'</span></button></div>').join('')+'</div><p class="aviso" id="aviso"></p>');
    const cs=[...document.querySelectorAll('.esc')];
    falarFila([{t:'Cada amigo tem '+cada+'. Mas sobrou! O que fazemos?',quem:'joao'}].concat(cs.map((c,i)=>({t:(i?'Ou: ':'')+c.querySelector('.esc-t').textContent,quem:'narr',alvo:c}))));
    document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ const r=b.dataset.r; document.getElementById('aviso').textContent=r; falar(r,'joao');
      if(b.dataset.ok==='1'){ b.parentElement.classList.add('certo'); b.classList.add('pop'); sfx('certo'); setTimeout(ok,2200); } else { sfx('errado'); shake(b.parentElement); b.parentElement.classList.add('errado'); } });
  };
  des(); falar('Tenho '+L.n+' '+muitos+' para '+L.a+' amigos. Dá a cada um o mesmo! Toca num amigo para lhe dares um.','joao');
}
function eSe(){
  const lista=baralha(SITUACOES).slice(0,5); let r=0;
  abrirOv('','<div class="progresso" id="prog" aria-hidden="true"></div>');
  const ronda=()=>{
    const S=lista[r], ops=baralha(S.ops);
    document.getElementById('prog').innerHTML=lista.map((_,i)=>'<i'+(i<r?' class="on"':'')+'></i>').join('');
    corpo('<div class="pagina vai"><div class="cartao"><div class="quem"><img src="'+IMG[S.q]+'" alt=""><div class="tx"><small>E se…?</small><h3>'+esc(S.t)+'</h3></div></div></div>'+
      '<div class="escolhas">'+ops.map((o,i)=>'<div class="esc entra" style="--i:'+i+'"><button class="esc-b" data-o="'+i+'" aria-label="'+esc(o[0])+'"><span class="esc-ic">'+ic(o[1],'•')+'</span><span class="esc-t">'+esc(o[0])+'</span></button><button class="esc-som" data-som="'+i+'" aria-label="Ouvir esta resposta">'+ic('volume-2','♪')+'</button></div>').join('')+'</div>'+
      '<button class="btn btn-claro largo" id="ouvir">'+ic('volume-2','♪')+' Ouvir outra vez</button><div id="resp"></div></div>');
    const cards=[...document.querySelectorAll('.esc')];
    const diz=()=>falarFila([{t:S.t,quem:'narr'}].concat(ops.map((o,i)=>({t:(i?'Ou: ':'')+o[0],quem:'narr',alvo:cards[i]}))));
    diz(); document.getElementById('ouvir').onclick=diz;
    document.querySelectorAll('[data-som]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.som; falarFila([{t:ops[i][0],quem:'narr',alvo:cards[i]}]); });
    document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{
      const o=ops[+b.dataset.o];
      document.getElementById('resp').innerHTML='<div class="cartao entra"><div class="quem"><img src="'+IMG[S.q]+'" alt=""><div class="tx"><h3>'+esc(o[3])+'</h3></div></div>'+(o[2]?'<button class="btn btn-zona largo" id="seg">'+ic('arrow-right','›')+' Continuar</button>':'')+'</div>';
      icones(); falar(o[3],S.q);
      if(o[2]){ sfx('certo'); b.parentElement.classList.add('certo'); b.classList.add('pop'); document.querySelectorAll('[data-o]').forEach(x=>x.onclick=null);
        document.getElementById('seg').onclick=()=>{ sfx('pop'); r++; if(r>=lista.length) festa('part-ese','joao','És uma ótima amiga!','Sabes partilhar e ajudar os outros.','Mais situações',eSe); else ronda(); };
      } else { sfx('errado'); shake(b.parentElement); b.parentElement.classList.add('errado'); }
    });
  };
  ronda();
}

/* ---------- Motor dos jogos de ação ---------- */
const SPR={}; function spr(k){ if(!SPR[k]){ const i=new Image(); i.src=IMG[k]; SPR[k]=i; } return SPR[k]; }
const BALDE_IMG=new Image(); BALDE_IMG.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(BALDE.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"'));
const P_EST=new Path2D('M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.3l6.6-.8z');
const CORACAO='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.3 4.5 7 4.5c2.1 0 3.6 1.1 5 2.8 1.4-1.7 2.9-2.8 5-2.8 3.7 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>';
function retrato(cx,k,x,y,r,rot,borda,alpha){ cx.save(); cx.globalAlpha=alpha==null?1:alpha; cx.translate(x,y); if(rot) cx.rotate(rot); cx.beginPath(); cx.arc(0,0,r+4,0,7); cx.fillStyle=borda||'#fff'; cx.fill(); cx.beginPath(); cx.arc(0,0,r,0,7); cx.clip(); const im=spr(k); if(im.complete&&im.naturalWidth) cx.drawImage(im,-r,-r,r*2,r*2); else { cx.fillStyle='#ddd'; cx.fill(); } cx.restore(); }
function estrela(cx,x,y,r,cor){ cx.save(); cx.translate(x-r,y-r); cx.scale(r/12,r/12); cx.fillStyle=cor||'#F7BC2F'; cx.fill(P_EST); cx.restore(); }
function rr(cx,x,y,w,h,r){ cx.beginPath(); if(cx.roundRect) cx.roundRect(x,y,w,h,r); else cx.rect(x,y,w,h); }
function arcade(def){
  abrirOv(def.titulo); ov.classList.add('cheio'); ecraCheio();
  corpo('<div class="arc" id="arc"><canvas id="cv"></canvas><div class="arc-hud"><span class="arc-pts">'+ESTRELA.replace('<svg','<svg width="22" height="22"')+'<b id="pts">0</b></span><span class="arc-vidas" id="vidas"></span></div><div class="arc-ov" id="arc-ov"></div></div>');
  const arc=document.getElementById('arc'), cv=document.getElementById('cv'), cx=cv.getContext('2d'), ovl=document.getElementById('arc-ov'), ptsEl=document.getElementById('pts');
  const G={estado:'pronto',px:0,py:0,dedo:false,teclas:{}};
  const medir=()=>{ const W=arc.clientWidth||innerWidth, H=arc.clientHeight||innerHeight; const dpr=Math.min(2,devicePixelRatio||1);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); cv.style.width=W+'px'; cv.style.height=H+'px'; cx.setTransform(dpr,0,0,dpr,0,0);
    const mudou=G.W&&(Math.abs(G.W-W)>2||Math.abs(G.H-H)>2); G.W=W; G.H=H; G.s=Math.min(H/600,W/360)*1.0; return mudou; };
  medir(); G.px=G.W/2; G.py=G.H/2;
  const recK='rec-'+def.id;
  G.ganha=(n,x,y,txt)=>{ G.pts+=n; G.fx.push({x,y,t:0,txt:txt||('+'+n)}); sfx('plim'); };
  G.perde=()=>{ if(G.inv>0||G.estado!=='jogo') return false; G.vidas--; G.inv=1.5; G.tremor=.35; sfx('errado'); try{ navigator.vibrate&&navigator.vibrate(70); }catch(e){} vidas(); if(G.vidas<=0) setTimeout(fim,500); return true; };
  G.anuncio=(t)=>{ G.ban={t,v:1.6}; };
  G.vidaExtra=()=>{ if(G.vidas<3){ G.vidas++; vidas(); } };
  const vidas=()=>{ document.getElementById('vidas').innerHTML=Array.from({length:3},(_,i)=>'<i class="'+(i<G.vidas?'on':'')+'">'+CORACAO+'</i>').join(''); };
  const reset=()=>{ Object.assign(G,{t:0,pts:0,vidas:3,inv:0,tremor:0,fx:[],ban:null}); def.init(G); vidas(); };
  reset();
  const onResize=()=>{ if(medir()&&G.estado!=='jogo') reset(); };
  window.addEventListener('resize',onResize);
  const ecra=(html)=>{ ovl.innerHTML=html; ovl.hidden=false; icones(); };
  const inicio=()=>{ G.estado='pronto';
    ecra('<div class="arc-c entra"><span class="heroi-s"><img src="'+IMG[def.host]+'" alt=""></span><h3>'+esc(def.titulo)+'</h3><p>'+esc(def.instr)+'</p>'+(ler(recK,0)?'<p class="rec">'+ESTRELA.replace('<svg','<svg width="18" height="18"')+' Recorde: '+ler(recK,0)+'</p>':'')+'<button class="btn btn-ouro" id="arc-go">'+ic('play','▶')+' Jogar</button></div>');
    falar(def.instr,def.host);
    document.getElementById('arc-go').onclick=e=>{ e.stopPropagation(); sfx('pop'); calar(); reset(); G.estado='jogo'; ovl.hidden=true; };
  };
  const fim=()=>{
    if(G.estado!=='jogo') return; G.estado='fim';
    const rec=ler(recK,0), novo=G.pts>rec; if(novo) gravar(recK,G.pts);
    ecra('<div class="arc-c entra"><span class="heroi-s"><img src="'+IMG[def.host]+'" alt=""></span><h3>'+(novo?'Novo recorde!':'Muito bem!')+'</h3><p class="grande-pts">'+G.pts+'</p><p>'+(novo?'Bateste o recorde!':'Recorde: '+rec)+'</p><button class="btn btn-ouro" id="arc-go">'+ic('rotate-ccw','↺')+' Jogar outra vez</button><button class="btn btn-claro" id="arc-sai">Voltar</button></div>');
    sfx(novo?'estrela':'certo'); if(novo) confete(ovl.querySelector('.heroi-s'));
    falar((novo?'Novo recorde! ':'Muito bem! ')+'Fizeste '+G.pts+' pontos!',def.host);
    if(G.pts>=def.meta) setTimeout(()=>ganhar(def.id,ovl.querySelector('.grande-pts')),500);
    document.getElementById('arc-go').onclick=()=>{ sfx('pop'); calar(); reset(); G.estado='jogo'; ovl.hidden=true; };
    document.getElementById('arc-sai').onclick=()=>{ sfx('pop'); fecharOv(); render(); };
  };
  const pos=e=>{ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; };
  cv.addEventListener('pointerdown',e=>{ e.preventDefault(); const p=pos(e); G.px=p.x; G.py=p.y; G.dedo=true; try{cv.setPointerCapture(e.pointerId);}catch(er){} if(G.estado==='jogo'&&def.tap) def.tap(G,p.x,p.y); });
  cv.addEventListener('pointermove',e=>{ if(G.dedo||e.pointerType==='mouse'){ const p=pos(e); G.px=p.x; G.py=p.y; } });
  const solta=()=>{ G.dedo=false; if(def.solta) def.solta(G); };
  cv.addEventListener('pointerup',solta); cv.addEventListener('pointercancel',solta);
  const kd=e=>{ if(G.estado!=='jogo') return; G.teclas[e.key]=e.type==='keydown'; if(e.type==='keydown'&&(e.key===' '||e.key==='ArrowUp')){ e.preventDefault(); def.tap&&def.tap(G,G.px,G.py); } };
  window.addEventListener('keydown',kd); window.addEventListener('keyup',kd);
  let raf, last=performance.now();
  const loop=now=>{ raf=requestAnimationFrame(loop); const dt=Math.min(.034,(now-last)/1000); last=now;
    if(G.estado==='jogo'){ G.t+=dt; def.update(G,dt); if(G.inv>0) G.inv-=dt; if(G.tremor>0) G.tremor-=dt; }
    else if(def.ocioso){ G.t+=dt; def.ocioso(G,dt); }
    cx.save(); if(G.tremor>0) cx.translate((Math.random()-.5)*14*G.tremor,(Math.random()-.5)*6*G.tremor);
    def.draw(G,cx);
    G.fx.forEach(f=>{ f.t+=dt; cx.globalAlpha=Math.max(0,1-f.t); cx.fillStyle='#fff'; cx.strokeStyle='rgba(30,42,86,.6)'; cx.lineWidth=4; cx.font='800 '+Math.round(26*G.s)+'px '+FONTE_D; cx.textAlign='center'; cx.strokeText(f.txt,f.x,f.y-f.t*50); cx.fillText(f.txt,f.x,f.y-f.t*50); cx.globalAlpha=1; });
    G.fx=G.fx.filter(f=>f.t<1);
    if(G.ban){ G.ban.v-=dt; const a=Math.min(1,G.ban.v*2); cx.globalAlpha=a; cx.font='800 '+Math.round(50*G.s)+'px '+FONTE_D; cx.textAlign='center'; cx.lineWidth=8; cx.strokeStyle='rgba(30,42,86,.7)'; cx.fillStyle='#FFD86B'; const y=G.H*.42-(1.6-G.ban.v)*20; cx.strokeText(G.ban.t,G.W/2,y); cx.fillText(G.ban.t,G.W/2,y); cx.globalAlpha=1; if(G.ban.v<=0) G.ban=null; }
    cx.restore(); ptsEl.textContent=G.pts;
  };
  raf=requestAnimationFrame(loop);
  aoFechar=()=>{ cancelAnimationFrame(raf); window.removeEventListener('keydown',kd); window.removeEventListener('keyup',kd); window.removeEventListener('resize',onResize); };
  inicio();
}
const piscar=G=>G.inv>0&&Math.floor(G.inv*10)%2===0;
const FONTE_D=((getComputedStyle(document.documentElement).getPropertyValue('--f-d')||'').trim())||'"Baloo 2","Trebuchet MS",sans-serif';
function numeroDito(n){ return n<=10?NUM[n-1]:String(n); }

/* Apanha as Luzes: o balde segue o dedo e a contagem nunca recomeça */
const J_LUZES={id:'a-luzes',titulo:'Apanha as Luzes',host:'francisca',meta:15,instr:'Arrasta o balde e apanha as Luzes douradas. Foge das gotas cinzentas! Vamos contar até onde conseguires.',
  init(G){ G.bx=G.W/2; G.itens=[]; G.prox=.4; G.niv=1; G.total=0; G.vel=150*G.s; G.estrelas=Array.from({length:60},()=>({x:Math.random()*G.W,y:Math.random()*G.H*.8,f:Math.random()*6})); },
  update(G,dt){ const s=G.s;
    if(G.teclas.ArrowLeft) G.px=Math.max(0,G.px-420*s*dt); if(G.teclas.ArrowRight) G.px=Math.min(G.W,G.px+420*s*dt);
    G.bx+=(G.px-G.bx)*Math.min(1,dt*12);
    G.prox-=dt; if(G.prox<=0){ G.prox=Math.max(.35,1.05-G.niv*.08)*(0.7+Math.random()*.6)*(360/Math.max(360,G.W)); const r=Math.random();
      G.itens.push({x:30*s+Math.random()*(G.W-60*s),y:-30,t:r<.18+G.niv*.03?'gota':r>.97?'arco':'luz',v:G.vel*(.8+Math.random()*.5),f:Math.random()*6}); }
    const by=G.H-70*s;
    G.itens.forEach(it=>{ it.y+=it.v*dt; it.f+=dt*3; it.x+=Math.sin(it.f)*20*s*dt;
      if(!it.fora && it.y>by-34*s && it.y<by+12*s && Math.abs(it.x-G.bx)<62*s){ it.fora=1;
        if(it.t==='luz'){ G.total++; G.ganha(1,it.x,by-40*s); falar(numeroDito(G.total)+'!','francisca');
          if(G.total%10===0){ G.niv++; G.vel+=30*s; G.anuncio('Nível '+G.niv+'!'); sfx('estrela'); } }
        else if(it.t==='gota'){ G.perde(); }
        else { G.vidaExtra(); G.ganha(3,it.x,by-40*s,'+3'); } } });
    G.itens=G.itens.filter(it=>!it.fora&&it.y<G.H+40);
  },
  draw(G,cx){ const s=G.s, g=cx.createLinearGradient(0,0,0,G.H); g.addColorStop(0,'#141E52'); g.addColorStop(1,'#4A5DB0'); cx.fillStyle=g; cx.fillRect(0,0,G.W,G.H);
    G.estrelas.forEach(e=>{ e.f+=.02; cx.globalAlpha=.4+Math.sin(e.f)*.3; cx.fillStyle='#fff'; cx.fillRect(e.x,e.y,2,2); }); cx.globalAlpha=1;
    cx.fillStyle='#FFF3C4'; cx.beginPath(); cx.arc(G.W-56*s,90*s,26*s,0,7); cx.fill();
    G.itens.forEach(it=>{
      if(it.t==='luz'){ const r=24*s, gr=cx.createRadialGradient(it.x,it.y,0,it.x,it.y,r*1.6); gr.addColorStop(0,'#FFF7D6'); gr.addColorStop(.4,'#FFD86B'); gr.addColorStop(1,'rgba(255,216,107,0)'); cx.fillStyle=gr; cx.beginPath(); cx.arc(it.x,it.y,r*1.6,0,7); cx.fill(); }
      else if(it.t==='gota'){ cx.fillStyle='#8E96AE'; cx.beginPath(); cx.moveTo(it.x,it.y-22*s); cx.quadraticCurveTo(it.x+15*s,it.y,it.x,it.y+13*s); cx.quadraticCurveTo(it.x-15*s,it.y,it.x,it.y-22*s); cx.fill(); cx.fillStyle='#5E6680'; cx.beginPath(); cx.arc(it.x-4*s,it.y,2*s,0,7); cx.arc(it.x+4*s,it.y,2*s,0,7); cx.fill(); }
      else { ['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#9A5BD6'].forEach((c,i)=>{ cx.strokeStyle=c; cx.lineWidth=3.5*s; cx.beginPath(); cx.arc(it.x,it.y+8*s,(22-i*3)*s,Math.PI,0); cx.stroke(); }); }
    });
    const by=G.H-70*s, bw=130*s; if(!piscar(G)&&BALDE_IMG.complete) cx.drawImage(BALDE_IMG,G.bx-bw/2,by-bw*.42,bw,bw*.83);
    cx.textAlign='left'; cx.font='800 '+Math.round(20*s)+'px '+FONTE_D; cx.fillStyle='#FFE6A0'; cx.fillText('Nível '+G.niv,16*s,G.H-18*s);
    cx.textAlign='right'; cx.font='800 '+Math.round(40*s)+'px '+FONTE_D; cx.fillText(G.total,G.W-16*s,G.H-14*s);
  }};

/* Voa, Gelino! */
const J_GELINO={id:'a-gelino',titulo:'Voa, Gelino!',host:'gelino',meta:10,instr:'Toca no ecrã para o Gelino voar. Passa pelos buracos entre os pilares de gelo e apanha os flocos!',
  init(G){ G.y=G.H*.45; G.vy=0; G.canos=[]; G.flocos=[]; G.prox=1.2; G.rot=0; G.neve=Array.from({length:60},()=>({x:Math.random()*G.W,y:Math.random()*G.H,r:1+Math.random()*2.5,v:20+Math.random()*30})); },
  tap(G){ G.vy=-330*G.s; sfx('virar'); },
  update(G,dt){ const s=G.s, px=Math.min(G.W*.28,160*s), r=26*s; const vel=Math.min(240,120+G.t*2.5)*s;
    G.vy+=900*s*dt; G.y+=G.vy*dt; G.rot=Math.max(-.45,Math.min(.7,G.vy/(650*s)));
    if(G.y<r){ G.y=r; G.vy=0; }
    if(G.y>G.H-r-28*s){ G.y=G.H-r-28*s; G.perde(); G.vy=-380*s; }
    G.prox-=dt; if(G.prox<=0){ G.prox=Math.max(1.4,2.2-G.t*.012)*(Math.min(G.W,700)/400); const gap=Math.max(G.H*.3,G.H*.42-G.t*.8*s); const cy=G.H*.25+Math.random()*G.H*.5;
      G.canos.push({x:G.W+30,w:62*s,top:cy-gap/2,bot:cy+gap/2}); if(Math.random()<.75) G.flocos.push({x:G.W+30+31*s,y:cy,a:0}); }
    G.canos.forEach(c=>{ c.x-=vel*dt; if(!c.passou&&c.x+c.w<px-r){ c.passou=1; G.ganha(1,px,G.y-40*s); }
      if(!c.partido && px+r*.8>c.x && px-r*.8<c.x+c.w && (G.y-r*.8<c.top||G.y+r*.8>c.bot)){ if(G.perde()) c.partido=1; } });
    G.canos=G.canos.filter(c=>c.x>-80*s);
    G.flocos.forEach(f=>{ f.x-=vel*dt; f.a+=dt*2; if(Math.hypot(f.x-px,f.y-G.y)<r+16*s){ f.ok=1; G.ganha(1,f.x,f.y); } }); G.flocos=G.flocos.filter(f=>!f.ok&&f.x>-30);
    G.neve.forEach(n=>{ n.y+=n.v*dt; n.x-=vel*.25*dt; if(n.y>G.H) n.y=-4; if(n.x<0) n.x+=G.W; });
  },
  draw(G,cx){ const s=G.s, g=cx.createLinearGradient(0,0,0,G.H); g.addColorStop(0,'#2A3C8F'); g.addColorStop(1,'#9DB8EC'); cx.fillStyle=g; cx.fillRect(0,0,G.W,G.H);
    cx.fillStyle='rgba(255,255,255,.85)'; G.neve.forEach(n=>{ cx.beginPath(); cx.arc(n.x,n.y,n.r,0,7); cx.fill(); });
    G.canos.forEach(c=>{ cx.globalAlpha=c.partido?.25:1; [[0,c.top],[c.bot,G.H-c.bot]].forEach(([y,h])=>{ const gr=cx.createLinearGradient(c.x,0,c.x+c.w,0); gr.addColorStop(0,'#CFF0FF'); gr.addColorStop(1,'#8CCDF0'); cx.fillStyle=gr; rr(cx,c.x,y,c.w,h,10*s); cx.fill(); cx.fillStyle='#fff'; rr(cx,c.x-5*s,y===0?h-18*s:y,c.w+10*s,18*s,9*s); cx.fill(); }); cx.globalAlpha=1; });
    G.flocos.forEach(f=>{ cx.save(); cx.translate(f.x,f.y); cx.rotate(f.a); cx.strokeStyle='#fff'; cx.lineWidth=3*s; cx.lineCap='round'; for(let i=0;i<3;i++){ cx.rotate(Math.PI/3); cx.beginPath(); cx.moveTo(-12*s,0); cx.lineTo(12*s,0); cx.stroke(); } cx.restore(); });
    cx.fillStyle='#F4FAFF'; cx.fillRect(0,G.H-28*s,G.W,28*s);
    if(!piscar(G)) retrato(cx,'gelino',Math.min(G.W*.28,160*s),G.y,26*s,G.rot,'#BFE8FF');
  }};

/* Corrida do Rugido: paisagem em camadas, mota com rodas a girar e obstáculos desenhados com volume */
function nuvemC(cx,x,y,r){ cx.beginPath(); cx.arc(x,y,r,0,7); cx.arc(x+r*.9,y-r*.4,r*.8,0,7); cx.arc(x+r*1.8,y,r*.9,0,7); cx.fill(); }
const J_RUGIDO={id:'a-rugido',titulo:'Corrida do Rugido',host:'rugido',meta:15,instr:'Toca para o Rugido saltar por cima das pedras, dos cones, dos troncos e das poças. Toca duas vezes para um salto duplo!',
  init(G){ G.chao=G.H*.78; G.y=0; G.vy=0; G.saltos=0; G.obs=[]; G.est=[]; G.po=[]; G.prox=1.4; G.off=0; G.ang=0;
    G.nuv=Array.from({length:5},(_,i)=>({x:i*G.W*.3+Math.random()*80,y:40+Math.random()*G.H*.25,r:16+Math.random()*16}));
    G.pinh=Array.from({length:8},(_,i)=>({x:i*G.W/5+Math.random()*40,h:.7+Math.random()*.5})); },
  tap(G){ if(G.saltos<2){ G.vy=-(G.saltos?480:580)*G.s; G.saltos++; sfx('virar'); } },
  ocioso(G,dt){ G.off+=60*G.s*dt; G.ang+=dt*3; },
  update(G,dt){ const s=G.s, vel=Math.min(440,230+G.t*4)*s; G.off+=vel*dt; G.ang+=vel*dt/(15*s);
    G.vy+=1550*s*dt; G.y+=G.vy*dt; if(G.y>0){ if(G.vy>300*s) for(let i=0;i<6;i++) G.po.push({x:Math.min(G.W*.24,150*s)-20*s,y:G.chao,vx:-(40+Math.random()*80)*s,vy:-(30+Math.random()*60)*s,t:0}); G.y=0; G.vy=0; G.saltos=0; }
    if(G.y===0&&Math.random()<.4) G.po.push({x:Math.min(G.W*.24,150*s)-34*s,y:G.chao-4*s,vx:-(30+Math.random()*40)*s,vy:-(10+Math.random()*30)*s,t:0});
    G.po.forEach(p=>{ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=60*s*dt; }); G.po=G.po.filter(p=>p.t<.6);
    G.prox-=dt; if(G.prox<=0){ G.prox=(.85+Math.random()*1.1)*(Math.min(G.W,700)/400); const t=['pedra','cone','poca','tronco'][Math.floor(Math.random()*4)];
      G.obs.push({x:G.W+30,t,w:(t==='poca'?74:t==='cone'?34:t==='tronco'?58:48)*s,h:(t==='poca'?10:t==='cone'?46:t==='tronco'?30:36)*s,sp:0});
      if(Math.random()<.65) G.est.push({x:G.W+30+(80+Math.random()*120)*s,y:G.chao-(70+Math.random()*120)*s}); }
    const px=Math.min(G.W*.24,150*s), py=G.chao+G.y-58*s, r=28*s;
    G.obs.forEach(o=>{ o.x-=vel*dt; const top=G.chao-o.h;
      if(!o.bateu && px+r*.8>o.x && px-r*.8<o.x+o.w && G.chao+G.y-8*s>top){ if(G.perde()) o.bateu=1; }
      if(!o.passou&&!o.bateu&&o.x+o.w<px-r){ o.passou=1; G.ganha(1,px,py-40*s); } });
    G.obs=G.obs.filter(o=>o.x>-100);
    G.est.forEach(e=>{ e.x-=vel*dt; if(Math.hypot(e.x-px,e.y-py)<r+18*s){ e.ok=1; G.ganha(2,e.x,e.y,'+2'); } }); G.est=G.est.filter(e=>!e.ok&&e.x>-30);
  },
  draw(G,cx){ const s=G.s, W=G.W, H=G.H, ch=G.chao;
    const g=cx.createLinearGradient(0,0,0,ch); g.addColorStop(0,'#6FC2F7'); g.addColorStop(1,'#DDF2FF'); cx.fillStyle=g; cx.fillRect(0,0,W,ch);
    const sx=W*.8, sy=H*.14; cx.fillStyle='rgba(255,226,120,.35)'; cx.beginPath(); cx.arc(sx,sy,56*s,0,7); cx.fill(); cx.fillStyle='#FFD86B'; cx.beginPath(); cx.arc(sx,sy,34*s,0,7); cx.fill();
    cx.fillStyle='rgba(255,255,255,.95)'; G.nuv.forEach(n=>{ const x=((n.x-G.off*.05)%(W+200)+W+200)%(W+200)-100; nuvemC(cx,x,n.y,n.r*s); });
    cx.fillStyle='#A9C7E8'; cx.beginPath(); cx.moveTo(0,ch); for(let x=0;x<=W+40;x+=40){ const k=(x+G.off*.12)*.006; cx.lineTo(x,ch-90*s-Math.sin(k)*40*s-Math.sin(k*2.3)*20*s); } cx.lineTo(W,ch); cx.fill();
    cx.fillStyle='#8DD07A'; cx.beginPath(); cx.moveTo(0,ch); for(let x=0;x<=W+40;x+=30){ const k=(x+G.off*.3)*.01; cx.lineTo(x,ch-40*s-Math.sin(k)*18*s); } cx.lineTo(W,ch); cx.fill();
    G.pinh.forEach(p=>{ const span=W+160; const x=((p.x-G.off*.3)%span+span)%span-80, base=ch-30*s, h=60*s*p.h; cx.fillStyle='#7A5A3E'; cx.fillRect(x-4*s,base-h*.3,8*s,h*.3); cx.fillStyle='#4FA65B'; cx.beginPath(); cx.moveTo(x,base-h); cx.lineTo(x+22*s*p.h,base-h*.25); cx.lineTo(x-22*s*p.h,base-h*.25); cx.fill(); cx.fillStyle='#5FBA69'; cx.beginPath(); cx.moveTo(x,base-h*1.15); cx.lineTo(x+16*s*p.h,base-h*.55); cx.lineTo(x-16*s*p.h,base-h*.55); cx.fill(); });
    const fp=60*s; cx.fillStyle='#C99B6A'; for(let x=-(G.off*.8)%fp;x<W;x+=fp){ rr(cx,x,ch-26*s,7*s,26*s,2*s); cx.fill(); } cx.fillRect(0,ch-20*s,W,4*s); cx.fillRect(0,ch-10*s,W,4*s);
    cx.fillStyle='#6CBF5C'; cx.fillRect(0,ch,W,8*s); cx.fillStyle='#6E6A78'; cx.fillRect(0,ch+8*s,W,H-ch); cx.fillStyle='#5E5A68'; cx.fillRect(0,ch+8*s,W,5*s);
    cx.strokeStyle='#FFE9A0'; cx.lineWidth=6*s; cx.setLineDash([30*s,24*s]); cx.lineDashOffset=G.off; cx.beginPath(); cx.moveTo(0,ch+(H-ch)/2+4*s); cx.lineTo(W,ch+(H-ch)/2+4*s); cx.stroke(); cx.setLineDash([]);
    G.obs.forEach(o=>{ const top=ch-o.h; cx.globalAlpha=o.bateu?.35:1;
      if(o.t==='pedra'){ cx.fillStyle='rgba(0,0,0,.15)'; cx.beginPath(); cx.ellipse(o.x+o.w/2,ch+3*s,o.w*.6,5*s,0,0,7); cx.fill();
        cx.fillStyle='#8E92A3'; cx.beginPath(); cx.moveTo(o.x,ch); cx.lineTo(o.x+o.w*.1,top+o.h*.35); cx.lineTo(o.x+o.w*.4,top); cx.lineTo(o.x+o.w*.8,top+o.h*.15); cx.lineTo(o.x+o.w,ch); cx.fill();
        cx.fillStyle='#B4B8C6'; cx.beginPath(); cx.moveTo(o.x+o.w*.2,top+o.h*.4); cx.lineTo(o.x+o.w*.42,top+o.h*.12); cx.lineTo(o.x+o.w*.6,top+o.h*.25); cx.lineTo(o.x+o.w*.4,top+o.h*.5); cx.fill(); }
      else if(o.t==='cone'){ cx.fillStyle='#3A3A48'; rr(cx,o.x-4*s,ch-6*s,o.w+8*s,6*s,2*s); cx.fill(); cx.fillStyle='#F28C28'; cx.beginPath(); cx.moveTo(o.x+o.w*.4,top); cx.lineTo(o.x+o.w*.6,top); cx.lineTo(o.x+o.w,ch-6*s); cx.lineTo(o.x,ch-6*s); cx.fill(); cx.fillStyle='#fff'; [.35,.65].forEach(k=>{ const y=top+o.h*k, hw=o.w*(.1+k*.4); cx.fillRect(o.x+o.w/2-hw,y,hw*2,6*s); }); }
      else if(o.t==='tronco'){ cx.fillStyle='#8B5E3C'; rr(cx,o.x,top,o.w,o.h,o.h/2); cx.fill(); cx.fillStyle='#C99B6A'; cx.beginPath(); cx.ellipse(o.x+o.w-o.h*.3,top+o.h/2,o.h*.32,o.h*.45,0,0,7); cx.fill(); cx.strokeStyle='#8B5E3C'; cx.lineWidth=2*s; cx.beginPath(); cx.ellipse(o.x+o.w-o.h*.3,top+o.h/2,o.h*.15,o.h*.22,0,0,7); cx.stroke(); cx.strokeStyle='#6E4A2E'; cx.beginPath(); cx.moveTo(o.x+8*s,top+o.h*.35); cx.lineTo(o.x+o.w*.55,top+o.h*.35); cx.stroke(); }
      else { cx.fillStyle='#4D9FD8'; cx.beginPath(); cx.ellipse(o.x+o.w/2,ch+3*s,o.w/2,o.h,0,0,7); cx.fill(); cx.strokeStyle='rgba(255,255,255,.7)'; cx.lineWidth=2*s; const k=(G.t*2)%1; cx.beginPath(); cx.ellipse(o.x+o.w/2,ch+3*s,o.w*.2+o.w*.25*k,o.h*.4+o.h*.4*k,0,0,7); cx.stroke(); }
      cx.globalAlpha=1; });
    G.est.forEach(e=>{ cx.save(); cx.translate(e.x,e.y); cx.rotate(Math.sin(G.t*4+e.x)*.25); cx.fillStyle='rgba(255,216,107,.35)'; cx.beginPath(); cx.arc(0,0,22*s,0,7); cx.fill(); estrela(cx,0,0,17*s); cx.restore(); });
    cx.fillStyle='rgba(180,160,130,.6)'; G.po.forEach(p=>{ cx.globalAlpha=1-p.t/.6; cx.beginPath(); cx.arc(p.x,p.y,(3+p.t*10)*s,0,7); cx.fill(); }); cx.globalAlpha=1;
    if(!piscar(G)){ const px=Math.min(W*.24,150*s), by=ch+G.y, inc=Math.max(-.25,Math.min(.2,G.vy/(2400*s)));
      cx.save(); cx.translate(px,by); cx.rotate(inc);
      cx.fillStyle='rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(0,-G.y+4*s,40*s,6*s,0,0,7); cx.fill();
      [-28,28].forEach(dx=>{ cx.save(); cx.translate(dx*s,-15*s); cx.fillStyle='#22263D'; cx.beginPath(); cx.arc(0,0,15*s,0,7); cx.fill(); cx.fillStyle='#C9CCDA'; cx.beginPath(); cx.arc(0,0,9*s,0,7); cx.fill(); cx.strokeStyle='#22263D'; cx.lineWidth=2*s; cx.rotate(G.ang); for(let k=0;k<3;k++){ cx.rotate(Math.PI/3); cx.beginPath(); cx.moveTo(-9*s,0); cx.lineTo(9*s,0); cx.stroke(); } cx.fillStyle='#55628E'; cx.beginPath(); cx.arc(0,0,3*s,0,7); cx.fill(); cx.restore(); });
      cx.fillStyle='#8E92A3'; rr(cx,-40*s,-26*s,22*s,6*s,3*s); cx.fill();
      cx.fillStyle='#E5484D'; cx.beginPath(); cx.moveTo(-34*s,-18*s); cx.quadraticCurveTo(-30*s,-40*s,-4*s,-40*s); cx.lineTo(18*s,-40*s); cx.quadraticCurveTo(30*s,-36*s,34*s,-20*s); cx.lineTo(10*s,-16*s); cx.lineTo(-20*s,-14*s); cx.closePath(); cx.fill();
      cx.fillStyle='#FF7A70'; cx.beginPath(); cx.ellipse(6*s,-34*s,12*s,4*s,0,0,7); cx.fill();
      cx.fillStyle='#2B2B33'; rr(cx,-24*s,-46*s,26*s,8*s,4*s); cx.fill();
      cx.strokeStyle='#55628E'; cx.lineWidth=4*s; cx.lineCap='round'; cx.beginPath(); cx.moveTo(26*s,-22*s); cx.lineTo(32*s,-52*s); cx.lineTo(24*s,-56*s); cx.stroke();
      cx.fillStyle='#FFE07A'; cx.beginPath(); cx.arc(37*s,-28*s,5*s,0,7); cx.fill();
      cx.restore();
      retrato(cx,'rugido',px-4*s,by-78*s+G.y*0,30*s,inc,'#FFD86B');
      cx.strokeStyle='#E5484D'; cx.lineWidth=9*s; cx.lineCap='round'; cx.beginPath(); cx.arc(px-4*s,by-78*s,34*s,Math.PI*1.12,Math.PI*1.88); cx.stroke(); cx.strokeStyle='#fff'; cx.lineWidth=3*s; cx.beginPath(); cx.arc(px-4*s,by-78*s,34*s,Math.PI*1.35,Math.PI*1.55); cx.stroke(); }
  }};

/* Salta, Coelhita! */
const ARCO_C=['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#4B4BB5','#9A5BD6'];
const J_COELHITA={id:'a-coelhita',titulo:'Salta, Coelhita!',host:'coelhita',meta:30,instr:'A Coelhita salta sozinha. Arrasta o dedo para a levar de nuvem em nuvem e apanha as cores do arco-íris por ordem!',
  init(G){ const s=G.s; G.x=G.W/2; G.px=G.W/2; G.y=G.H*.75; G.vy=-640*s; G.alt=0; G.altPts=0; G.cores=0; G.plat=[]; G.gotas=[];
    let y=G.H-30*s; G.plat.push({x:G.W/2-55*s,y,w:110*s}); while(y>-G.H){ y-=(80+Math.random()*40)*s; G.plat.push({x:Math.random()*(G.W-100*s),y,w:100*s}); } },
  update(G,dt){ const s=G.s, r=26*s;
    if(G.teclas.ArrowLeft) G.px-=420*s*dt; if(G.teclas.ArrowRight) G.px+=420*s*dt;
    G.x+=(G.px-G.x)*Math.min(1,dt*7); if(G.x<0) G.x+=G.W; if(G.x>G.W) G.x-=G.W;
    const yAnt=G.y; G.vy+=1150*s*dt; G.y+=G.vy*dt;
    if(G.vy>0) G.plat.forEach(p=>{ if(G.x>p.x-8*s&&G.x<p.x+p.w+8*s&&yAnt+r<=p.y+4&&G.y+r>=p.y){ G.y=p.y-r; G.vy=-660*s; p.toque=.25; } });
    G.plat.forEach(p=>{ if(p.vx){ p.x+=p.vx*dt; if(p.x<0||p.x+p.w>G.W) p.vx*=-1; } if(p.toque) p.toque=Math.max(0,p.toque-dt); });
    if(G.y<G.H*.42){ const d=G.H*.42-G.y; G.y+=d; G.plat.forEach(p=>p.y+=d); G.gotas.forEach(g=>g.y+=d); G.alt+=d; const n=Math.floor(G.alt/(60*s)); if(n>G.altPts){ G.pts+=n-G.altPts; G.altPts=n; } }
    G.plat=G.plat.filter(p=>p.y<G.H+30*s);
    let topo=Math.min(...G.plat.map(p=>p.y));
    while(topo>-40*s){ topo-=(80+Math.min(55,G.alt/(400*s))+Math.random()*40)*s; const w=Math.max(66,104-G.alt/(250*s))*s; const p={x:Math.random()*(G.W-w),y:topo,w}; if(G.alt>2500*s&&Math.random()<.35) p.vx=(60+Math.random()*60)*s*(Math.random()<.5?-1:1); G.plat.push(p);
      if(Math.random()<.3) G.gotas.push({x:p.x+p.w/2,y:topo-40*s,c:G.cores%7,f:Math.random()*6}); }
    G.gotas.forEach(g=>{ g.f+=dt*3; if(Math.hypot(g.x-G.x,g.y-G.y)<r+16*s){ g.ok=1; if(g.c===G.cores%7){ G.cores++; G.ganha(3,g.x,g.y,'+3'); if(G.cores%7===0){ G.anuncio('Arco-íris!'); sfx('estrela'); G.pts+=10; } } } });
    G.gotas=G.gotas.filter(g=>!g.ok&&g.y<G.H+30);
    if(G.y-r>G.H){ G.perde(); const vis=G.plat.filter(p=>p.y<G.H-40*s&&p.y>G.H*.4).sort((a,b)=>b.y-a.y)[0]; if(vis){ G.x=G.px=vis.x+vis.w/2; G.y=vis.y-60*s; } else { G.plat.push({x:G.W/2-55*s,y:G.H-60*s,w:110*s}); G.x=G.px=G.W/2; G.y=G.H-120*s; } G.vy=-640*s; }
  },
  draw(G,cx){ const s=G.s, g=cx.createLinearGradient(0,0,0,G.H); g.addColorStop(0,'#BFE3FF'); g.addColorStop(1,'#FCE3F0'); cx.fillStyle=g; cx.fillRect(0,0,G.W,G.H);
    G.plat.forEach(p=>{ const y=p.y+(p.toque?p.toque*14*s:0); cx.fillStyle='#fff'; cx.beginPath(); cx.ellipse(p.x+p.w/2,y+8*s,p.w/2,12*s,0,0,7); cx.fill(); cx.beginPath(); cx.arc(p.x+p.w*.35,y+2*s,14*s,0,7); cx.arc(p.x+p.w*.62,y,17*s,0,7); cx.fill(); if(p.vx){ cx.fillStyle='rgba(154,120,232,.25)'; cx.beginPath(); cx.ellipse(p.x+p.w/2,y+12*s,p.w/2,6*s,0,0,7); cx.fill(); } });
    G.gotas.forEach(gt=>{ const y=gt.y+Math.sin(gt.f)*5*s; cx.fillStyle=ARCO_C[gt.c]; cx.beginPath(); cx.moveTo(gt.x,y-16*s); cx.quadraticCurveTo(gt.x+13*s,y+2*s,gt.x,y+12*s); cx.quadraticCurveTo(gt.x-13*s,y+2*s,gt.x,y-16*s); cx.fill(); cx.fillStyle='rgba(255,255,255,.6)'; cx.beginPath(); cx.arc(gt.x-4*s,y,3*s,0,7); cx.fill(); });
    ARCO_C.forEach((c,i)=>{ cx.strokeStyle=i<G.cores%7?c:'rgba(255,255,255,.7)'; cx.lineWidth=5*s; cx.beginPath(); cx.arc(G.W/2,84*s,(46-i*5)*s,Math.PI,0); cx.stroke(); });
    if(!piscar(G)) retrato(cx,'coelhita',G.x,G.y,26*s,(G.px-G.x)*.003,'#fff');
  }};

/* Tuninho Mergulhador: medusas brilhantes, peixes-balão e algas a ondular */
const J_TUNINHO={id:'a-tuninho',titulo:'Tuninho Mergulhador',host:'tuninho',meta:20,instr:'Arrasta o dedo para cima e para baixo. Apanha as bolhas douradas e os parafusos. Foge das medusas, dos peixes-balão e das algas!',
  init(G){ G.y=G.H/2; G.py=G.H/2; G.itens=[]; G.prox=.5; G.bol=Array.from({length:30},()=>({x:Math.random()*G.W,y:Math.random()*G.H,r:2+Math.random()*4,v:20+Math.random()*40})); G.off=0;
    G.corais=Array.from({length:7},(_,i)=>({x:i*G.W/4,t:i%3,h:.6+Math.random()*.6})); },
  ocioso(G,dt){ G.off+=40*G.s*dt; },
  update(G,dt){ const s=G.s, vel=Math.min(330,150+G.t*3)*s, px=Math.min(G.W*.22,140*s), r=28*s; G.off+=vel*dt;
    if(G.teclas.ArrowUp) G.py-=380*s*dt; if(G.teclas.ArrowDown) G.py+=380*s*dt;
    G.y+=(Math.max(r,Math.min(G.H-48*s,G.py))-G.y)*Math.min(1,dt*6);
    G.prox-=dt; if(G.prox<=0){ G.prox=(.45+Math.random()*.6)*(Math.min(G.W,700)/400); const q=Math.random(); const t=q<.45?'bolha':q<.55?'parafuso':q<.75?'medusa':q<.88?'balao':'alga';
      G.itens.push({t,x:G.W+50,y:t==='alga'?G.H:40*s+Math.random()*(G.H-130*s),h:t==='alga'?(G.H*.25+Math.random()*G.H*.25):0,f:Math.random()*6}); }
    G.itens.forEach(it=>{ it.x-=vel*dt*(it.t==='medusa'?.8:it.t==='balao'?.9:1); it.f+=dt*2;
      const iy=it.t==='medusa'?it.y+Math.sin(it.f)*30*s:it.t==='balao'?it.y+Math.sin(it.f*1.5)*14*s:it.y;
      if(it.ok) return;
      if(it.t==='alga'){ if(px+r*.7>it.x-14*s&&px-r*.7<it.x+14*s&&G.y+r*.7>G.H-it.h){ if(G.perde()) it.ok=2; } }
      else if(Math.hypot(it.x-px,iy-G.y)<r+(it.t==='medusa'?20:it.t==='balao'?(16+6*Math.abs(Math.sin(it.f)))*1:14)*s){ if(it.t==='medusa'||it.t==='balao'){ if(G.perde()) it.ok=2; } else { it.ok=1; G.ganha(it.t==='parafuso'?3:1,it.x,iy); } } });
    G.itens=G.itens.filter(it=>it.ok!==1&&it.x>-80);
    G.bol.forEach(b=>{ b.y-=b.v*dt; b.x-=vel*.2*dt; if(b.y<-10){ b.y=G.H+10; b.x=Math.random()*G.W; } if(b.x<-10) b.x+=G.W; });
  },
  draw(G,cx){ const s=G.s, W=G.W, H=G.H, g=cx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#62CBE8'); g.addColorStop(.6,'#2C79B4'); g.addColorStop(1,'#163F78'); cx.fillStyle=g; cx.fillRect(0,0,W,H);
    cx.fillStyle='rgba(255,255,255,.08)'; for(let i=0;i<5;i++){ const x=((i*W*.3)-(G.off*.1))%(W*1.5); cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x+70*s,0); cx.lineTo(x-40*s,H); cx.lineTo(x-100*s,H); cx.fill(); }
    cx.strokeStyle='rgba(255,255,255,.45)'; cx.lineWidth=1.5; G.bol.forEach(b=>{ cx.beginPath(); cx.arc(b.x,b.y,b.r,0,7); cx.stroke(); });
    G.corais.forEach(c=>{ const span=W+200, x=((c.x-G.off*.35)%span+span)%span-100, base=H-14*s, h=70*s*c.h; cx.fillStyle=['rgba(238,111,160,.55)','rgba(247,188,47,.5)','rgba(154,120,232,.5)'][c.t]; cx.beginPath(); cx.moveTo(x-6*s,base); cx.quadraticCurveTo(x-20*s,base-h*.6,x-10*s,base-h); cx.quadraticCurveTo(x,base-h*.7,x+4*s,base-h*.9); cx.quadraticCurveTo(x+18*s,base-h*.5,x+8*s,base); cx.fill(); });
    cx.fillStyle='#E9D9A6'; cx.beginPath(); cx.moveTo(0,H); for(let x=0;x<=W;x+=20) cx.lineTo(x,H-16*s-Math.sin((x+G.off)*.02)*6*s); cx.lineTo(W,H); cx.fill();
    G.itens.forEach(it=>{ const iy=it.t==='medusa'?it.y+Math.sin(it.f)*30*s:it.t==='balao'?it.y+Math.sin(it.f*1.5)*14*s:it.y; cx.globalAlpha=it.ok===2?.3:1;
      if(it.t==='bolha'){ const gr=cx.createRadialGradient(it.x-4*s,iy-4*s,1,it.x,iy,15*s); gr.addColorStop(0,'#FFF7D6'); gr.addColorStop(.5,'#FFD86B'); gr.addColorStop(1,'#E6A817'); cx.fillStyle=gr; cx.beginPath(); cx.arc(it.x,iy,14*s,0,7); cx.fill(); cx.strokeStyle='rgba(255,255,255,.8)'; cx.lineWidth=2*s; cx.beginPath(); cx.arc(it.x,iy,14*s,-2.4,-1.4); cx.stroke(); }
      else if(it.t==='parafuso'){ const gr=cx.createLinearGradient(it.x-15*s,iy-15*s,it.x+15*s,iy+15*s); gr.addColorStop(0,'#F1F3F8'); gr.addColorStop(1,'#9AA0B2'); cx.fillStyle=gr; cx.beginPath(); for(let k=0;k<6;k++){ const a=k*Math.PI/3+it.f; cx.lineTo(it.x+Math.cos(a)*16*s,iy+Math.sin(a)*16*s); } cx.fill(); cx.fillStyle='#6E7486'; cx.beginPath(); cx.arc(it.x,iy,6*s,0,7); cx.fill(); }
      else if(it.t==='medusa'){ const pul=1+Math.sin(it.f*3)*.08;
        cx.save(); cx.translate(it.x,iy); cx.scale(1/pul,pul);
        const gl=cx.createRadialGradient(0,0,4*s,0,0,40*s); gl.addColorStop(0,'rgba(244,143,184,.45)'); gl.addColorStop(1,'rgba(244,143,184,0)'); cx.fillStyle=gl; cx.beginPath(); cx.arc(0,0,40*s,0,7); cx.fill();
        cx.strokeStyle='rgba(214,110,170,.85)'; cx.lineWidth=3*s; cx.lineCap='round'; for(let k=-2;k<=2;k++){ cx.beginPath(); cx.moveTo(k*7*s,2*s); for(let j=1;j<=4;j++) cx.lineTo(k*7*s+Math.sin(it.f*4+k+j)*5*s,2*s+j*8*s); cx.stroke(); }
        const gb=cx.createLinearGradient(0,-22*s,0,4*s); gb.addColorStop(0,'#FBC4DC'); gb.addColorStop(1,'#E77FB0'); cx.fillStyle=gb; cx.beginPath(); cx.arc(0,0,22*s,Math.PI,0); cx.quadraticCurveTo(11*s,7*s,0,3*s); cx.quadraticCurveTo(-11*s,7*s,-22*s,0); cx.fill();
        cx.fillStyle='rgba(255,255,255,.55)'; cx.beginPath(); cx.ellipse(-8*s,-12*s,6*s,3*s,-.5,0,7); cx.fill();
        cx.fillStyle='#3B2140'; cx.beginPath(); cx.arc(-6*s,-6*s,2.6*s,0,7); cx.arc(6*s,-6*s,2.6*s,0,7); cx.fill();
        cx.strokeStyle='#3B2140'; cx.lineWidth=1.6*s; cx.beginPath(); cx.arc(0,-3*s,3*s,.2,Math.PI-.2); cx.stroke(); cx.restore(); }
      else if(it.t==='balao'){ const inch=1+.25*Math.abs(Math.sin(it.f)), R=16*s*inch;
        cx.save(); cx.translate(it.x,iy);
        cx.fillStyle='#E0A92A'; for(let k=0;k<12;k++){ const a=k*Math.PI/6; cx.beginPath(); cx.moveTo(Math.cos(a-.12)*R,Math.sin(a-.12)*R); cx.lineTo(Math.cos(a)*(R+8*s),Math.sin(a)*(R+8*s)); cx.lineTo(Math.cos(a+.12)*R,Math.sin(a+.12)*R); cx.fill(); }
        const gp=cx.createRadialGradient(-5*s,-5*s,2*s,0,0,R); gp.addColorStop(0,'#FFF0A8'); gp.addColorStop(1,'#F5C518'); cx.fillStyle=gp; cx.beginPath(); cx.arc(0,0,R,0,7); cx.fill();
        cx.fillStyle='#F7D96A'; cx.beginPath(); cx.moveTo(R*.9,0); cx.lineTo(R+12*s,-8*s); cx.lineTo(R+12*s,8*s); cx.fill();
        cx.fillStyle='#fff'; cx.beginPath(); cx.arc(-R*.4,-R*.25,5*s,0,7); cx.fill(); cx.fillStyle='#22263D'; cx.beginPath(); cx.arc(-R*.45,-R*.25,2.6*s,0,7); cx.fill();
        cx.fillStyle='#E5484D'; cx.beginPath(); cx.ellipse(-R*.75,R*.15,3*s,2.2*s,0,0,7); cx.fill(); cx.restore(); }
      else { const base=H; [[-10,'#2FB383',1],[0,'#43C68F',1.15],[10,'#279E72',.85]].forEach(([dx,cor,k])=>{ cx.strokeStyle=cor; cx.lineWidth=10*s; cx.lineCap='round'; cx.beginPath(); cx.moveTo(it.x+dx*s,base); let lx=it.x, ly=base; for(let y=0;y<it.h*k;y+=12){ lx=it.x+dx*s+Math.sin((y+it.f*40)*.05+dx)*9*s; ly=base-y; cx.lineTo(lx,ly); } cx.stroke(); cx.fillStyle=cor; for(let y=24;y<it.h*k;y+=34){ const xx=it.x+dx*s+Math.sin((y+it.f*40)*.05+dx)*9*s; cx.beginPath(); cx.ellipse(xx+8*s,base-y,9*s,4*s,-.6,0,7); cx.fill(); } });
        cx.fillStyle='#8E92A3'; cx.beginPath(); cx.ellipse(it.x,base-4*s,24*s,10*s,0,0,7); cx.fill(); }
      cx.globalAlpha=1; });
    if(!piscar(G)){ const px=Math.min(W*.22,140*s); cx.fillStyle='rgba(190,235,255,.35)'; cx.beginPath(); cx.arc(px,G.y,36*s,0,7); cx.fill(); retrato(cx,'tuninho',px,G.y,28*s,(G.py-G.y)*.002,'rgba(190,235,255,.95)'); }
  }};

/* ---------- Músicas: leitor ao estilo Spotify ----------
   Cada faixa pode ter src (ficheiro de áudio, vindo do backoffice). Sem src, toca uma melodia de demonstração. */
const MUSICAS=(C.musicas||[]).filter(m=>m.src||m.seq);
function freq(n){ const m=n.match(/([A-G])(#?)(\d)/); const idx={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0); return 440*Math.pow(2,(idx+(+m[3]+1)*12-69)/12); }
function notasDe(m){ const b=60/m.bpm; let t=0; const ns=[];
  m.seq.forEach(sec=>{ m[sec].forEach(l=>{ l.split(' ').forEach(tk=>{ const [n,d]=tk.split(':'); const dur=parseFloat(d)*b; if(n!=='R') ns.push({f:freq(n),t,d:dur}); t+=dur; }); t+=b*.5; }); t+=b; });
  return {ns,dur:t}; }
const P={i:-1,tocando:false,off:0,t0:0,dur:0,nos:[],aleat:false,rep:false,audio:null,timer:null,raf:null};
function pararMusica(){} /* a música continua a tocar quando se fecha um ecrã */
function somOff(){ clearTimeout(P.timer); P.nos.forEach(o=>{ try{o.stop();}catch(e){} }); P.nos=[]; if(P.audio){ P.audio.pause(); } }
function notaM(f,t0,d){ const c=actx,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain(); o.type='triangle'; o2.type='sine'; o.frequency.value=f; o2.frequency.value=f*2; g2.gain.value=.22; o2.connect(g2); g2.connect(g); o.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(.2,t0+.02); g.gain.exponentialRampToValueAtTime(.05,t0+d*.75); g.gain.linearRampToValueAtTime(0,t0+d*.98); o.start(t0); o2.start(t0); o.stop(t0+d); o2.stop(t0+d); P.nos.push(o,o2); }
function posMus(){ if(P.i<0) return 0; const m=MUSICAS[P.i]; if(m.src&&P.audio) return P.audio.currentTime||0; return P.tocando?Math.min(P.dur,actx.currentTime-P.t0):P.off; }
function tocarFaixa(i,desde){
  desde=desde||0; somOff(); calar(); P.i=i; const m=MUSICAS[i];
  if(m.src){ if(!P.audio){ P.audio=new Audio(); P.audio.onended=fimFaixa; P.audio.onloadedmetadata=()=>{ P.dur=P.audio.duration; uiMus(); }; }
    if(P.audio.dataset.src!==m.src){ P.audio.src=m.src; P.audio.dataset.src=m.src; } P.audio.currentTime=desde; P.audio.play().catch(()=>{}); P.dur=P.audio.duration||0; }
  else { if(!ctx()) return; const {ns,dur}=notasDe(m); P.dur=dur; P.t0=actx.currentTime+.08-desde; ns.forEach(n=>{ if(n.t>=desde) notaM(n.f,P.t0+n.t,n.d); }); P.timer=setTimeout(fimFaixa,(dur-desde)*1000+150); }
  P.tocando=true; P.off=desde; uiMus(); cicloMus();
}
function pausaMus(){ if(!P.tocando) return; P.off=posMus(); somOff(); P.tocando=false; uiMus(); }
function playPausa(){ if(P.i<0) return tocarFaixa(0); if(P.tocando) pausaMus(); else tocarFaixa(P.i,P.off>=P.dur-.2?0:P.off); }
function proxFaixa(auto){ if(P.rep&&auto) return tocarFaixa(P.i); let n; if(P.aleat&&MUSICAS.length>1){ do{ n=Math.floor(Math.random()*MUSICAS.length); }while(n===P.i); } else n=(P.i+1)%MUSICAS.length; tocarFaixa(n); }
function antFaixa(){ if(posMus()>3) return tocarFaixa(P.i); tocarFaixa((P.i-1+MUSICAS.length)%MUSICAS.length); }
function fimFaixa(){ ganhar('m'+P.i,document.querySelector('.vinil-w')||document.getElementById('mini')); proxFaixa(true); }
const mmss=s=>{ s=Math.max(0,Math.round(s||0)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };
function cicloMus(){ cancelAnimationFrame(P.raf); const f=()=>{ const p=P.dur?posMus()/P.dur:0;
  document.querySelectorAll('.mus-barra i').forEach(b=>b.style.transform='scaleX('+p+')');
  const r=document.getElementById('mus-range'); if(r&&!r.dataset.arrasta) r.value=Math.round(p*1000);
  const a=document.getElementById('mus-t'); if(a) a.textContent=mmss(posMus());
  if(P.tocando) P.raf=requestAnimationFrame(f); }; f(); }
function uiMus(){
  const m=MUSICAS[P.i], mini=document.getElementById('mini');
  if(P.i>=0){ mini.hidden=false; document.body.classList.add('com-mini');
    mini.innerHTML='<span class="mus-barra"><i></i></span><button class="mini-abre" id="mini-abre" aria-label="Abrir o leitor"><span class="mini-capa'+(P.tocando?' gira':'')+'"><img src="'+IMG[m.capa]+'" alt=""></span><span class="tx"><b>'+esc(m.t)+'</b><small>'+esc(m.a)+'</small></span></button><button class="mini-b" id="mini-pp" aria-label="'+(P.tocando?'Pausa':'Tocar')+'">'+ic(P.tocando?'pause':'play',P.tocando?'❚❚':'▶')+'</button><button class="mini-b" id="mini-nx" aria-label="Próxima">'+ic('skip-forward','»')+'</button>';
    document.getElementById('mini-abre').onclick=()=>{ sfx('pop'); abrirLeitor(); };
    document.getElementById('mini-pp').onclick=()=>{ playPausa(); };
    document.getElementById('mini-nx').onclick=()=>{ sfx('pop'); proxFaixa(); };
  }
  const L=document.getElementById('leitor'); if(L) desLeitor();
  document.querySelectorAll('.faixa').forEach(f=>{ const i=+f.dataset.f; f.classList.toggle('atual',i===P.i); f.classList.toggle('toca',i===P.i&&P.tocando); });
  const pa=document.getElementById('play-todas'); if(pa) pa.innerHTML=ic(P.tocando?'pause':'play',P.tocando?'❚❚':'▶')+(P.tocando?' Pausa':' Tocar');
  icones(); cicloMus();
}
function vMusicas(){
  return '<section class="playlist entra" style="--i:1"><div class="pl-capa">'+['francisca','tuninho','cavaleiro','dragao'].map(k=>'<img src="'+IMG[k]+'" alt="">').join('')+'</div><div class="pl-info"><small>Lista de músicas</small><h2>Músicas dos Amigos</h2><p>'+MUSICAS.length+' músicas</p></div>'+
    '<div class="pl-acoes"><button class="btn btn-ouro" id="play-todas">'+ic(P.tocando?'pause':'play','▶')+(P.tocando?' Pausa':' Tocar')+'</button><button class="btn btn-claro btn-redondo'+(P.aleat?' ativo':'')+'" id="pl-aleat" aria-label="Aleatório" aria-pressed="'+P.aleat+'">'+ic('shuffle','⤮')+'</button></div></section>'+
    '<ol class="faixas">'+MUSICAS.map((m,i)=>'<li><button class="faixa entra'+(i===P.i?' atual':'')+(i===P.i&&P.tocando?' toca':'')+'" style="--i:'+(i+2)+'" data-f="'+i+'"><span class="f-n"><span class="num">'+(i+1)+'</span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></span><img src="'+IMG[m.capa]+'" alt=""><span class="tx"><b>'+esc(m.t)+'</b><small>'+esc(m.a)+(m.src?'':' · Demo')+'</small></span><span class="f-d">'+(m.src?(m.dur?mmss(m.dur):''):mmss(notasDe(m).dur))+'</span>'+(feito['m'+i]?'<span class="f-ok">'+ESTRELA+'</span>':'')+'</button></li>').join('')+'</ol>';
}
function ligarMusicas(){
  const pa=document.getElementById('play-todas'); if(!pa) return;
  pa.onclick=()=>{ sfx('pop'); playPausa(); };
  document.getElementById('pl-aleat').onclick=e=>{ P.aleat=!P.aleat; e.currentTarget.classList.toggle('ativo',P.aleat); e.currentTarget.setAttribute('aria-pressed',P.aleat); sfx('pop'); };
  document.querySelectorAll('.faixa').forEach(f=>f.onclick=()=>{ const i=+f.dataset.f; if(i===P.i) abrirLeitor(); else { tocarFaixa(i); } });
}
function abrirLeitor(){ abrirOv('A tocar'); corpo('<div id="leitor"></div>'); desLeitor(); }
function desLeitor(){
  const L=document.getElementById('leitor'); if(!L) return; const m=MUSICAS[P.i]; if(!m) return;
  L.innerHTML='<div class="leitor-m"><div class="vinil-w"><div class="vinil-g'+(P.tocando?' toca':'')+'"><img src="'+IMG[m.capa]+'" alt=""></div></div>'+
    '<div class="mus-info"><h2>'+esc(m.t)+'</h2><p>'+esc(m.a)+'</p></div>'+
    '<div class="mus-prog"><input type="range" id="mus-range" min="0" max="1000" value="0" aria-label="Posição na música"><div class="mus-tempos"><span id="mus-t">0:00</span><span>'+mmss(P.dur)+'</span></div></div>'+
    '<div class="mus-ctl"><button class="mus-s'+(P.aleat?' ativo':'')+'" id="m-aleat" aria-label="Aleatório" aria-pressed="'+P.aleat+'">'+ic('shuffle','⤮')+'</button><button class="mus-s grande" id="m-ant" aria-label="Anterior">'+ic('skip-back','«')+'</button>'+
    '<button class="mus-play" id="m-pp" aria-label="'+(P.tocando?'Pausa':'Tocar')+'">'+ic(P.tocando?'pause':'play',P.tocando?'❚❚':'▶')+'</button>'+
    '<button class="mus-s grande" id="m-seg" aria-label="Próxima">'+ic('skip-forward','»')+'</button><button class="mus-s'+(P.rep?' ativo':'')+'" id="m-rep" aria-label="Repetir esta" aria-pressed="'+P.rep+'">'+ic('repeat-1','↻')+'</button></div>'+
    '<div class="a-seguir"><small>A seguir</small>'+[1,2].map(d=>{ const k=(P.i+d)%MUSICAS.length, x=MUSICAS[k]; return '<button class="faixa mini-f" data-f="'+k+'"><img src="'+IMG[x.capa]+'" alt=""><span class="tx"><b>'+esc(x.t)+'</b><small>'+esc(x.a)+'</small></span></button>'; }).join('')+'</div></div>';
  icones();
  document.getElementById('m-pp').onclick=()=>playPausa();
  document.getElementById('m-seg').onclick=()=>{ sfx('pop'); proxFaixa(); };
  document.getElementById('m-ant').onclick=()=>{ sfx('pop'); antFaixa(); };
  document.getElementById('m-aleat').onclick=e=>{ P.aleat=!P.aleat; e.currentTarget.classList.toggle('ativo',P.aleat); e.currentTarget.setAttribute('aria-pressed',P.aleat); };
  document.getElementById('m-rep').onclick=e=>{ P.rep=!P.rep; e.currentTarget.classList.toggle('ativo',P.rep); e.currentTarget.setAttribute('aria-pressed',P.rep); };
  L.querySelectorAll('.mini-f').forEach(f=>f.onclick=()=>tocarFaixa(+f.dataset.f));
  const r=document.getElementById('mus-range');
  r.oninput=()=>{ r.dataset.arrasta=1; document.getElementById('mus-t').textContent=mmss(r.value/1000*P.dur); };
  r.onchange=()=>{ delete r.dataset.arrasta; const t=r.value/1000*P.dur; if(P.tocando) tocarFaixa(P.i,t); else { P.off=t; if(P.audio&&MUSICAS[P.i].src) P.audio.currentTime=t; } };
  cicloMus();
}

/* ---------- Arranque ---------- */
const h0=(location.hash||'').slice(1); if(TABS.includes(h0)) tab=h0;
window.addEventListener('hashchange',()=>{ const h=location.hash.slice(1); if(TABS.includes(h)&&h!==tab){ tab=h; fecharOv(); render(); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!ov.hidden){ fecharOv(); render(); } if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.cena .pers')){ e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
render();

}
