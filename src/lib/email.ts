import { Resend } from "resend";
import { chartFor, skyToday } from "./astro";
import { skyReading } from "./sky";
import { PHASES, pick, stageForViewer } from "./tips";
import { toDay, type Status } from "./cycle";
import { short, shortRange } from "./format";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export type PartnerBirth = { birthDate: string; birthTime?: string | null };

const REG = { regular: "regular", moderada: "moderadamente variável", irregular: "irregular", desconhecida: "sem dados suficientes" } as const;

export function buildDailyEmail(partnerName: string, s: Status, today: string, birth: PartnerBirth, viewer: "him" | "her" = "him") {
  const her = viewer === "her";
  const p = PHASES[s.phase];
  const st = stageForViewer(s.phase, s.phaseDay, s.phaseLength, viewer);
  const talk = pick(st.talk, toDay(today));
  const li = (items: string[]) => items.map((i) => `<li style="margin:0 0 8px">${i}</li>`).join("");
  const subject = her ? `Hoje: ${st.name}${s.pms ? " · janela de TPM" : ""}` : `${partnerName} hoje: ${st.name}${s.pms ? " · janela de TPM" : ""}`;
  const [r0, r1] = s.nextRange;
  const next =
    s.daysToPeriod <= 0 ? "A menstruação está prevista para hoje." :
    r0 !== r1 ? `Próxima menstruação prevista entre ${shortRange(r0, r1).replace(" – ", " e ")}.` :
    `Próxima menstruação prevista para ${short(s.nextPeriod)}.`;
  const fert = s.fertility === "baixa" ? "" : ` Fertilidade ${s.fertility}: se não planejam gravidez, usem proteção.`;
  const moon = chartFor(birth.birthDate, birth.birthTime ?? null).moon.sign;
  const sky = skyToday(new Date(`${today}T15:00:00Z`));
  const read = skyReading(sky.moonPhase, sky.moonSign, moon, s.phase, s.pms, viewer);
  const LV = ["", "muito baixa", "baixa", "média", "alta", "muito alta"];
  const meter = (label: string, v: number) =>
    `<td style="width:33%;padding-right:10px;vertical-align:top"><div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A95B8">${label}</div><table role="presentation" style="width:100%;margin-top:5px;border-collapse:separate;border-spacing:3px 0"><tr>${[1, 2, 3, 4, 5].map((i) => `<td style="height:6px;border-radius:3px;background:${i <= v ? p.color : "#ffffff22"}"></td>`).join("")}</tr></table><div style="margin-top:4px;font-size:12px;color:#C9C5E0">${LV[v]}</div></td>`;
  const conf = `Ciclo de ${s.profile.length} dias (${s.profile.source === "media" ? `média de ${s.profile.intervals.length} ciclos` : "ritmo informado"}), regularidade ${REG[s.profile.regularity]}${s.profile.variability != null ? `, variação de ±${s.profile.margin} dia${s.profile.margin > 1 ? "s" : ""}` : ""}.`;
  const h3 = "margin:26px 0 6px;font-size:15px";
  const html = `<!doctype html><html><body style="margin:0;background:#0F0D1F;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#EDEAF7">
<div style="max-width:540px;margin:0 auto;padding:28px 20px">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9A95B8">Sintonia · resumo do dia</div>
  <div style="margin-top:14px;padding:22px;border-radius:20px;background:${p.soft};border:1px solid ${p.color}55">
    <div style="font-size:12px;color:${p.color};font-weight:700;text-transform:uppercase;letter-spacing:.08em">Fase ${p.name} · dia ${s.cycleDay} do ciclo${s.projected ? " (estimado)" : ""}</div>
    <div style="font-size:26px;font-weight:700;margin:6px 0 6px">${st.name}</div>
    <div style="color:#C9C5E0;line-height:1.5">${st.mood}</div>
    <div style="margin-top:10px;color:#A29DC0;font-size:14px">${next}${fert} Ovulação estimada em ${short(s.ovulationDate)}.</div>
  </div>
  <p style="margin:18px 0 14px;line-height:1.6;color:#DCD8EE">${st.body}</p>
  <table role="presentation" style="width:100%;border-collapse:collapse"><tr>${meter("Energia", st.energy)}${meter("Sensibilidade", st.sensitivity)}${meter("Desejo", st.desire)}</tr></table>
  <h3 style="margin:26px 0 6px;font-size:15px">O que está acontecendo</h3>
  <p style="margin:0;line-height:1.6;color:#DCD8EE">${st.why}</p>
  <p style="margin:6px 0 0;font-size:13px;color:${p.color};font-weight:600">${st.hormones}</p>
  <h3 style="margin:26px 0 6px;font-size:15px">${her ? "O que pode ajudar você" : "O que ajuda"}</h3>
  <ul style="margin:0;padding-left:18px;line-height:1.55;color:#DCD8EE">${li(st.do)}</ul>
  <h3 style="margin:22px 0 6px;font-size:15px">O que evitar</h3>
  <ul style="margin:0;padding-left:18px;line-height:1.55;color:#DCD8EE">${li(st.avoid)}</ul>
  <h3 style="margin:26px 0 6px;font-size:15px">${her ? "O que você pode dizer ao seu parceiro" : "Como abrir a conversa"}</h3>
  <p style="margin:0;padding:14px 16px;border-left:3px solid ${p.color};background:#ffffff0d;border-radius:8px;line-height:1.55;color:#fff">${talk}</p>
  <h3 style="margin:26px 0 6px;font-size:15px">Ponto de atenção</h3>
  <p style="margin:0;line-height:1.6;color:#DCD8EE">${st.tip}</p>
  ${st.flag ? `<p style="margin:22px 0 0;padding:12px 14px;border-radius:12px;background:#f2b13422;color:#f6dca0;font-size:13px;line-height:1.5">${st.flag}</p>` : ""}
  <h3 style="${h3}">Céu de hoje: ${sky.moonPhase} em ${sky.moonSign}</h3>
  <p style="margin:0 0 8px;line-height:1.6;color:#DCD8EE"><b style="color:#BFB0FF">O que a fase traz.</b> ${read.phase}</p>
  <p style="margin:0 0 8px;line-height:1.6;color:#DCD8EE"><b style="color:#BFB0FF">Lua em ${sky.moonSign}.</b> ${read.sign.mood}</p>
  <p style="margin:0 0 8px;line-height:1.6;color:#DCD8EE"><b style="color:#BFB0FF">Com ${her ? "a sua Lua" : "a Lua dela"} (${moon}).</b> ${read.vsHer}</p>
  <p style="margin:0 0 8px;line-height:1.6;color:#DCD8EE"><b style="color:#BFB0FF">Junto com o ciclo.</b> ${read.cross}</p>
  <p style="margin:10px 0 0;padding:12px 14px;border-radius:12px;background:#ffffff0d;line-height:1.55;color:#fff"><b>Aplicação prática:</b> ${read.sign.tip}</p>
  <p style="margin:8px 0 0;font-size:12px;color:#7D7899">Leitura simbólica, sem base científica, usada como roteiro de conversa.</p>
  <a href="${APP_URL}/hoje" style="display:inline-block;margin-top:28px;padding:13px 22px;border-radius:999px;background:#EDEAF7;color:#0F0D1F;text-decoration:none;font-weight:700">${her ? "Fazer meu check-in" : "Ver no Sintonia"}</a>
  <p style="margin-top:28px;font-size:12px;color:#7D7899;line-height:1.55">${conf}<br><br>Tendências médias, não diagnóstico: cada mulher e cada ciclo são diferentes, e as datas são estimativas feitas a partir dos ciclos registrados. Não use como método contraceptivo. Para parar de receber, desative em Perfil.</p>
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
