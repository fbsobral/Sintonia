import { Resend } from "resend";
import { PHASES, pick, stageFor } from "./tips";
import { toDay, type Status } from "./cycle";
import { short, shortRange } from "./format";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function buildDailyEmail(partnerName: string, s: Status, today: string) {
  const p = PHASES[s.phase];
  const st = stageFor(s.phase, s.phaseDay, s.phaseLength);
  const talk = pick(st.talk, toDay(today));
  const li = (items: string[]) => items.map((i) => `<li style="margin:0 0 8px">${i}</li>`).join("");
  const subject = `${partnerName} hoje: ${st.name}${s.pms ? " · janela de TPM" : ""}`;
  const [r0, r1] = s.nextRange;
  const next =
    s.daysToPeriod <= 0 ? "A menstruação está prevista para hoje." :
    r0 !== r1 ? `Próxima menstruação prevista entre ${shortRange(r0, r1).replace(" – ", " e ")}.` :
    `Próxima menstruação prevista para ${short(s.nextPeriod)}.`;
  const fert = s.fertility === "baixa" ? "" : ` Fertilidade ${s.fertility}: se não planejam gravidez, usem proteção.`;
  const html = `<!doctype html><html><body style="margin:0;background:#0F0D1F;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#EDEAF7">
<div style="max-width:540px;margin:0 auto;padding:28px 20px">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9A95B8">Sintonia · resumo do dia</div>
  <div style="margin-top:14px;padding:22px;border-radius:20px;background:${p.soft};border:1px solid ${p.color}55">
    <div style="font-size:12px;color:${p.color};font-weight:700;text-transform:uppercase;letter-spacing:.08em">Fase ${p.name} · dia ${s.cycleDay} do ciclo${s.projected ? " (estimado)" : ""}</div>
    <div style="font-size:26px;font-weight:700;margin:6px 0 6px">${st.name}</div>
    <div style="color:#C9C5E0;line-height:1.5">${st.mood}</div>
    <div style="margin-top:10px;color:#A29DC0;font-size:14px">${next}${fert}</div>
  </div>
  <h3 style="margin:26px 0 6px;font-size:15px">O que está acontecendo</h3>
  <p style="margin:0;line-height:1.6;color:#DCD8EE">${st.why}</p>
  <p style="margin:6px 0 0;font-size:13px;color:${p.color};font-weight:600">${st.hormones}</p>
  <h3 style="margin:26px 0 6px;font-size:15px">O que ajuda</h3>
  <ul style="margin:0;padding-left:18px;line-height:1.55;color:#DCD8EE">${li(st.do)}</ul>
  <h3 style="margin:22px 0 6px;font-size:15px">O que evitar</h3>
  <ul style="margin:0;padding-left:18px;line-height:1.55;color:#DCD8EE">${li(st.avoid)}</ul>
  <h3 style="margin:26px 0 6px;font-size:15px">Como abrir a conversa</h3>
  <p style="margin:0;padding:14px 16px;border-left:3px solid ${p.color};background:#ffffff0d;border-radius:8px;line-height:1.55;color:#fff">${talk}</p>
  <h3 style="margin:26px 0 6px;font-size:15px">Ponto de atenção</h3>
  <p style="margin:0;line-height:1.6;color:#DCD8EE">${st.tip}</p>
  ${st.flag ? `<p style="margin:22px 0 0;padding:12px 14px;border-radius:12px;background:#f2b13422;color:#f6dca0;font-size:13px;line-height:1.5">${st.flag}</p>` : ""}
  <a href="${APP_URL}/hoje" style="display:inline-block;margin-top:28px;padding:13px 22px;border-radius:999px;background:#EDEAF7;color:#0F0D1F;text-decoration:none;font-weight:700">Ver no Sintonia</a>
  <p style="margin-top:28px;font-size:12px;color:#7D7899;line-height:1.55">Tendências médias, não diagnóstico: cada mulher e cada ciclo são diferentes, e as datas são estimativas feitas a partir dos ciclos registrados. Não use como método contraceptivo. Para parar de receber, desative em Perfil.</p>
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
