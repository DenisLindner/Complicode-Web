# Complicode Web

Frontend do **Complicode**, o gerador de desafios técnicos que simulam problemas reais da indústria. Feito com Next.js 16 (App Router), React 19, Tailwind CSS 4 e shadcn/ui.

## Segurança

O navegador **nunca fala com a API** e **nunca vê um token**. O servidor do Next.js funciona como BFF (_Backend for Frontend_):

```
Navegador ──(cookie httpOnly cifrado)──► Next.js ──(Bearer + X-Internal-Key)──► Complicode API (rede privada)
```

- `API_URL`, `INTERNAL_API_KEY` e `SESSION_SECRET` são variáveis só do servidor (nada usa `NEXT_PUBLIC_`). Elas são validadas no boot (`src/lib/server/env.ts`), e os módulos em `src/lib/server` importam `server-only`, então o build falha se um Client Component tentar usá-los.
- CSP estrita com nonce por requisição (`src/proxy.ts`): só executam scripts com o nonce. Também há `frame-ancestors 'none'`, `object-src 'none'`, `base-uri` e `form-action` restritos.
- Headers fixos em `next.config.ts`: HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e COOP/CORP. Sem `X-Powered-By` e sem source maps no navegador.
- **Sessão:** o access token (30 min) e o refresh token (3 dias) ficam em dois cookies com , e , cifrados e autenticados com AES-256-GCM (JWE, ). Cada cookie é ligado ao seu propósito, então um não pode ser trocado pelo outro, e qualquer alteração invalida a sessão.
- **Renovação:** acontece só no , antes da página renderizar, quando faltar menos de 1 minuto para o access token expirar. O Keycloak rotaciona o refresh token e não aceita reuso, então requisições paralelas com o mesmo token compartilham uma única renovação (). Com mais de uma instância, use sessões fixas (sticky sessions).
- **Autorização:** o faz só a checagem otimista (redireciona para ). Toda página e Server Action chama a camada de dados (), que valida a sessão com a API.
- **Formulários:** os mesmos schemas zod validam no navegador e de novo na Server Action. As Server Actions já checam a (CSRF), e o do login só aceita caminhos internos.
- **Rate limit:** o servidor envia à API o IP real do usuário em , tirado da entrada de adicionada pelo proxy confiável ().
- As páginas são renderizadas por requisição, o que o nonce exige; por isso o `cacheComponents` está desligado.
- Dependabot e CI com `npm audit` das dependências de produção.

## Requisitos

- Node.js 22.12+ (CI e produção usam o Node 24, veja `.nvmrc`)
- A [Complicode API](https://github.com/DenisLindner/Complicode-API) rodando

## Como rodar

```bash
cp .env.example .env.local   # gere INTERNAL_API_KEY e SESSION_SECRET (comando no arquivo)
npm install
npm run dev                  # http://localhost:3001
```

O `INTERNAL_API_KEY` precisa ser o mesmo configurado na API. Na API, `FRONTEND_URL` deve apontar para `http://localhost:3001`.

## Scripts

| Script                        | Descrição                                              |
| ----------------------------- | ------------------------------------------------------ |
| `npm run dev`                 | Servidor de desenvolvimento na porta 3001              |
| `npm run build` / `npm start` | Build e servidor de produção                           |
| `npm run lint`                | Oxlint (com regras de React, Next.js e acessibilidade) |
| `npm run typecheck`           | TypeScript, incluindo os tipos de rotas do Next        |
| `npm test`                    | Testes unitários (Vitest)                              |
| `npm run format`              | Prettier (ordena as classes do Tailwind)               |

## Identidade visual

Fundo off-white quente (`#FAF7F2`) no modo claro e quase preto quente (`#161412`) no escuro, com o caramelo `#EC8F39` como cor de destaque. Como o caramelo tem contraste baixo sobre fundo claro (2,3:1), ele é usado como preenchimento; textos em caramelo usam o token `brand` (`#A95A12` no claro, 4,7:1). Todos os pares de texto têm contraste de pelo menos 4,5:1 (WCAG AA). Os tokens ficam em `src/app/globals.css`.

## Git flow

- `main`: produção
- `develop`: integração
- `feature/*`, `fix/*` e `chore/*`: partem de `develop` e voltam por Pull Request

Os commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
