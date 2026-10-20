import { sendEmail } from "./email";
import { SIGNALS, type SignalKind } from "./checkin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function shell(title: string, body: string, cta?: { label: string; href: string }, foot?: string) {
  return `<!doctype html><html><body style="margin:0;background:#0F0D1F;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#EDEAF7">
<div style="max-width:520px;margin:0 auto;padding:28px 20px">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9A95B8">Sintonia</div>
  <h1 style="font-size:24px;line-height:1.25;margin:14px 0 10px">${title}</h1>
  <div style="line-height:1.6;color:#DCD8EE;font-size:15px">${body}</div>
  ${cta ? `<a href="${cta.href}" style="display:inline-block;margin-top:24px;padding:13px 22px;border-radius:999px;background:#EDEAF7;color:#0F0D1F;text-decoration:none;font-weight:700">${esc(cta.label)}</a>` : ""}
  <p style="margin-top:28px;font-size:12px;color:#7D7899;line-height:1.55">${foot ?? "Você recebe este aviso porque faz parte de um casal no Sintonia. Para desativar, ajuste em Perfil."}</p>
</div></body></html>`;
}

/** Falhas de e-mail nunca devem quebrar a ação do usuário. */
async function safe(to: string | null | undefined, subject: string, html: string) {
  if (!to) return;
  try { await sendEmail(to, subject, html); } catch (e) { console.error("[notify]", subject, e); }
}

export const inviteUrl = (token: string) => `${APP_URL}/convite/${token}`;

export async function emailInvite(to: string, inviterName: string, invitedRole: "CYCLE" | "PARTNER", token: string) {
  const herSide = invitedRole === "CYCLE";
  const body = herSide
    ? `<b>${esc(inviterName)}</b> convidou você para o Sintonia. Lá você acompanha o seu ciclo em primeira pessoa e vê o que está acontecendo no seu corpo a cada dia. O que você registrar aparece para ele, e o que ele registrar aparece para você.<br><br><b>Você controla o que é compartilhado:</b> pode pausar o compartilhamento quando quiser, e as suas anotações pessoais nunca são mostradas.`
    : `<b>${esc(inviterName)}</b> convidou você para o Sintonia. Lá você acompanha o ciclo dela, entende o que está acontecendo em cada fase e recebe orientações para o dia a dia. O que um registrar aparece para o outro.<br><br>Ela controla o que é compartilhado e pode pausar quando quiser.`;
  await safe(to, `${inviterName} convidou você para o Sintonia`, shell("Você recebeu um convite", body, { label: "Ver convite", href: inviteUrl(token) }, "Se você não esperava este convite, pode ignorar este e-mail."));
}

export async function emailCycleRegistered(to: string | null | undefined, actorName: string, herName: string, startLabel: string, toHer: boolean) {
  const what = toHer ? "o início da sua menstruação" : `o início da menstruação de ${esc(herName)}`;
  await safe(to, `${actorName} registrou ${toHer ? "sua" : "a"} menstruação`, shell("Novo registro de ciclo", `<b>${esc(actorName)}</b> registrou ${what} em <b>${esc(startLabel)}</b>. As previsões e as orientações já foram atualizadas para os dois.`, { label: "Abrir o Sintonia", href: `${APP_URL}/hoje` }));
}

export async function emailSignal(to: string | null | undefined, herName: string, kind: SignalKind) {
  const s = SIGNALS[kind];
  await safe(to, `${herName} ${s.himTitle}`, shell(`${esc(herName)} ${s.himTitle}`, `${esc(s.guide)}`, { label: "Ver no Sintonia", href: `${APP_URL}/hoje` }, "Este aviso é enviado quando ela usa um sinal no Sintonia. Para desativar, ajuste em Perfil."));
}
