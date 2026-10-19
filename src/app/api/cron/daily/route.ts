import { db } from "@/lib/db";
import { buildProfile, dateStr, statusOn, todayIn } from "@/lib/cycle";
import { buildDailyEmail, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Chamar a cada hora (Coolify Scheduled Task):
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" $APP_URL/api/cron/daily
 * Envia para quem já passou da hora escolhida (no fuso dele) e ainda não recebeu hoje.
 */
async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const users = await db.user.findMany({
    where: { emailDaily: true, partner: { isNot: null } },
    include: { partner: { include: { cycles: { orderBy: { startDate: "asc" } } } } },
  });
  let sent = 0, skipped = 0, failed = 0;
  for (const u of users) {
    const today = todayIn(u.timezone);
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: u.timezone, hour: "2-digit", hour12: false }).format(new Date())) % 24;
    if (u.lastEmailOn === today || hour < u.sendHour || !u.partner || !u.email) { skipped++; continue; }
    const profile = buildProfile(
      u.partner.cycles.map((c) => ({ start: dateStr(c.startDate), end: c.endDate ? dateStr(c.endDate) : null })),
      u.partner.cycleMode,
      u.partner.periodLength,
    );
    const status = statusOn(profile, today);
    if (!status) { skipped++; continue; }
    try {
      const { subject, html } = buildDailyEmail(u.partner.name, status, today);
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
