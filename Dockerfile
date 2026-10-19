# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN apk add --no-cache openssl libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

# 1) CLI do Prisma isolado (camada estática: fica em cache e não é refeita a cada deploy)
FROM base AS migrator
WORKDIR /m
RUN --mount=type=cache,target=/root/.npm \
    npm init -y >/dev/null && npm i prisma@6.19.3 --no-audit --no-fund --prefer-offline

# 2) Dependências (só refaz quando package*.json ou o schema mudam)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline && npx prisma generate

# 3) Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* é embutido no build: configure como "Build Variable" no Coolify
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN --mount=type=cache,target=/app/.next/cache npm run build

# 4) Imagem final enxuta
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=app:app /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=app:app /app/prisma ./prisma
COPY --from=migrator --chown=app:app /m/node_modules /m/node_modules
USER app
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --start-period=3s --retries=12 CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["sh", "-c", "node /m/node_modules/prisma/build/index.js migrate deploy --schema ./prisma/schema.prisma && exec node server.js"]
