# Sintonia

App mobile-first para homens acompanharem o ciclo menstrual da parceira: fase atual, dica diária, e-mail matinal e mapa astral.

**Stack:** Next.js 15 · Tailwind 4 · PostgreSQL (Prisma) · Clerk · Resend · astronomy-engine

## Rodando local

```bash
cp .env.example .env.local   # preencha DATABASE_URL, Clerk e Resend
npx prisma migrate deploy
npm run dev
```

## Regras do ciclo (`src/lib/cycle.ts`)
- Ritmo informado: 28, 31 ou irregular (30 como base).
- Com **3+ menstruações registradas** (mais de 2 ciclos), o comprimento passa a ser a **média** dos intervalos.
- Fases: menstruação (1..P) · folicular · ovulatória (ovulação ± 1) · lútea (~14 dias). Ovulação = comprimento − 14.
- Últimos 4 dias da lútea = alerta de TPM.

## Deploy no Coolify (Hostinger VPS)
1. **PostgreSQL**: New Resource → Database → PostgreSQL. Copie a *Internal URL* para `DATABASE_URL`.
2. **App**: New Resource → Git repo → Build Pack **Dockerfile**, porta **3000**.
3. **Variáveis** (use `.env.example`). `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `NEXT_PUBLIC_APP_URL` devem estar marcadas como *Build Variable*.
4. As migrations rodam sozinhas no start do container (`prisma migrate deploy`).
5. **E-mail diário**: Scheduled Task no app, a cada hora (`0 * * * *`):
   ```
   curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/daily
   ```
   Cada usuário recebe 1 e-mail/dia, a partir da hora escolhida no fuso dele.
6. **Resend**: verifique seu domínio e ajuste `RESEND_FROM`.
7. **Clerk**: adicione o domínio de produção e use as chaves *live*.
