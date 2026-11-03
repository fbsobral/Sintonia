import { db } from "./db";

/**
 * Janela fixa por chave, atômica no Postgres (funciona com várias instâncias).
 * Retorna ok=false quando o limite da janela foi excedido.
 */
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const rows = await db.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, NOW() + make_interval(secs => ${windowSec}))
    ON CONFLICT ("key") DO UPDATE SET
      "count"   = CASE WHEN "RateLimit"."resetAt" < NOW() THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" < NOW() THEN NOW() + make_interval(secs => ${windowSec}) ELSE "RateLimit"."resetAt" END
    RETURNING "count", "resetAt"`;
  const { count, resetAt } = rows[0];
  return { ok: count <= limit, count, retryAfterSec: Math.max(0, Math.ceil((resetAt.getTime() - Date.now()) / 1000)) };
}

/** Limpeza periódica (chamada pelo cron). */
export const purgeRateLimits = () => db.rateLimit.deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 86_400_000) } } });
