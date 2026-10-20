import { db } from "@/lib/db";
import { buildProfile, dateStr, statusOn, todayIn } from "@/lib/cycle";
import { buildDailyEmail, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Chamar a cada hora (Coolify Scheduled Task):
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" $APP_URL/api/cron/daily
 * Cada pessoa do casal recebe o resumo na própria perspectiva (ela em 1ª pessoa, ele sobre ela),
 * a partir da hora escolhida (no fuso dela) e uma vez por dia. Se ela pausou o compartilhamento,
 * o parceiro não recebe.
 */
async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const users = await db.user.findMany({
    where: { emailDaily: true, onboardedAt: { not: null }, role: { not: null }, coupleId: { not: null } },
    include: { couple: { include: { users: true, profile: { include: { cycles: { orderBy: { startDate: "asc" } } } } } } },
  });
  let sent = 0, skipped = 0, failed = 0;
  for (const u of users) {
    const couple = u.couple;
    const partner = couple?.profile;
    if (!couple || !partner || !u.email || !u.role) { skipped++; continue; }
    const viewer = u.role === "CYCLE" ? "her" : "him";
    const herJoined = couple.users.some((x) => x.role === "CYCLE");
    if (viewer === "him" && herJoined && !couple.shareCycle) { skipped++; continue; }

    const today = todayIn(u.timezone);
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: u.timezone, hour: "2-digit", hour12: false }).format(new Date())) % 24;
    if (u.lastEmailOn === today || hour < u.sendHour) { skipped++; continue; }

    const profile = buildProfile(
      partner.cycles.map((c) => ({ start: dateStr(c.startDate), end: c.endDate ? dateStr(c.endDate) : null })),
      partner.cycleMode,
      partner.periodLength,
    );
    const status = statusOn(profile, today);
    if (!status) { skipped++; continue; }
    try {
      const { subject, html } = buildDailyEmail(partner.name, status, today, { birthDate: dateStr(partner.birthDate), birthTime: partner.birthTime }, viewer);
      await sendEmail(u.email, subject, html);
      await db.user.update({ where: { id: u.id }, data: { lastEmailOn: today } });
      sent++;
    } catch (e) {
      failed++;
      console.error("[cron/daily]", u.id, e);
    }
  }
  return Response.json({ sent, skipped, failed });
}

export const GET = run;
export const POST = run;
