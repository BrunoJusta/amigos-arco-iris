// Cenários das histórias. Cada cenário é desenhado em SVG; se o backoffice tiver uma imagem para ele, a imagem substitui o desenho.
export function criarCena({ IMG = {}, NOME = {}, BALDE = '', cenarios = [], baldeImg = '', objetos = {} }) {
const IMGC = {};
(cenarios || []).forEach((c) => { if (c && c.id && c.img) IMGC[c.id] = c.img; });
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
  if(IMGC[key]){
    s+='<rect width="400" height="250" fill="#DCE6EE"/><image href="'+IMGC[key]+'" x="0" y="0" width="400" height="250" preserveAspectRatio="xMidYMid slice"/>';
  } else if(c.dentro==='quarto'){
    s+='<rect width="400" height="250" fill="'+(o.noite?'#E9D3E4':'#FCE6EE')+'"/><g fill="#F8D3E0" opacity=".7">'+[40,120,200,280,360].map(x=>'<circle cx="'+x+'" cy="24" r="5"/><circle cx="'+(x+40)+'" cy="64" r="5"/><circle cx="'+x+'" cy="104" r="5"/>').join('')+'</g><rect y="198" width="400" height="52" fill="#E9CBAA"/>';
    s+='<rect x="258" y="30" width="118" height="110" rx="14" fill="#fff"/><rect x="266" y="38" width="102" height="94" rx="8" fill="'+(o.noite?'#33407A':'#BFE3FF')+'"/>'+(o.noite?'<circle cx="345" cy="62" r="10" fill="#FFF3C4"/>':'<circle cx="345" cy="62" r="11" fill="#FFE07A"/>');
    s+='<path d="M317 38v94M266 85h102" stroke="#fff" stroke-width="6"/><rect x="252" y="136" width="130" height="10" rx="5" fill="#fff"/>';
    s+='<rect x="16" y="146" width="156" height="58" rx="18" fill="#F4A9C6"/><rect x="16" y="128" width="48" height="32" rx="12" fill="#fff"/><rect x="22" y="200" width="10" height="16" rx="3" fill="#C69A74"/><rect x="156" y="200" width="10" height="16" rx="3" fill="#C69A74"/>';
    s+='<g transform="translate(205 70)"><circle r="24" fill="#fff" stroke="#9A78E8" stroke-width="5"/><path d="M0 0V-13M0 0h10" stroke="#1E2A56" stroke-width="3.5" stroke-linecap="round"/>'+''+'</g>';
  } else if(c.dentro==='sala'){
    s+='<rect width="400" height="250" fill="#5C5480"/><rect y="200" width="400" height="50" fill="#463F66"/><circle cx="330" cy="70" r="38" fill="#A8B8D8"/><path d="M330 32v76M292 70h76" stroke="#5C5480" stroke-width="5"/>';
    [[30,60],[30,120]].forEach(([x,y])=>{ s+='<rect x="'+x+'" y="'+(y+28)+'" width="220" height="6" rx="3" fill="#8B7355"/>'; ['#EE6FA0','#F7BC2F','#2FB383','#3E92E0','#9A78E8','#F28C28','#E5484D'].forEach((cor,i)=>{ s+='<rect x="'+(x+8+i*30)+'" y="'+(y+6+(i%2)*4)+'" width="16" height="'+(22-(i%2)*4)+'" rx="5" fill="'+cor+'" opacity=".9"/><rect x="'+(x+12+i*30)+'" y="'+(y+2+(i%2)*4)+'" width="8" height="6" rx="2" fill="#C9B79C"/>'; }); });
  } else {
    s+='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.ceu[0]+'"/><stop offset="1" stop-color="'+c.ceu[1]+'"/></linearGradient></defs><rect width="400" height="250" fill="url(#'+id+')"/>';
    if(c.estrelas) s+='<g fill="#fff">'+[[40,30],[90,60],[150,25],[220,50],[300,30],[360,70],[260,90],[120,100]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="1.6" opacity=".8"/>').join('')+'</g><circle cx="330" cy="44" r="16" fill="#F4F1D8"/><circle cx="337" cy="40" r="14" fill="#1E2850"/>';
    if(c.sol) s+='<circle cx="342" cy="46" r="34" fill="#FFE9A0" opacity=".6"/><circle cx="342" cy="46" r="24" fill="#FFD86B"/>';
    if(c.nuvens) s+='<g fill="'+c.nuvens+'"><ellipse cx="78" cy="50" rx="40" ry="15"/><ellipse cx="104" cy="40" rx="26" ry="16"/><ellipse cx="236" cy="32" rx="32" ry="11"/><ellipse cx="256" cy="26" rx="18" ry="10"/></g>';
    if(c.nuvensGrandes) s+='<g fill="#fff">'+[[70,170,60],[190,200,70],[320,165,62],[110,70,40],[300,60,46]].map(([x,y,r])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*.42)+'"/><ellipse cx="'+(x-r*.35)+'" cy="'+(y-r*.25)+'" rx="'+(r*.45)+'" ry="'+(r*.38)+'"/><ellipse cx="'+(x+r*.3)+'" cy="'+(y-r*.3)+'" rx="'+(r*.5)+'" ry="'+(r*.45)+'"/>').join('')+'</g>';
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
    if(c.fonte) s+='<g transform="translate(300 150)"><ellipse cx="0" cy="44" rx="70" ry="16" fill="#9EA3B4"/><rect x="-60" y="22" width="120" height="22" fill="#B4B9C8"/><ellipse cx="0" cy="22" rx="60" ry="12" fill="'+(o.acesa?'#8FD7FF':'#8C99A6')+'"/><rect x="-8" y="-24" width="16" height="44" rx="4" fill="#B4B9C8"/><ellipse cx="0" cy="-24" rx="26" ry="7" fill="#B4B9C8"/>'+''+'</g>';
    if(c.margaridas) s+=[30,70,110,150,190,230,270,310,350,385].map((x,i)=>'<g transform="translate('+x+' '+(198+(i%3)*8)+')"><path d="M0 0v-12" stroke="#7D8C6E" stroke-width="2.5"/><circle cy="-14" r="5" fill="#E9E7DE"/><circle cy="-14" r="2.2" fill="#D9C27A"/></g>').join('');
    if(c.flores==='feliz') s+=[40,100,150,230,280,350].map((x,i)=>'<g transform="translate('+x+' '+(204+(i%2)*10)+')"><path d="M0 0v-16" stroke="#3E8E3E" stroke-width="3"/><g fill="'+['#EE6FA0','#F7BC2F','#9A78E8','#E5484D','#3E92E0','#F28C28'][i]+'"><circle cx="0" cy="-24" r="5"/><circle cx="6" cy="-18" r="5"/><circle cx="-6" cy="-18" r="5"/><circle cx="0" cy="-13" r="5"/></g><circle cy="-19" r="3.5" fill="#FFF3C4"/></g>').join('');
    else if(c.flores) s+=[64,150,232,330].map(x=>'<g transform="translate('+x+' 204)"><path d="M0 0v-16" stroke="#7D8C6E" stroke-width="3" stroke-linecap="round"/><path d="M0 -16q9 6 6 13" fill="none" stroke="#B9A6B8" stroke-width="6" stroke-linecap="round"/></g>').join('');
  }
  /* objetos por cima do cenário */
  /* objetos por cima do cenário: desenho da app ou imagem do backoffice, com posição, tamanho e efeito configuráveis */
  if(IMGC[key]&&o.noite) s+='<rect width="400" height="250" fill="#1E2850" opacity=".32"/>';
  if(o.arco) s+=objeto('arco',200,182,'<g fill="none" stroke-width="7" opacity=".85">'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#4B4BB5','#9A5BD6'].map((cr,i)=>'<path d="M'+(20+i*7)+' 180 A'+(180-i*7)+' '+(150-i*7)+' 0 0 1 '+(380-i*7)+' 180" stroke="'+cr+'"/>').join('')+'</g>');
  if(o.escada) s+=objeto('escada',197,208,'<g fill="none" stroke-width="6" stroke-linecap="round">'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#9A5BD6'].map((cr,i)=>'<path d="M'+(120+i*6)+' 205 Q'+(150+i*4)+' '+(120-i*3)+' '+(274-i*2)+' '+(158+i*5)+'" stroke="'+cr+'"/>').join('')+'</g>');
  if(o.acesa) s+=objeto('acesa',IMGC[key]?203:300,IMGC[key]?172:200,'<g transform="translate(300 150)">'+'<circle cx="0" cy="-10" r="60" fill="#FFE08A" opacity=".35"/><g fill="#FFF3B0">'+[[-30,-40],[25,-50],[40,-10],[-45,0],[0,-62]].map(([x,y])=>'<path d="M'+x+' '+(y-7)+'l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>').join('')+'</g><path d="M0 -30q-20 -30 -40 6M0 -30q20 -30 40 6" stroke="#BDE9FF" stroke-width="4" fill="none"/>'+'</g>',300,200);
  if(o.mapa) s+=objeto('mapa',315,118,'<g transform="translate(250 30)"><rect width="130" height="88" rx="10" fill="#BFEFFF" opacity=".55" stroke="#7FD6F7" stroke-width="2"/><path d="M14 60q30-40 60-10t45-30" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5"/>'+[[24,58],[62,30],[110,22],[88,66]].map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="#FFD86B" opacity=".6"/><circle cx="'+x+'" cy="'+y+'" r="4" fill="#F7BC2F"/>'+(i===3?'<path d="M'+(x+8)+' '+y+'h12m-4-4 4 4-4 4" stroke="#F7BC2F" stroke-width="2" fill="none"/>':'')).join('')+'</g>');
  if(o.luz){ const lx=c.dentro||key==='caverna'?282:330, ly=(key==='caverna'?168:120)+34;
    s+=objeto('luz',lx,ly,'<g transform="translate('+(c.dentro||key==='caverna'?282:330)+' '+(key==='caverna'?168:120)+')"><circle r="34" fill="#FFE08A" opacity=".3"/><circle r="20" fill="#FFE9A0" opacity=".7"/><circle r="11" fill="#FFF8DC"/></g>'); }
  if(o.lanterna) s+=objeto('lanterna',282,190,'<g transform="translate(282 160)"><circle r="30" fill="#FFF3C4" opacity=".35"/><rect x="-8" y="-12" width="16" height="22" rx="4" fill="#DDE2EA" stroke="#9AA3B5" stroke-width="2"/><rect x="-5" y="-8" width="10" height="13" rx="2" fill="#FFE9A0"/><path d="M-5 -12q5-8 10 0" fill="none" stroke="#9AA3B5" stroke-width="2"/></g>');
  if(o.relogio) s+=objeto('relogio',205,127,'<g transform="translate(205 70)">'+'<g transform="translate(0 46)"><rect x="-34" y="-13" width="68" height="24" rx="12" fill="#9A78E8"/><text y="4" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="800" fill="#fff">parado!</text></g>'+'</g>');
  if(o.passaro) s+=objeto('passaro',306,81,'<path d="M290 80q8-9 16 0q8-9 16 0" fill="none" stroke="#4A4A6A" stroke-width="3.5" stroke-linecap="round"/>');
  if(o.desenho) s+=objeto('desenho',58,163,'<g transform="translate(36 132) rotate(-9)"><rect width="40" height="30" rx="3" fill="#fff" stroke="#E2C6D2" stroke-width="2"/><circle cx="14" cy="13" r="6" fill="#F7BC2F"/><path d="M24 20h10" stroke="#EE6FA0" stroke-width="3" stroke-linecap="round"/></g>');
  if(o.caneca) s+=objeto('caneca',334,114,'<g transform="translate(330 112)"><rect x="-12" y="-22" width="24" height="24" rx="4" fill="#fff" stroke="#9A78E8" stroke-width="2.5"/><path d="M12 -16q9 0 9 7t-9 7" fill="none" stroke="#9A78E8" stroke-width="2.5"/><path d="M-7 -6q3-7 7-3l3-4 2 5q3 0 3 3h-14z" fill="#2FB383"/><path d="M-4 -30q-3-5 0-9M3 -30q-3-5 0-9" stroke="#C9D2E6" stroke-width="2" fill="none" stroke-linecap="round"/></g>');
  if(o.mota) s+=objeto('mota',330,218,'<g transform="translate(330 196)"><circle cx="-26" cy="10" r="12" fill="#22263D"/><circle cx="26" cy="10" r="12" fill="#22263D"/><circle cx="-26" cy="10" r="4" fill="#C9CCDA"/><circle cx="26" cy="10" r="4" fill="#C9CCDA"/><path d="M-30 4q6-18 26-18h18l12 14z" fill="#E5484D"/><rect x="-14" y="-18" width="22" height="7" rx="3" fill="#2B2B33"/><path d="M22 -12l8-10" stroke="#55628E" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="-4" r="4" fill="#FFE07A"/></g>');
  if(o.borboletas){ const cs=[['#7FB3E8','#B79CEB'],['#F48FB8','#F7BC2F'],['#9FE0C0','#7FB3E8'],['#F7BC2F','#F28C28']];
    for(let i=0;i<o.borboletas;i++){ const x=40+((i*73)%330), y=30+((i*41)%110), k=.9+(i%3)*.2;
      s+=varios('borboletas',x,y,k,BORB(0,0,1,cs[i%4][0],cs[i%4][1],(i%5)*12-24),i); } }
  if(o.escamas) [[60,40],[120,90],[200,30],[260,110],[330,60],[160,150],[90,130],[300,150]].forEach(([x,y],i)=>{
    s+=varios('escamas',x,y,1,'<path transform="rotate('+(i*37)+')" d="M0 -8q7 4 0 14q-7-10 0-14z" fill="#F7B6D2" stroke="#fff" stroke-width="1.5"/>',i); });
  // Objetos das histórias novas: desenhados à volta do ponto (0,0), que é o centro da base (onde assentam).
  for(const k in NOVOS_OBJ){
    if(!o[k]) continue;
    const n=NOVOS_OBJ[k];
    if(k==='pirilampos'){ const q=Math.max(1,+o[k]||8); for(let i=0;i<q;i++){ const x=30+((i*67)%340), y=40+((i*53)%130); s+=varios('pirilampos',x,y,.8+(i%3)*.25,n.svg,i); } }
    else s+=objeto(k,n.x,n.y,n.svg,0,0);
  }
  if(o.balde) s+=objeto('balde',quem.length?330:200,226,'<g transform="translate(-37 -60) scale(.62)">'+BALDE.replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</g>',0,0);

  function vazio(a){ return a===undefined||a===null||a===''; }
  function cfgObj(k){
    const b=OBJ[k]||{w:60,efeito:'nenhum'}, g=(objetos&&objetos[k])||{};
    // posição própria deste cenário (se existir) tem prioridade sobre a posição geral
    const p=(g.pos&&g.pos[key])||{}, u={...g, x:vazio(p.x)?g.x:p.x, y:vazio(p.y)?g.y:p.y, w:vazio(p.w)?g.w:p.w};
    return { img: vazio(u.img)?(k==='balde'?baldeImg:''):u.img, x:vazio(u.x)?null:+u.x, y:vazio(u.y)?null:+u.y,
      w: vazio(u.w)?b.w:+u.w, efeito: vazio(u.efeito)?b.efeito:u.efeito, sombra: vazio(u.sombra)?!!b.sombra:!!u.sombra };
  }
  // ax0/ay0: sítio onde o desenho original assenta neste cenário; ox/oy: esse ponto dentro do próprio desenho
  function objeto(k,ax0,ay0,desenho,ox,oy){
    const b=OBJ[k], u=cfgObj(k), w=u.w;
    const x=u.x===null?ax0:u.x, y=u.y===null?ay0:u.y;
    if(ox===undefined){ ox=ax0; oy=ay0; }
    const corpo=u.img
      ? '<image href="'+u.img+'" x="'+(-w/2)+'" y="'+(-w)+'" width="'+w+'" height="'+w+'" preserveAspectRatio="xMidYMax meet"/>'
      : '<g transform="scale('+(w/b.w)+') translate('+(-ox)+' '+(-oy)+')">'+desenho+'</g>';
    return montar(k,x,y,w,u.efeito,u.sombra,corpo,0);
  }
  function varios(k,x,y,esc,desenho,i){
    const b=OBJ[k], u=cfgObj(k), w=u.w*esc;
    const corpo=u.img
      ? '<image href="'+u.img+'" x="'+(-w/2)+'" y="'+(-w/2)+'" width="'+w+'" height="'+w+'" preserveAspectRatio="xMidYMid meet"/>'
      : '<g transform="scale('+(u.w/b.w)+')">'+desenho+'</g>';
    return montar(k,x,y,w,u.efeito,false,corpo,(i%5)*.45);
  }
  function montar(k,x,y,w,ef,sombra,corpo,atraso){
    const f=id+k+(++cid);
    const luminoso = k==='luz' || k==='lanterna' || k==='faisca' || k==='cogumelos';
    let r='<g class="obj'+(luminoso?' obj-luminoso':'')+'" data-obj="'+k+'" transform="translate('+x+' '+y+')">';
    // Luz e lanterna: aura de luz extra por trás (o brilho e a pulsação vêm do CSS)
    if(luminoso) r+='<defs><radialGradient id="'+f+'a"><stop offset="0" stop-color="#FFF4B8" stop-opacity=".95"/><stop offset=".4" stop-color="#FFE07A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD24A" stop-opacity="0"/></radialGradient></defs>'+
      '<circle class="ef-aura" cx="0" cy="'+(-w*.5)+'" r="'+(w*1.05)+'" fill="url(#'+f+'a)"/>';
    if(sombra) r+='<ellipse cx="0" cy="2" rx="'+(w*.38)+'" ry="5" fill="#000" opacity=".14"/>';
    if(ef==='brilho'){
      const e=(ex,ey,er,d)=>'<path class="ef-estrela" style="animation-delay:'+d+'s" transform="translate('+(ex*w).toFixed(1)+' '+(ey*w).toFixed(1)+')" d="M0 -'+er+'Q0 0 '+er+' 0Q0 0 0 '+er+'Q0 0 -'+er+' 0Q0 0 0 -'+er+'Z" fill="#FFF6C8"/>';
      r+='<defs><radialGradient id="'+f+'h"><stop offset="0" stop-color="#FFE68A" stop-opacity=".9"/><stop offset=".45" stop-color="#FFD24A" stop-opacity=".45"/><stop offset="1" stop-color="#FFD24A" stop-opacity="0"/></radialGradient>'+
        '<filter id="'+f+'f" x="-60%" y="-60%" width="220%" height="220%"><feFlood flood-color="#FFD54A" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in" result="s"/><feGaussianBlur in="s" stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
        '<ellipse class="ef-halo" cx="0" cy="'+(-w*.43)+'" rx="'+(w*.86)+'" ry="'+(w*.76)+'" fill="url(#'+f+'h)"/>'+
        '<g filter="url(#'+f+'f)">'+corpo+'</g>'+e(-.54,-.78,7,0)+e(.51,-.95,5,.8)+e(.4,-.24,4,1.5);
    } else {
      r+='<g class="ef ef-'+(ef||'nenhum')+'"'+(atraso?' style="animation-delay:'+atraso+'s"':'')+'>'+corpo+'</g>';
    }
    return r+'</g>';
  }

  const temObj=o.balde||o.luz||o.mota||o.lanterna||o.mapa||o.caneca||o.faisca||o.cogumelos||o.escadagelo||o.livro||o.bola||o.piquenique||o.bolo||o.caldeirao||o.gelado||o.cabana||o.cogumelocasa||(c.dentro==='quarto')||c.castelo||c.torre||c.caverna||c.fonte||c.arvoreGrande;
  const n=quem.length, tam = n<=1?120:n==2?106:n==3?88:n==4?74:62, larg = temObj?(c.dentro==='quarto'&&!o.balde?380:250):380, x0 = 10+(larg-n*tam-(n-1)*8)/2;
  quem.forEach((k,i)=>{
    const x=x0+i*(tam+8), y=224-tam, cl=id+'c'+i, cx=x+tam/2, cy=y+tam/2;
    s+='<g class="pers entra-p" data-k="'+k+'" style="animation-delay:'+(150+i*90)+'ms" role="button" tabindex="0" aria-label="'+(NOME[k]||k)+'"><clipPath id="'+cl+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+(tam/2)+'"/></clipPath>'+
      '<ellipse cx="'+cx+'" cy="'+(y+tam+4)+'" rx="'+(tam*.38)+'" ry="6" fill="#000" opacity=".12"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(tam/2+5)+'" fill="#fff"/>'+
      '<image href="'+IMG[k]+'" x="'+x+'" y="'+y+'" width="'+tam+'" height="'+tam+'" clip-path="url(#'+cl+')" preserveAspectRatio="xMidYMid slice"/></g>';
  });
  return '<svg viewBox="0 0 400 250" role="img" aria-label="'+(quem.map(k=>NOME[k]).join(', ')||'Cenário')+'">'+s+'</svg>';
}

return cena;
}

export const CENARIOS_BASE = ['quarto','rua','portao','triste','rio','pedra','campo','estrada','floresta','mata','castelo','caverna','colina','bosque','torre','sala','fonte','feliz','ceu'];

export const BALDE_SVG = '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M30 34 Q60 -4 90 34" fill="none" stroke="#B57A00" stroke-width="6" stroke-linecap="round"/><path d="M22 34h76l-9 56H31z" fill="#F7BC2F" stroke="#B57A00" stroke-width="4" stroke-linejoin="round"/><rect x="17" y="28" width="86" height="12" rx="6" fill="#FFD86B" stroke="#B57A00" stroke-width="4"/><circle cx="42" cy="58" r="3" fill="#fff"/><circle cx="62" cy="68" r="2.5" fill="#fff"/><circle cx="78" cy="55" r="3" fill="#fff"/></svg>';

// Desenhos usados nas respostas das perguntas
export const DESENHOS={
  balde:BALDE_SVG,
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

// Objetos que podem aparecer por cima dos cenários.
// No backoffice: x = centro, y = linha onde assenta, w = largura (espaço 400 × 250). Sem x/y, cada objeto fica no sítio do desenho original.
export const OBJETOS_BASE = [
  { id: 'balde', nome: 'Balde mágico', w: 74, efeito: 'brilho', sombra: 1, cena: 'quarto', quem: ['francisca'] },
  { id: 'mapa', nome: 'Mapa de luz', w: 130, efeito: 'flutuar', cena: 'floresta', quem: ['francisca'] },
  { id: 'luz', nome: 'Luz dourada', w: 68, efeito: 'pulsar', cena: 'rio', quem: ['francisca'] },
  { id: 'lanterna', nome: 'Lanterna', w: 60, efeito: 'pulsar', cena: 'bosque', quem: ['francisca'] },
  { id: 'escada', nome: 'Escada de arco-íris', w: 160, efeito: 'nenhum', cena: 'feliz', quem: [] },
  { id: 'arco', nome: 'Arco-íris', w: 360, efeito: 'nenhum', cena: 'feliz', quem: ['francisca'] },
  { id: 'acesa', nome: 'Brilho da fonte', w: 120, efeito: 'pulsar', cena: 'fonte', quem: ['francisca'] },
  { id: 'mota', nome: 'Mota', w: 80, efeito: 'nenhum', sombra: 1, cena: 'estrada', quem: ['rugido'] },
  { id: 'caneca', nome: 'Caneca', w: 36, efeito: 'nenhum', cena: 'quarto', quem: ['francisca'] },
  { id: 'relogio', nome: 'Relógio parado', w: 68, efeito: 'baloicar', cena: 'quarto', quem: ['francisca'] },
  { id: 'passaro', nome: 'Passarinho', w: 32, efeito: 'flutuar', cena: 'quarto', quem: ['francisca'] },
  { id: 'desenho', nome: 'Desenho', w: 46, efeito: 'nenhum', cena: 'quarto', quem: ['francisca'] },
  { id: 'borboletas', nome: 'Borboletas', w: 24, efeito: 'flutuar', varios: 1, cena: 'campo', quem: ['borbolessauro'], n: 8 },
  { id: 'escamas', nome: 'Escamas', w: 16, efeito: 'cintilar', varios: 1, cena: 'ceu', quem: ['dragao'] },
  { id: 'faisca', nome: 'Faísca da Bia', w: 40, efeito: 'pulsar', cena: 'caverna', quem: ['tobias'] },
  { id: 'cogumelos', nome: 'Cogumelos que brilham', w: 80, efeito: 'pulsar', cena: 'caverna', quem: ['tobias'] },
  { id: 'pirilampos', nome: 'Pirilampos', w: 18, efeito: 'cintilar', varios: 1, cena: 'mata', quem: ['lu'], n: 10 },
  { id: 'escadagelo', nome: 'Escada de gelo', w: 160, efeito: 'nenhum', cena: 'colina', quem: ['gelino'] },
  { id: 'livro', nome: 'Livro', w: 50, efeito: 'nenhum', sombra: 1, cena: 'floresta', quem: ['foxius'] },
  { id: 'bola', nome: 'Bola do padrinho', w: 34, efeito: 'nenhum', sombra: 1, cena: 'campo', quem: ['bruno'] },
  { id: 'piquenique', nome: 'Piquenique', w: 120, efeito: 'nenhum', cena: 'feliz', quem: ['bruno', 'francisca'] },
  { id: 'bolo', nome: 'Bolo de anos', w: 60, efeito: 'nenhum', sombra: 1, cena: 'caverna', quem: ['ketchup', 'mustarda'] },
  { id: 'bandeirinhas', nome: 'Bandeirinhas de festa', w: 400, efeito: 'nenhum', cena: 'castelo', quem: ['lila'] },
  { id: 'caldeirao', nome: 'Caldeirão', w: 64, efeito: 'nenhum', sombra: 1, cena: 'sala', quem: ['maria'] },
  { id: 'magia', nome: 'Pó mágico', w: 160, efeito: 'cintilar', cena: 'castelo', quem: ['maria'] },
  { id: 'gelado', nome: 'Gelado de banana', w: 24, efeito: 'nenhum', cena: 'feliz', quem: ['gelino'] },
  { id: 'trovoada', nome: 'Trovoada', w: 400, efeito: 'nenhum', cena: 'quarto', quem: ['maia'] },
  { id: 'cabana', nome: 'Cabana de cobertor', w: 144, efeito: 'nenhum', cena: 'quarto', quem: ['francisca', 'maia'] },
  { id: 'cogumelocasa', nome: 'Casinha-cogumelo', w: 72, efeito: 'nenhum', sombra: 1, cena: 'castelo', quem: ['lila'] },
  { id: 'pocas', nome: 'Poças de água', w: 360, efeito: 'nenhum', cena: 'feliz', quem: ['maia'] },
];
const OBJ = Object.fromEntries(OBJETOS_BASE.map((o) => [o.id, o]));
export const EFEITOS = [['nenhum', 'Nenhum'], ['brilho', 'Brilho dourado'], ['flutuar', 'Flutuar'], ['pulsar', 'Pulsar'], ['baloicar', 'Baloiçar'], ['cintilar', 'Cintilar']];

// Desenhos que só aparecem como respostas nas perguntas dos livros (podem ser trocados por imagens no backoffice).
export const DESENHOS_PERGUNTAS = [
  ['bola', 'Bola'], ['flor', 'Flor'], ['aquario', 'Aquário'], ['capacete', 'Capacete'], ['coroa', 'Coroa'],
  ['sandes', 'Sandes'], ['estrela', 'Estrela'], ['lua', 'Lua'], ['gelo', 'Floco de gelo'],
];
// Desenhos das perguntas que correspondem a um objeto dos cenários (usam a imagem desse objeto).
export const DESENHO_OBJETO = { balde: 'balde', mota: 'mota', mapa: 'mapa', lanterna: 'lanterna', borboleta: 'borboletas', escama: 'escamas', arcoiris: 'arco' };

// Desenhos dos objetos das histórias novas (largura de referência = w em OBJETOS_BASE; base em y=0, centro em x=0).
const NOVOS_OBJ = {
  cogumelocasa:{x:335,y:226,svg:'<rect x="-14" y="-34" width="28" height="34" rx="6" fill="#F4EBD8" stroke="#D9C9A8" stroke-width="1.5"/><path d="M-5 0V-14Q0 -20 5 -14V0Z" fill="#B7834F" stroke="#8E6136" stroke-width="1"/><circle cx="3" cy="-7" r="1" fill="#F7BC2F"/><circle cx="-8" cy="-24" r="3" fill="#BFE3FF" stroke="#D9C9A8" stroke-width="1"/><path d="M-36 -32Q-34 -66 0 -68Q34 -66 36 -32Q0 -26 -36 -32Z" fill="#E5484D" stroke="#B83236" stroke-width="1.5"/><circle cx="-18" cy="-46" r="5" fill="#fff"/><circle cx="4" cy="-58" r="4" fill="#fff"/><circle cx="20" cy="-42" r="5" fill="#fff"/><circle cx="-4" cy="-40" r="3" fill="#fff"/>'},
  faisca:{x:330,y:150,svg:'<circle cx="0" cy="-20" r="20" fill="#FFE68A" opacity=".45"/><path d="M0 -40Q3 -23 20 -20Q3 -17 0 0Q-3 -17 -20 -20Q-3 -23 0 -40Z" fill="#FFD54A" stroke="#E0A800" stroke-width="1.5"/><circle cx="0" cy="-20" r="4" fill="#FFF8DC"/>'},
  cogumelos:{x:320,y:226,svg:'<ellipse cx="0" cy="-14" rx="40" ry="18" fill="#B7FFD9" opacity=".35"/>'+[[-22,0,.8],[2,0,1.1],[24,0,.7]].map(([x,y,k])=>'<g transform="translate('+x+' '+y+') scale('+k+')"><rect x="-4" y="-22" width="8" height="22" rx="4" fill="#F4EBD8"/><path d="M-16 -20Q0 -44 16 -20Z" fill="#59D3A8" stroke="#2FA37E" stroke-width="1.5"/><circle cx="-6" cy="-27" r="2.5" fill="#E8FFF5"/><circle cx="5" cy="-30" r="2" fill="#E8FFF5"/></g>').join('')},
  pirilampos:{svg:'<circle r="11" fill="#F6FF8A" opacity=".35"/><circle r="5.5" fill="#E2EE4A" stroke="#C8D23A" stroke-width="1"/><circle r="2.6" fill="#FFFFF0"/>'},
  escadagelo:{x:300,y:226,svg:[0,1,2,3,4,5].map(i=>'<rect x="'+(-80+i*26)+'" y="'+(-18-i*18)+'" width="30" height="'+(18+i*18)+'" rx="4" fill="'+(i%2?'#CFEAFF':'#B4DDFB')+'" stroke="#8CC4EE" stroke-width="2"/>').join('')+'<path d="M-74 -12h18M-48 -30h18M-22 -48h18M4 -66h18M30 -84h18M56 -102h18" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>'},
  livro:{x:330,y:226,svg:'<path d="M-25 0V-26L0 -22L25 -26V0L0 -4Z" fill="#2F7D5B"/><path d="M-22 -3V-28Q-10 -30 0 -24V-6Q-10 -10 -22 -3Z" fill="#FFF8E7" stroke="#D9CBB0" stroke-width="1"/><path d="M22 -3V-28Q10 -30 0 -24V-6Q10 -10 22 -3Z" fill="#FFF8E7" stroke="#D9CBB0" stroke-width="1"/><path d="M-17 -20h11M-17 -15h11M6 -20h11M6 -15h11" stroke="#C7B9A0" stroke-width="1.5" stroke-linecap="round"/>'},
  bola:{x:330,y:226,svg:'<circle cx="0" cy="-17" r="17" fill="#E5484D" stroke="#B83236" stroke-width="1.5"/>'+[[-7,-24,4],[6,-12,4.5],[8,-27,3],[-9,-10,3],[0,-18,2.5]].map(([x,y,r])=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/>').join('')+'<path d="M-10 -29Q-5 -33 1 -32" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/>'},
  piquenique:{x:300,y:234,svg:'<ellipse cx="0" cy="-8" rx="60" ry="14" fill="#F4F1EA"/>'+[-45,-25,-5,15,35].map((x,i)=>'<rect x="'+x+'" y="-20" width="10" height="24" fill="#E5484D" opacity=".75" transform="skewX(-20)"/>').join('')+'<g transform="translate(26 -14)"><rect x="-14" y="-16" width="28" height="18" rx="3" fill="#C99A5B" stroke="#A47A42" stroke-width="1.5"/><path d="M-10 -16Q0 -30 10 -16" fill="none" stroke="#A47A42" stroke-width="2.5"/></g><g transform="translate(-18 -14)"><path d="M-10 0L0 -14L10 0Z" fill="#E9C27A" stroke="#C99A55" stroke-width="1.5"/></g>'},
  bolo:{x:330,y:226,svg:'<rect x="-30" y="-22" width="60" height="22" rx="5" fill="#F7B6D2" stroke="#E58AB3" stroke-width="1.5"/><rect x="-20" y="-40" width="40" height="18" rx="5" fill="#FFE0EE" stroke="#E58AB3" stroke-width="1.5"/><path d="M-30 -18q5 6 10 0t10 0t10 0t10 0t10 0t10 0" fill="none" stroke="#fff" stroke-width="3"/><circle cx="-10" cy="-42" r="3" fill="#E5484D"/><circle cx="10" cy="-42" r="3" fill="#E5484D"/><rect x="-7" y="-56" width="4" height="14" rx="2" fill="#E5484D"/><rect x="3" y="-56" width="4" height="14" rx="2" fill="#F5C518"/><path d="M-5 -58q-3 -5 0 -9q3 4 0 9Z" fill="#FFB020"/><path d="M5 -58q-3 -5 0 -9q3 4 0 9Z" fill="#FFB020"/>'},
  bandeirinhas:{x:200,y:44,svg:'<path d="M-200 -40Q-100 -14 0 -32T200 -38" fill="none" stroke="#9A8F86" stroke-width="1.5"/>'+Array.from({length:16},(_,i)=>{const x=-188+i*25, y=-37+Math.sin(i*.8)*5+(i<8?i*1.6:(15-i)*1.6); return '<path d="M'+(x-9)+' '+y+'L'+(x+9)+' '+y+'L'+x+' '+(y+18)+'Z" fill="'+['#E5484D','#F28C28','#F5C518','#2FB383','#3E92E0','#9A5BD6'][i%6]+'"/>';}).join('')},
  caldeirao:{x:320,y:226,svg:'<ellipse cx="0" cy="-34" rx="30" ry="8" fill="#8BE08A"/><path d="M-32 -34Q-34 0 0 0Q34 0 32 -34Z" fill="#4A3D63" stroke="#2E2540" stroke-width="2"/><ellipse cx="0" cy="-34" rx="32" ry="8" fill="none" stroke="#2E2540" stroke-width="3"/><circle cx="-10" cy="-44" r="5" fill="#B9F5B5"/><circle cx="6" cy="-52" r="4" fill="#B9F5B5"/><circle cx="14" cy="-42" r="3" fill="#B9F5B5"/><path d="M-20 0l-6 6M20 0l6 6" stroke="#2E2540" stroke-width="4" stroke-linecap="round"/>'},
  magia:{x:220,y:170,svg:[[-60,-40,26],[-25,-60,32],[20,-50,30],[55,-30,24],[0,-25,30],[-40,-15,20],[40,-10,18]].map(([x,y,r],i)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+['#F9D6F0','#DCE8FF','#FFF1C2','#D9F7E8'][i%4]+'" opacity=".75"/>').join('')+[[-70,-70],[-10,-90],[50,-75],[70,-20],[-50,-5],[10,-10],[30,-40]].map(([x,y])=>'<path transform="translate('+x+' '+y+')" d="M0 -7Q1 -1 7 0Q1 1 0 7Q-1 1 -7 0Q-1 -1 0 -7Z" fill="#FFD54A"/>').join('')},
  gelado:{x:330,y:226,svg:'<path d="M-12 -30L0 0L12 -30Z" fill="#E2B57A" stroke="#C08B4C" stroke-width="1.5"/><path d="M-8 -22l12 -6M-4 -12l10 -6" stroke="#C08B4C" stroke-width="1"/><circle cx="0" cy="-36" r="12" fill="#FFE58A" stroke="#E5BE3C" stroke-width="1.5"/><circle cx="0" cy="-52" r="10" fill="#FFF0B3" stroke="#E5BE3C" stroke-width="1.5"/><circle cx="-3" cy="-56" r="2.5" fill="#fff" opacity=".8"/>'},
  trovoada:{x:200,y:250,svg:'<rect x="-200" y="-250" width="400" height="250" fill="#2A3352" opacity=".18"/><g fill="#7D8BA8"><ellipse cx="-110" cy="-218" rx="70" ry="26"/><ellipse cx="-60" cy="-226" rx="50" ry="30"/><ellipse cx="80" cy="-220" rx="80" ry="28"/><ellipse cx="140" cy="-226" rx="50" ry="24"/></g><path d="M-70 -200L-88 -160H-72L-92 -118L-50 -170H-66L-50 -200Z" fill="#FFE066" stroke="#F2B705" stroke-width="2"/><g stroke="#A9C6E8" stroke-width="2" stroke-linecap="round" opacity=".8">'+Array.from({length:28},(_,i)=>{const x=-190+((i*53)%380), y=-190+((i*37)%170); return '<path d="M'+x+' '+y+'l-5 14"/>';}).join('')+'</g>'},
  cabana:{x:300,y:226,svg:'<path d="M-72 0L0 -86L72 0Z" fill="#F4A9C6" stroke="#E07FA8" stroke-width="2"/><path d="M-72 0L0 -86L-20 0Z" fill="#BFD9F5" stroke="#8DB6E2" stroke-width="2"/><path d="M-14 0L0 -40L14 0Z" fill="#5A4A6B"/><circle cx="-36" cy="-30" r="4" fill="#fff" opacity=".8"/><circle cx="30" cy="-20" r="4" fill="#fff" opacity=".8"/><circle cx="12" cy="-56" r="4" fill="#fff" opacity=".8"/><path d="M-80 0v-6M80 0v-6" stroke="#C69A74" stroke-width="5" stroke-linecap="round"/>'},
  pocas:{x:200,y:244,svg:[[-130,-6,46],[-20,-14,60],[110,-4,50]].map(([x,y,r])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*.22)+'" fill="#8EC9F0" opacity=".85"/><ellipse cx="'+(x-r*.3)+'" cy="'+(y-2)+'" rx="'+(r*.35)+'" ry="'+(r*.06)+'" fill="#fff" opacity=".7"/>').join('')},
};
