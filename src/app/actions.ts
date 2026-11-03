"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser, requireCouple } from "@/lib/session";
import { buildDailyEmail, sendEmail } from "@/lib/email";
import { statusOn, toDay, todayIn } from "@/lib/cycle";
import { FLOWS, LIBIDO, MOODS, SYMPTOMS, isSignal } from "@/lib/checkin";
import { emailCycleRegistered, emailInvite, emailSignal } from "@/lib/notify";
import { fmt } from "@/lib/format";
import { rateLimit } from "@/lib/rate-limit";
import { acceptInviteFor } from "@/lib/invites";
import { clerkClient } from "@clerk/nextjs/server";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal(""));
const asDate = (s: string) => new Date(`${s}T00:00:00Z`);
const refresh = () => revalidatePath("/", "layout");

/** Barra a ação (e volta à tela com aviso) quando a pessoa excede o limite da janela. */
async function limited(key: string, limit: number, windowSec: number, back: string) {
  const r = await rateLimit(key, limit, windowSec);
  if (!r.ok) redirect(`${back}?erro=limite`);
}

const cycleFields = z.object({
  cycleMode: z.enum(["D28", "D31", "IRREGULAR"]),
  periodLength: z.coerce.number().int().min(2).max(10),
});
const partnerSchema = z.object({ name: z.string().trim().min(1).max(60), birthDate: date, birthTime: time }).merge(cycleFields);
const meSchema = z.object({
  myName: z.string().trim().max(60).optional(),
  myBirthDate: date.optional().or(z.literal("")),
  myBirthTime: time,
});

const meData = (me: z.infer<typeof meSchema>) => ({
  name: me.myName || null,
  birthDate: me.myBirthDate ? asDate(me.myBirthDate) : null,
  birthTime: me.myBirthDate && me.myBirthTime ? me.myBirthTime : null,
});

/* ───────────── Onboarding ───────────── */

/** Ela é a primeira a entrar: cria o casal, o perfil de ciclo e o primeiro registro. */
export async function startAsCycle(fd: FormData) {
  const user = await getUser();
  if (user.couple) redirect("/hoje");
  const raw = Object.fromEntries(fd);
  const p = partnerSchema.parse({ ...raw, name: raw.name, birthDate: raw.birthDate });
  const last = date.parse(raw.lastPeriod);
  const couple = await db.couple.create({
    data: {
      shareCycle: fd.get("shareCycle") !== "off",
      profile: {
        create: {
          name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null,
          cycleMode: p.cycleMode, periodLength: p.periodLength,
          cycles: { create: { startDate: asDate(last), createdById: user.id } },
        },
      },
    },
  });
  await db.user.update({
    where: { id: user.id },
    data: { coupleId: couple.id, role: "CYCLE", name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null, onboardedAt: new Date() },
  });
  redirect("/convidar?novo=1");
}

/** O parceiro entra primeiro e cadastra os dados dela (ela poderá assumir depois, por convite). */
export async function startAsPartner(fd: FormData) {
  const user = await getUser();
  if (user.couple) redirect("/hoje");
  const raw = Object.fromEntries(fd);
  const p = partnerSchema.parse(raw);
  const me = meSchema.parse(raw);
  const last = date.parse(raw.lastPeriod);
  const couple = await db.couple.create({
    data: {
      profile: {
        create: {
          name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null,
          cycleMode: p.cycleMode, periodLength: p.periodLength,
          cycles: { create: { startDate: asDate(last), createdById: user.id } },
        },
      },
    },
  });
  await db.user.update({ where: { id: user.id }, data: { coupleId: couple.id, role: "PARTNER", onboardedAt: new Date(), ...meData(me) } });
  redirect("/convidar?novo=1");
}

/** Ela aceitou o convite dele: confirma os dados e decide o compartilhamento. */
export async function joinAsCycle(fd: FormData) {
  const user = await getUser();
  if (!user.couple || user.role !== "CYCLE") redirect("/onboarding");
  const p = partnerSchema.parse(Object.fromEntries(fd));
  await db.$transaction([
    db.partner.update({
      where: { coupleId: user.couple.id },
      data: { name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null, cycleMode: p.cycleMode, periodLength: p.periodLength },
    }),
    db.couple.update({ where: { id: user.couple.id }, data: { shareCycle: fd.get("shareCycle") !== "off" } }),
    db.user.update({ where: { id: user.id }, data: { name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null, onboardedAt: new Date() } }),
  ]);
  redirect("/hoje");
}

/** Ele aceitou o convite dela. */
export async function joinAsPartner(fd: FormData) {
  const user = await getUser();
  if (!user.couple || user.role !== "PARTNER") redirect("/onboarding");
  const me = meSchema.parse(Object.fromEntries(fd));
  await db.user.update({ where: { id: user.id }, data: { onboardedAt: new Date(), ...meData(me) } });
  redirect("/hoje");
}

/* ───────────── Convites e vínculo ───────────── */

const inviteExpiry = () => new Date(Date.now() + 14 * 86_400_000);

async function ensureInvite() {
  const ctx = await requireCouple();
  const role = ctx.viewer === "her" ? "PARTNER" : "CYCLE";
  if (ctx.couple.users.some((u) => u.role === role)) return { ctx, invite: null };
  const now = new Date();
  let invite = await db.invite.findFirst({ where: { coupleId: ctx.couple.id, role, acceptedAt: null, expiresAt: { gt: now } }, orderBy: { createdAt: "desc" } });
  if (!invite) {
    invite = await db.invite.create({
      data: { token: randomBytes(18).toString("base64url"), coupleId: ctx.couple.id, invitedById: ctx.user.id, role, expiresAt: inviteExpiry() },
    });
  }
  return { ctx, invite };
}

export async function createInvite() {
  const { user } = await requireCouple();
  await limited(`create-invite:${user.id}`, 10, 3600, "/perfil");
  await ensureInvite();
  revalidatePath("/perfil");
  revalidatePath("/convidar");
}

export async function sendInviteEmail(fd: FormData) {
  const email = z.string().trim().toLowerCase().email().max(200).parse(fd.get("email"));
  const { user } = await requireCouple();
  await limited(`invite-email:${user.id}`, 5, 3600, "/perfil");
  await limited(`invite-email-to:${email}`, 3, 86_400, "/perfil"); // não deixa usar o app para encher a caixa de alguém
  const { ctx, invite } = await ensureInvite();
  if (!invite) return;
  await db.invite.update({ where: { id: invite.id }, data: { email } });
  const inviter = ctx.viewer === "her" ? ctx.partner.name : ctx.user.name || "Seu parceiro";
  await emailInvite(email, inviter, invite.role, invite.token);
  revalidatePath("/perfil");
  revalidatePath("/convidar");
}

export async function revokeInvite(fd: FormData) {
  const { couple } = await requireCouple();
  await db.invite.deleteMany({ where: { id: String(fd.get("id")), coupleId: couple.id, acceptedAt: null } });
  revalidatePath("/perfil");
  revalidatePath("/convidar");
}

export async function acceptInvite(fd: FormData) {
  const token = z.string().regex(/^[\w-]{10,64}$/).safeParse(fd.get("token"));
  const user = await getUser();
  if (!token.success) redirect("/");
  const r = await rateLimit(`accept-invite:${user.id}`, 20, 600); // dificulta adivinhar tokens
  if (!r.ok) redirect(`/convite/${token.data}?erro=invalido`);
  const res = await acceptInviteFor(user.id, token.data);
  if (!res.ok) redirect(`/convite/${token.data}?erro=${res.reason}`);
  redirect(res.redirect);
}

async function detach(userId: string) {
  await db.user.update({ where: { id: userId }, data: { coupleId: null, role: null, onboardedAt: null } });
}

/** Sai do casal. Se quem sai é ela, pode apagar os dados de ciclo, check-ins e sinais. */
export async function leaveCouple(fd: FormData) {
  const { user, couple, partner, viewer } = await requireCouple();
  if (viewer === "her" && fd.get("deleteData") === "on") {
    await db.$transaction([
      db.cycle.deleteMany({ where: { partnerId: partner.id } }),
      db.checkIn.deleteMany({ where: { coupleId: couple.id } }),
      db.signal.deleteMany({ where: { coupleId: couple.id } }),
    ]);
  }
  await detach(user.id);
  const left = await db.user.count({ where: { coupleId: couple.id } });
  if (left === 0) await db.couple.delete({ where: { id: couple.id } });
  redirect("/onboarding");
}

/** Só quem menstrua pode remover o acesso do parceiro. */
export async function removePartner() {
  const { viewer, other } = await requireCouple();
  if (viewer !== "her" || !other) return;
  await detach(other.id);
  refresh();
}

/* ───────────── Dados (perfil e ciclos) ───────────── */

export async function updatePartner(fd: FormData) {
  const { partner, viewer, herUser, user } = await requireCouple();
  if (viewer !== "her" && herUser) return; // depois que ela entra, os dados dela são dela
  const p = partnerSchema.parse(Object.fromEntries(fd));
  await db.partner.update({
    where: { id: partner.id },
    data: { name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null, cycleMode: p.cycleMode, periodLength: p.periodLength },
  });
  if (viewer === "her") {
    await db.user.update({ where: { id: user.id }, data: { name: p.name, birthDate: asDate(p.birthDate), birthTime: p.birthTime || null } });
  }
  refresh();
}

export async function updateMe(fd: FormData) {
  const user = await getUser();
  const me = meSchema.parse(Object.fromEntries(fd));
  await db.user.update({ where: { id: user.id }, data: meData(me) });
  refresh();
}

export async function addCycle(fd: FormData) {
  const { user, partner, paused, viewer, other } = await requireCouple();
  if (paused) return;
  await limited(`add-cycle:${user.id}`, 60, 3600, "/ciclos");
  const start = date.parse(fd.get("start"));
  const endRaw = fd.get("end");
  const end = endRaw ? date.parse(endRaw) : null;
  // O último dia pode ser no futuro (menstruação em andamento), mas precisa vir depois do início e ser plausível.
  if (end && (end < start || toDay(end) - toDay(start) > 15)) return;
  const existed = await db.cycle.findUnique({ where: { partnerId_startDate: { partnerId: partner.id, startDate: asDate(start) } } });
  await db.cycle.upsert({
    where: { partnerId_startDate: { partnerId: partner.id, startDate: asDate(start) } },
    create: { partnerId: partner.id, startDate: asDate(start), endDate: end ? asDate(end) : null, createdById: user.id },
    update: { endDate: end ? asDate(end) : null },
  });
  refresh();
  if (!existed && other?.notifyEvents && other.email) {
    const actor = viewer === "her" ? partner.name : user.name || "Seu parceiro";
    await emailCycleRegistered(other.email, actor, partner.name, fmt(start, { day: "numeric", month: "long" }), viewer === "him");
  }
}

export async function updateCycle(fd: FormData) {
  const { user, partner, paused } = await requireCouple();
  if (paused) return;
  await limited(`add-cycle:${user.id}`, 60, 3600, "/ciclos");
  const id = String(fd.get("id"));
  const start = date.parse(fd.get("start"));
  const endRaw = fd.get("end");
  const end = endRaw ? date.parse(endRaw) : null;
  if (end && (end < start || toDay(end) - toDay(start) > 15)) return;
  const clash = await db.cycle.findFirst({ where: { partnerId: partner.id, startDate: asDate(start), NOT: { id } } });
  if (clash) return;
  await db.cycle.updateMany({ where: { id, partnerId: partner.id }, data: { startDate: asDate(start), endDate: end ? asDate(end) : null } });
  refresh();
  redirect("/ciclos");
}

export async function deleteCycle(fd: FormData) {
  const { partner, paused } = await requireCouple();
  if (paused) return;
  await db.cycle.deleteMany({ where: { id: String(fd.get("id")), partnerId: partner.id } });
  refresh();
}

/* ───────────── Check-in, sinais e privacidade (ela) ───────────── */

const allowed = <T extends readonly string[]>(list: T, values: FormDataEntryValue[]) => values.map(String).filter((v) => (list as readonly string[]).includes(v));

export async function saveCheckIn(fd: FormData) {
  const { user, couple, viewer } = await requireCouple();
  if (viewer !== "her") return;
  await limited(`checkin:${user.id}`, 120, 3600, "/hoje");
  const day = asDate(todayIn(user.timezone));
  const flow = String(fd.get("flow") ?? "");
  const libido = Number(fd.get("libido") ?? 0);
  const data = {
    moods: allowed(MOODS, fd.getAll("moods")),
    symptoms: allowed(SYMPTOMS, fd.getAll("symptoms")),
    flow: (FLOWS as readonly string[]).includes(flow) ? flow : null,
    libido: libido >= 1 && libido <= LIBIDO.length ? libido : null,
    note: String(fd.get("note") ?? "").trim().slice(0, 500) || null,
  };
  await db.checkIn.upsert({
    where: { coupleId_date: { coupleId: couple.id, date: day } },
    create: { coupleId: couple.id, date: day, ...data },
    update: data,
  });
  refresh();
}

export async function sendSignal(fd: FormData) {
  const { user, couple, viewer, other, partner } = await requireCouple();
  const kind = String(fd.get("kind"));
  if (viewer !== "her" || !isSignal(kind)) return;
  await limited(`signal:${user.id}`, 30, 3600, "/hoje");
  const day = asDate(todayIn(user.timezone));
  const recent = await db.signal.findFirst({ where: { coupleId: couple.id, kind, createdAt: { gt: new Date(Date.now() - 30 * 60_000) } } });
  if (recent) return;
  await db.signal.create({ data: { coupleId: couple.id, kind, date: day } });
  refresh();
  if (couple.shareCycle && other?.notifyEvents && other.email) await emailSignal(other.email, partner.name, kind);
}

export async function ackSignals() {
  const { couple, viewer } = await requireCouple();
  if (viewer !== "him") return;
  await db.signal.updateMany({ where: { coupleId: couple.id, seenAt: null }, data: { seenAt: new Date() } });
  refresh();
}

export async function setShare(fd: FormData) {
  const { couple, viewer } = await requireCouple();
  if (viewer !== "her") return;
  await db.couple.update({ where: { id: couple.id }, data: { shareCycle: fd.get("shareCycle") === "on" } });
  refresh();
}

/* ───────────── Preferências e e-mail ───────────── */

export async function updateSettings(fd: FormData) {
  const user = await getUser();
  const s = z
    .object({ sendHour: z.coerce.number().int().min(0).max(23), timezone: z.string().min(3).max(60) })
    .parse(Object.fromEntries(fd));
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: s.timezone });
  } catch {
    return;
  }
  await db.user.update({
    where: { id: user.id },
    data: { sendHour: s.sendHour, timezone: s.timezone, emailDaily: fd.get("emailDaily") === "on", notifyEvents: fd.get("notifyEvents") === "on" },
  });
  refresh();
}

export async function sendTestEmail() {
  const { user, partner, profile, today, viewer, paused } = await requireCouple();
  const status = statusOn(profile, today);
  if (!status || !user.email || paused) return;
  await limited(`test-email:${user.id}`, 5, 3600, "/perfil");
  const { subject, html } = buildDailyEmail(
    partner.name, status, today,
    { birthDate: partner.birthDate.toISOString().slice(0, 10), birthTime: partner.birthTime },
    viewer,
  );
  await sendEmail(user.email, subject, html);
}

/* ───────────── Excluir a própria conta (LGPD: direito de eliminação) ───────────── */

/**
 * Apaga a conta no Clerk e no app. Exige digitar o próprio e-mail.
 * Quem menstrua leva os dados do casal junto; o parceiro é desvinculado e volta ao cadastro.
 * Quem acompanha sai e o casal só some se ficar vazio.
 */
export async function deleteMyAccount(fd: FormData) {
  const user = await getUser();
  await limited(`delete-account:${user.id}`, 5, 3600, "/perfil");
  if (String(fd.get("confirm") ?? "").trim().toLowerCase() !== user.email.toLowerCase()) redirect("/perfil?erro=confirmacao");

  // Clerk primeiro: se falhar, nada é apagado e a pessoa pode tentar de novo.
  try {
    const c = await clerkClient();
    await c.users.deleteUser(user.clerkId);
  } catch (e) {
    console.error("[delete-account] clerk", user.id, e);
    redirect("/perfil?erro=clerk");
  }

  const coupleId = user.coupleId;
  if (coupleId) {
    if (user.role === "CYCLE") {
      await db.user.updateMany({ where: { coupleId, id: { not: user.id } }, data: { coupleId: null, role: null, onboardedAt: null } });
      await db.couple.delete({ where: { id: coupleId } });
    }
  }
  await db.user.delete({ where: { id: user.id } });
  if (coupleId && (await db.user.count({ where: { coupleId } })) === 0) await db.couple.deleteMany({ where: { id: coupleId } });
  redirect("/");
}
