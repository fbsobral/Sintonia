import { db } from "./db";

export type AcceptResult =
  | { ok: true; redirect: "/hoje" | "/onboarding" }
  | { ok: false; reason: "invalido" | "ja-vinculado" | "ocupado" };

/**
 * Aceita um convite de forma atômica: a linha do casal é travada durante a transação,
 * então dois aceites simultâneos nunca ocupam o mesmo lugar nem consomem o mesmo convite duas vezes.
 */
export async function acceptInviteFor(userId: string, token: string): Promise<AcceptResult> {
  return db.$transaction(async (tx) => {
    const inv = await tx.invite.findUnique({ where: { token } });
    if (!inv || inv.acceptedAt || inv.expiresAt < new Date()) return { ok: false, reason: "invalido" } as const;
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) return { ok: false, reason: "invalido" } as const;
    if (inv.invitedById === user.id || user.coupleId === inv.coupleId) return { ok: true, redirect: "/hoje" } as const;
    if (user.coupleId) return { ok: false, reason: "ja-vinculado" } as const;

    await tx.$queryRaw`SELECT "id" FROM "Couple" WHERE "id" = ${inv.coupleId} FOR UPDATE`;
    if ((await tx.user.count({ where: { coupleId: inv.coupleId, role: inv.role } })) > 0) return { ok: false, reason: "ocupado" } as const;

    const claimed = await tx.invite.updateMany({ where: { id: inv.id, acceptedAt: null }, data: { acceptedAt: new Date(), acceptedById: user.id } });
    if (claimed.count !== 1) return { ok: false, reason: "invalido" } as const;
    await tx.user.update({ where: { id: user.id }, data: { coupleId: inv.coupleId, role: inv.role, onboardedAt: null } });
    return { ok: true, redirect: "/onboarding" } as const;
  });
}
