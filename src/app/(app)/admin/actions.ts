"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { logAdmin, requireAdmin } from "@/lib/admin";
import { isEnvAdmin } from "@/lib/admin-config";
import { composeDaily, dailyInclude } from "@/lib/daily";
import { sendEmail } from "@/lib/email";

const refresh = () => revalidatePath("/admin", "layout");
const label = (u: { email: string; name: string | null }) => (u.name ? `${u.name} <${u.email}>` : u.email);

async function target(fd: FormData) {
  const id = String(fd.get("userId") ?? "");
  const user = await db.user.findUnique({ where: { id } });
  if (!user) redirect("/admin/usuarios");
  return user;
}

/** Remove a pessoa do casal; se o casal ficar vazio, apaga o casal e os dados dele. */
async function detach(userId: string, coupleId: string | null) {
  await db.user.update({ where: { id: userId }, data: { coupleId: null, role: null, onboardedAt: null } });
  if (coupleId && (await db.user.count({ where: { coupleId } })) === 0) await db.couple.delete({ where: { id: coupleId } });
}

export async function setAdmin(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  const value = fd.get("value") === "1";
  if (u.id === admin.id) return; // evita travar o próprio acesso
  if (!value && isEnvAdmin(u.email)) return; // definido por ADMIN_EMAILS: só pelo ambiente
  await db.user.update({ where: { id: u.id }, data: { isAdmin: value } });
  await logAdmin(admin, value ? "admin.grant" : "admin.revoke", { id: u.id, label: label(u) });
  refresh();
}

export async function setSuspended(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  const value = fd.get("value") === "1";
  if (u.id === admin.id || u.isAdmin || isEnvAdmin(u.email)) return; // admins não são suspensos por aqui
  await db.user.update({ where: { id: u.id }, data: { suspendedAt: value ? new Date() : null } });
  await logAdmin(admin, value ? "user.suspend" : "user.unsuspend", { id: u.id, label: label(u) });
  refresh();
}

export async function resetOnboarding(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  await db.user.update({ where: { id: u.id }, data: { onboardedAt: null } });
  await logAdmin(admin, "user.reset_onboarding", { id: u.id, label: label(u) });
  refresh();
}

export async function removeFromCouple(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  if (!u.coupleId) return;
  await detach(u.id, u.coupleId);
  await logAdmin(admin, "user.leave_couple", { id: u.id, label: label(u) });
  refresh();
}

export async function resendDaily(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  const full = await db.user.findUnique({ where: { id: u.id }, include: dailyInclude });
  if (!full) return;
  const mail = composeDaily(full);
  if ("skip" in mail) {
    await logAdmin(admin, "user.resend_daily_skipped", { id: u.id, label: label(u) }, mail.skip);
    refresh();
    return;
  }
  await sendEmail(u.email, mail.subject, mail.html);
  await logAdmin(admin, "user.resend_daily", { id: u.id, label: label(u) });
  refresh();
}

/** Exclui a conta (no app e no Clerk). Exige digitar o e-mail da pessoa. */
export async function deleteUser(fd: FormData) {
  const admin = await requireAdmin();
  const u = await target(fd);
  if (u.id === admin.id) return;
  if (String(fd.get("confirm") ?? "").trim().toLowerCase() !== u.email.toLowerCase()) redirect(`/admin/usuarios/${u.id}?erro=confirmacao`);
  let clerkOk = true;
  try {
    const c = await clerkClient();
    await c.users.deleteUser(u.clerkId);
  } catch (e) {
    clerkOk = false;
    console.error("[admin] clerk delete", u.clerkId, e);
  }
  const coupleId = u.coupleId;
  await db.user.delete({ where: { id: u.id } });
  if (coupleId && (await db.user.count({ where: { coupleId } })) === 0) await db.couple.delete({ where: { id: coupleId } });
  await logAdmin(admin, "user.delete", { id: u.id, label: label(u) }, clerkOk ? "Clerk: removido" : "Clerk: falhou, remover manualmente");
  refresh();
  redirect("/admin/usuarios?ok=excluido");
}

export async function revokeCoupleInvites(fd: FormData) {
  const admin = await requireAdmin();
  const coupleId = String(fd.get("coupleId") ?? "");
  const { count } = await db.invite.deleteMany({ where: { coupleId, acceptedAt: null } });
  await logAdmin(admin, "couple.revoke_invites", undefined, `${count} convite(s), casal ${coupleId}`);
  refresh();
}

/** Apaga o casal e todos os dados (ciclos, check-ins, sinais, convites). Exige digitar EXCLUIR. */
export async function deleteCouple(fd: FormData) {
  const admin = await requireAdmin();
  const coupleId = String(fd.get("coupleId") ?? "");
  if (String(fd.get("confirm") ?? "").trim() !== "EXCLUIR") redirect("/admin/casais?erro=confirmacao");
  const couple = await db.couple.findUnique({ where: { id: coupleId }, include: { users: true } });
  if (!couple) redirect("/admin/casais");
  await db.user.updateMany({ where: { coupleId }, data: { coupleId: null, role: null, onboardedAt: null } });
  await db.couple.delete({ where: { id: coupleId } });
  await logAdmin(admin, "couple.delete", undefined, `casal ${coupleId}: ${couple.users.map((x) => x.email).join(", ")}`);
  refresh();
  redirect("/admin/casais?ok=excluido");
}
