import { db } from "@/lib/db";
import { composeDaily, dailyInclude } from "@/lib/daily";
import { todayIn } from "@/lib/cycle";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Chamar a cada hora (Coolify Scheduled Task):
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" $APP_URL/api/cron/daily
 * Cada pessoa do casal recebe o resumo na própria perspectiva (ela em 1ª pessoa, ele sobre ela),
 * a partir da hora escolhida (no fuso dela) e uma vez por dia. Se ela pausou o compartilhamento,
 * o parceiro não recebe. Contas suspensas não recebem.
 */
async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const users = await db.user.findMany({
    where: { emailDaily: true, suspendedAt: null, onboardedAt: { not: null }, role: { not: null }, coupleId: { not: null } },
    include: dailyInclude,
  });
  let sent = 0, skipped = 0, failed = 0;
  for (const u of users) {
    const today = todayIn(u.timezone);
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: u.timezone, hour: "2-digit", hour12: false }).format(new Date())) % 24;
    if (u.lastEmailOn === today || hour < u.sendHour) { skipped++; continue; }
    const mail = composeDaily(u);
    if ("skip" in mail) { skipped++; continue; }
    try {
      await sendEmail(u.email, mail.subject, mail.html);
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
