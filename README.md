# Amigos do Arco-Íris

App para a Francisca: as histórias da Francisca e dos Amigos do Arco-Íris, jogos, coisas para aprender e músicas. Funciona no telemóvel como app instalada (PWA) e tem um backoffice para gerir todo o conteúdo.

- **App** (`/`): pública, sem login. Histórias narradas, *Aprender*, *Jogos* e *Músicas*.
- **Backoffice** (`/admin`): login com email e password, sem emails de confirmação.
- **Dados**: Cloudflare R2. O conteúdo vive em `conteudo/conteudo.json` e os ficheiros (imagens, músicas) em `media/`.

Enquanto o R2 não estiver configurado, a app usa o conteúdo inicial em `seed/conteudo.json` e as imagens em `public/personagens/`.

## Estrutura

| Pasta | O quê |
| --- | --- |
| `motor/motor.js` | O motor da app: histórias, jogos, aprender e músicas (JavaScript simples, recebe o conteúdo). |
| `app/(publico)/` | Página pública que carrega o conteúdo e arranca o motor. |
| `app/admin/` | Backoffice (login e painel). |
| `app/api/` | Rotas da API: conteúdo, login, uploads, contas, ficheiros do R2. |
| `lib/` | Ligação ao R2, conteúdo e autenticação. |
| `seed/conteudo.json` | Conteúdo inicial: 14 livros, 200 factos, 200 perguntas de cores, frases, situações e músicas. |
| `public/` | Imagens das personagens, ícones, manifest da PWA e service worker. |

## 1. Configurar o Cloudflare R2

1. No painel da Cloudflare, abre **R2** e cria um bucket, por exemplo `amigos-arco-iris`.
2. Em **R2 > Gerir tokens da API**, cria um token com permissão **Object Read & Write**, limitado a este bucket. Guarda o *Access Key ID*, o *Secret Access Key* e o *Account ID*.
3. Em **Definições do bucket > Política CORS**, cola isto (troca o domínio pelo teu da Vercel). É o que permite enviar imagens e músicas diretamente do backoffice:

```json
[
  {
    "AllowedOrigins": ["https://o-teu-projeto.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

4. Opcional, mas recomendado: em **Definições > Acesso público**, ativa o endereço `r2.dev` ou liga um domínio teu. Esse endereço vai para `R2_PUBLIC_URL`. Sem ele, os ficheiros passam pela própria app em `/api/media/...`.

## 2. Publicar na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importa este repositório. A Vercel deteta que é Next.js.
2. Em **Environment Variables**, acrescenta:

| Variável | Valor |
| --- | --- |
| `R2_ACCOUNT_ID` | Account ID da Cloudflare |
| `R2_ACCESS_KEY_ID` | Access Key ID do token |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key do token |
| `R2_BUCKET` | nome do bucket |
| `R2_PUBLIC_URL` | (opcional) endereço público do bucket, sem `/` no fim |
| `AUTH_SECRET` | uma frase longa e aleatória (por exemplo, gerada com `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | o teu email |
| `ADMIN_PASSWORD` | a password do primeiro acesso |

3. Faz **Deploy**.

## 3. Primeiro acesso ao backoffice

1. Abre `/admin` e entra com o `ADMIN_EMAIL` e a `ADMIN_PASSWORD`. A conta fica guardada no R2, com a password cifrada.
2. Em **Contas** podes criar outras contas ou mudar a password. Não há emails de confirmação.
3. Depois de criares a tua conta definitiva, podes apagar `ADMIN_PASSWORD` da Vercel.

Cada vez que carregas em **Guardar**, o backoffice grava uma cópia de segurança da secção anterior em `conteudo/historico/` no R2.

## 4. Instalar no telemóvel da Francisca

- **Android (Chrome)**: abre o site, menu ⋮ > **Instalar app**. Abre em ecrã inteiro.
- **iPhone (Safari)**: botão Partilhar > **Adicionar ao ecrã principal**.
- Para ela não sair da app: no Android, **Definições > Segurança > Fixar aplicação**; no iPhone, **Acessibilidade > Acesso Guiado**.
- Depois da primeira visita, a app funciona sem internet. As músicas que nunca foram tocadas precisam de internet da primeira vez.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preenche as variáveis (sem R2 funciona com o conteúdo inicial)
npm run dev
```

O GitHub Actions compila o projeto a cada envio (`.github/workflows/build.yml`).

## Próximos passos

- Narração com a ElevenLabs: gerar os MP3 de cada página uma vez e guardá-los no R2. O motor já toca ficheiros de áudio nas músicas e pode passar a fazê-lo nas páginas.
- Ilustrações próprias para cada página (o backoffice já aceita imagens).
