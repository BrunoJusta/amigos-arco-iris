import { lerConteudo } from '@/lib/conteudo';
import AppCliente from './AppCliente';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const conteudo = await lerConteudo();
  return <AppCliente conteudo={conteudo} />;
}
