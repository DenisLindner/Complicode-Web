# Complicode Web

Frontend do **Complicode**, o gerador de desafios técnicos que simulam problemas reais da indústria. Feito com Next.js 16 (App Router), React 19, Tailwind CSS 4 e shadcn/ui.

## Páginas

| Rota                   | O que tem                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`                    | Landing: proposta, exemplo de desafio, como funciona, níveis, galeria, preços e perguntas                              |
| `/explorar`            | Galeria de desafios públicos                                                                                           |
| `/d/:id`               | Desafio público, com link compartilhável e cópia em markdown                                                           |
| `/cadastro`, `/entrar` | Cadastro e login (validação nos dois lados, regras de senha ao vivo)                                                   |
| `/boas-vindas`         | Onboarding: boas-vindas, código por email, telefone pelo Telegram (botão, QR code e acompanhamento automático) e bônus |
| `/app`                 | Início: créditos, verificação e desafios recentes                                                                      |
| `/app/gerar`           | Assistente: área, framework e nível, com custo e tela de progresso                                                     |
| `/app/desafios`        | Meus desafios (paginado)                                                                                               |
| `/app/desafios/:id`    | Briefing completo, sumário, versões, checklist de requisitos, markdown, regerar, público/privado e excluir             |
| `/app/creditos`        | Saldo, pacote de 10 créditos (AbacatePay), extrato e pagamentos                                                        |

Atalho `Ctrl/⌘ + K` no app: navegação, gerar desafio por área, tema e sair.

### Rotas de servidor

| Rota                                         | Uso                                                           |
| -------------------------------------------- | ------------------------------------------------------------- |
| `/bff/verificacao`                           | Status da verificação (polling do onboarding)                 |
| `/bff/pagamentos/:id`                        | Status de um pagamento (volta do checkout)                    |
| `/bff/desafios/:id/markdown`                 | Desafio em markdown (`?download=1` baixa o arquivo)           |
| `/webhooks/abacatepay`, `/webhooks/telegram` | Repasse dos webhooks para a API (corpo e assinatura intactos) |
| `/sessao-expirada`                           | Limpa uma sessão que a API recusou e volta ao login           |

As rotas `/bff` só respondem a requisições do próprio site (`Sec-Fetch-Site` e `Origin`). Configure nos provedores os webhooks `https://<app>/webhooks/abacatepay` e `https://<app>/webhooks/telegram`.

## Segurança

O navegador **nunca fala com a API** e **nunca vê um token**. O servidor do Next.js funciona como BFF (_Backend for Frontend_):

```
Navegador ──(cookie httpOnly cifrado)──► Next.js ──(Bearer + X-Internal-Key)──► Complicode API (rede privada)
```

- `API_URL`, `INTERNAL_API_KEY` e `SESSION_SECRET` são variáveis só do servidor (nada usa `NEXT_PUBLIC_`). Elas são validadas no boot (`src/lib/server/env.ts`), e os módulos em `src/lib/server` importam `server-only`, então o build falha se um Client Component tentar usá-los.
- CSP estrita com nonce por requisição (`src/proxy.ts`): só executam scripts com o nonce. Também há `frame-ancestors 'none'`, `object-src 'none'`, `base-uri` e `form-action` restritos.
- Headers fixos em `next.config.ts`: HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e COOP/CORP. Sem `X-Powered-By` e sem source maps no navegador.
- **Sessão:** o access token (30 min) e o refresh token (3 dias) ficam em dois cookies `__Host-` com `HttpOnly`, `Secure` e `SameSite=Lax`, cifrados e autenticados com AES-256-GCM (JWE, `src/lib/server/seal.ts`). Cada cookie é ligado ao seu propósito, então um não pode ser trocado pelo outro, e qualquer alteração invalida a sessão.
- **Renovação:** acontece só no `proxy.ts`, antes da página renderizar, quando faltar menos de 1 minuto para o access token expirar. O Keycloak rotaciona o refresh token e não aceita reuso, então requisições paralelas com o mesmo token compartilham uma única renovação (`src/lib/server/refresh.ts`). Com mais de uma instância, use sessões fixas (sticky sessions).
- **Autorização:** o `proxy.ts` faz só a checagem otimista (redireciona para `/entrar`). Toda página e Server Action chama a camada de dados (`src/lib/server/dal.ts`), que valida a sessão com a API.
- **Formulários:** os mesmos schemas zod validam no navegador e de novo na Server Action. As Server Actions já checam a `Origin` (CSRF), e o `?next=` do login só aceita caminhos internos.
- **Rate limit:** o servidor envia à API o IP real do usuário em `X-Client-IP`, tirado da entrada de `X-Forwarded-For` adicionada pelo proxy confiável (`TRUSTED_PROXY_HOPS`).
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
| `npm run test:e2e`            | Testes end-to-end (Playwright, veja abaixo)            |
| `npm run format`              | Prettier (ordena as classes do Tailwind)               |

### Testes end-to-end

Rodam contra a stack real: suba a API (com `docker compose up -d` no repositório dela) e rode `npx playwright install chromium` uma vez. O Playwright faz o build e sobe o front se ele não estiver no ar.

Cobrem login e cadastro, cookies da sessão (httpOnly, cifrados, invisíveis ao JavaScript), headers e CSP com nonce, redirecionamentos externos bloqueados, rotas `/bff` recusando outros sites, sessão adulterada, renovação do token com requisições paralelas, onboarding com o código lido do Mailpit e layout no celular. A geração de desafios fica de fora, porque gasta cota do Gemini e leva até um minuto.

Cada teste simula um visitante com IP diferente (`X-Forwarded-For`) para não esbarrar no rate limit de login da API. Isso só funciona localmente, sem proxy na frente do Next.js.

## Identidade visual

Fundo off-white quente (`#FAF7F2`) no modo claro e quase preto quente (`#161412`) no escuro, com o caramelo `#EC8F39` como cor de destaque. Como o caramelo tem contraste baixo sobre fundo claro (2,3:1), ele é usado como preenchimento; textos em caramelo usam o token `brand` (`#A95A12` no claro, 4,7:1). Todos os pares de texto têm contraste de pelo menos 4,5:1 (WCAG AA). Os tokens ficam em `src/app/globals.css`.

## Git flow

- `main`: produção
- `develop`: integração
- `feature/*`, `fix/*` e `chore/*`: partem de `develop` e voltam por Pull Request

Os commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
