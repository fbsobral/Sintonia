import { Resend } from "resend";
import { PHASES, dayTip, pick, stageFor } from "./tips";
import { toDay, type Status } from "./cycle";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function buildDailyEmail(partnerName: string, s: Status, today: string) {
  const p = PHASES[s.phase];
  const seed = toDay(today);
  const st = stageFor(s.phase, s.phaseDay, s.phaseLength);
  const tip = dayTip(s.phase, s.phaseDay, s.pms, s.phaseLength);
  const talk = pick(p.talk, seed);
  const li = (items: string[]) => items.slice(0, 2).map((i) => `<li style="margin:0 0 6px">${i}</li>`).join("");
  const subject = `Sintonia · ${partnerName} hoje: ${p.name}${s.pms ? " (atenção à TPM)" : ""}`;
  const next =
    s.daysToPeriod <= 0 ? "A menstruação deve chegar hoje." :
    s.daysToPeriod === 1 ? "A menstruação deve chegar amanhã." :
    `Faltam ${s.daysToPeriod} dias para a próxima menstruação.`;
  const html = `<!doctype html><html><body style="margin:0;background:#0F0D1F;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#EDEAF7">
<div style="max-width:520px;margin:0 auto;padding:28px 20px">
  <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#9A95B8">Sintonia · bom dia</div>
  <div style="margin-top:14px;padding:22px;border-radius:20px;background:${p.soft};border:1px solid ${p.color}55">
    <div style="font-size:13px;color:${p.color};font-weight:700;text-transform:uppercase;letter-spacing:.08em">Dia ${s.cycleDay} do ciclo${s.projected ? " (estimado)" : ""}</div>
    <div style="font-size:28px;font-weight:700;margin:6px 0 4px">${p.name}</div>
    <div style="color:#C9C5E0">${p.tagline}. ${next}</div>
  </div>
  <h3 style="margin:26px 0 8px;font-size:16px">Dica do dia</h3>
  <p style="margin:0;line-height:1.55;color:#DCD8EE">${tip}</p>
  <h3 style="margin:26px 0 8px;font-size:16px">Como ela pode estar</h3>
  <p style="margin:0;line-height:1.55;color:#DCD8EE">${st.mood}</p>
  <h3 style="margin:26px 0 8px;font-size:16px">Para puxar papo</h3>
  <p style="margin:0;padding:14px 16px;border-left:3px solid ${p.color};background:#ffffff0d;border-radius:8px;line-height:1.55;color:#fff">${talk}</p>
  <h3 style="margin:26px 0 8px;font-size:16px">Faça</h3><ul style="margin:0;padding-left:18px;line-height:1.5;color:#DCD8EE">${li(st.do)}</ul>
  <h3 style="margin:22px 0 8px;font-size:16px">Evite</h3><ul style="margin:0;padding-left:18px;line-height:1.5;color:#DCD8EE">${li(st.avoid)}</ul>
  <a href="${APP_URL}/hoje" style="display:inline-block;margin-top:28px;padding:13px 22px;border-radius:999px;background:#EDEAF7;color:#0F0D1F;text-decoration:none;font-weight:700">Abrir no Sintonia</a>
  <p style="margin-top:28px;font-size:12px;color:#7D7899;line-height:1.5">Estimativas baseadas nos ciclos registrados. Cada pessoa é única: observe, pergunte e converse. Para parar de receber, desative em Perfil.</p>
</div></body></html>`;
  return { subject, html };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dry-run] to=${to} subject="${subject}"`);
    return { ok: true as const, dryRun: true };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Sintonia <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true as const, dryRun: false };
}
