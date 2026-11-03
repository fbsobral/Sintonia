import { timingSafeEqual } from "node:crypto";

/** Comparação em tempo constante (evita vazar o segredo por diferença de tempo). */
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  if (x.length !== y.length) { timingSafeEqual(x, x); return false; }
  return timingSafeEqual(x, y);
}

/** Token do cabeçalho "Authorization: Bearer ..." */
export const bearer = (req: Request) => (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
