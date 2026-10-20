import type { Prisma } from "@prisma/client";
import { buildProfile, dateStr, statusOn, todayIn } from "./cycle";
import { buildDailyEmail } from "./email";

export const dailyInclude = {
  couple: { include: { users: true, profile: { include: { cycles: { orderBy: { startDate: "asc" } } } } } },
} satisfies Prisma.UserInclude;
export type DailyUser = Prisma.UserGetPayload<{ include: typeof dailyInclude }>;

/** Monta o resumo diário de uma pessoa, na perspectiva dela. `skip` explica por que não há e-mail. */
export function composeDaily(u: DailyUser): { subject: string; html: string; today: string } | { skip: string } {
  const couple = u.couple;
  const partner = couple?.profile;
  if (!couple || !partner || !u.role) return { skip: "sem casal" };
  if (!u.email) return { skip: "sem e-mail" };
  const viewer = u.role === "CYCLE" ? "her" : "him";
  const herJoined = couple.users.some((x) => x.role === "CYCLE");
  if (viewer === "him" && herJoined && !couple.shareCycle) return { skip: "compartilhamento pausado" };
  const today = todayIn(u.timezone);
  const profile = buildProfile(
    partner.cycles.map((c) => ({ start: dateStr(c.startDate), end: c.endDate ? dateStr(c.endDate) : null })),
    partner.cycleMode,
    partner.periodLength,
  );
  const status = statusOn(profile, today);
  if (!status) return { skip: "sem menstruação registrada" };
  const { subject, html } = buildDailyEmail(partner.name, status, today, { birthDate: dateStr(partner.birthDate), birthTime: partner.birthTime }, viewer);
  return { subject, html, today };
}
