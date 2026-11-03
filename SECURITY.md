# Segurança do Sintonia

O app guarda dados de saúde e de relacionamento (ciclos, check-ins, mapa astral). Este documento resume o que está protegido, o que é risco aceito e o que precisa ser configurado fora do código.

## O que o código faz

**Acesso e autorização**
- Login pelo Clerk. Toda tela e ação (exceto landing, convite e login) exige sessão; ações de servidor revalidam papel e casal a cada chamada.
- Dados do ciclo pertencem a quem menstrua: ela liga/pausa o compartilhamento, remove o acesso do parceiro e apaga os próprios dados. Anotações do check-in nunca são compartilhadas.
- Painel `/admin` devolve 404 para quem não é admin. Só mostra metadados (nunca datas de ciclo, check-ins ou anotações) e registra toda ação em `AdminLog`.
- Admin = flag `isAdmin` no banco. `ADMIN_EMAILS` só promove contas com e-mail **verificado** no Clerk.
- Contas suspensas não acessam nada nem recebem e-mail.

**Convites**
- Token aleatório de 144 bits, validade de 14 dias, uso único. O aceite é atômico (linha do casal travada), então aceites simultâneos não ocupam o mesmo lugar.
- Página do convite sem cache, sem indexação e sem vazar o token no `Referer`.

**Abuso**
- Limite de requisições no Postgres (atômico, vale com várias instâncias) em envio de e-mail, convites, check-in, sinais, registro de ciclo, exclusão de conta e aceite de convite. Há limite extra por destinatário para não usar o app para encher a caixa de alguém.
- Ações públicas de servidor (cálculo de mapa) exigem login.
- `CRON_SECRET` comparado em tempo constante e exigido com 16+ caracteres.

**Navegador**
- CSP com nonce por requisição (`strict-dynamic`), `frame-ancestors 'none'`, `object-src 'none'`, `base-uri` e `form-action` restritos.
- HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP.
- Telas autenticadas com `Cache-Control: no-store`; rotas privadas bloqueadas em `robots.txt`.

**Dados**
- Prisma com consultas parametrizadas (sem SQL concatenado). Entradas validadas com zod e limites de tamanho. Textos de e-mail escapados.
- Exclusão de conta pelo próprio usuário (Perfil) e pelo admin, no Clerk e no banco.
- Segredos fora do git (`.env*` ignorado; histórico verificado). Container roda sem root.
- Na subida, o servidor avisa sobre configuração insegura (chaves de teste em produção, segredo curto etc.).

## Risco aceito (npm audit)

| Pacote | Gravidade | Onde atua | Por que aceito |
|---|---|---|---|
| `postcss` (via `next`) | alta | compilação do CSS | só processa o CSS do próprio projeto; sem entrada de usuário |
| `deepmerge-ts` (via `prisma` CLI) | alta | CLI do Prisma ao ler a config | não roda no caminho de requisições; sem entrada de usuário |

As correções exigem Next 16 e Prisma 7 (versões maiores). Reavaliar na próxima janela de atualização.

## O que configurar fora do código

**Clerk**
- Ative MFA e exija para contas admin. Ative proteção contra bots e limite de cadastros.
- Em produção use as chaves `live` e cadastre só o domínio real.

**Coolify / VPS**
- Banco PostgreSQL **só na rede interna** (sem porta pública) e com backup automático testado.
- Variáveis secretas só no painel do Coolify (`CLERK_SECRET_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `DATABASE_URL`, `ADMIN_EMAILS`). Gere `CRON_SECRET` com `openssl rand -hex 32`.
- HTTPS obrigatório no domínio; firewall liberando apenas 80/443 e SSH por chave.
- Atualize o sistema da VPS e as dependências periodicamente (`npm audit`).

**Resend**
- Verifique o domínio e configure SPF, DKIM e DMARC.

## Reportar uma falha
Escreva para o administrador do Sintonia com os passos para reproduzir. Não inclua dados pessoais reais.
