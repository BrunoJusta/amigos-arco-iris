// Conteúdo da app: vive no R2 (conteudo/conteudo.json). Se ainda não existir, usa o conteúdo inicial do repositório.
import seed from '@/seed/conteudo.json';
import { r2Ativo, lerJSON, gravarJSON } from './r2';

export const SECCOES = ['personagens', 'livros', 'factos', 'cores', 'frases', 'adivinhas', 'situacoes', 'musicas', 'cenarios', 'balde', 'objetos', 'desenhos', 'reset'];
const CHAVE = 'conteudo/conteudo.json';

export async function lerConteudo() {
  if (!r2Ativo()) return seed;
  try {
    const c = await lerJSON(CHAVE);
    return c ? { ...seed, ...c } : seed;
  } catch (e) {
    console.error('Falhou a leitura do conteúdo no R2; a usar o conteúdo inicial.', e);
    return seed;
  }
}

export async function gravarSeccao(seccao, valor, email) {
  if (!SECCOES.includes(seccao)) throw new Error('Secção desconhecida: ' + seccao);
  const atual = await lerConteudo();
  // Cópia de segurança da secção antes de a substituir
  await gravarJSON(`conteudo/historico/${Date.now()}-${seccao}.json`, { seccao, por: email || '', valor: atual[seccao] });
  const novo = { ...atual, [seccao]: valor, versao: (atual.versao || 1) + 1, atualizado: new Date().toISOString() };
  await gravarJSON(CHAVE, novo);
  return novo;
}
