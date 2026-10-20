import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { getUser } from "./session";
import { isAdminUser } from "./admin-config";

/** Consulta leve (sem redirecionar) para mostrar o item Admin no menu. */
export async function isCurrentUserAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const u = await db.user.findUnique({ where: { clerkId: userId }, select: { email: true, isAdmin: true } });
  return !!u && isAdminUser(u);
}

/** Só admins entram; para os demais a rota simplesmente não existe. */
export async function requireAdmin() {
  const user = await getUser();
  if (!isAdminUser(user)) notFound();
  return user;
}

export async function logAdmin(admin: { id: string; email: string }, action: string, target?: { id: string; label: string }, meta?: string) {
  await db.adminLog.create({
    data: { adminId: admin.id, adminEmail: admin.email, action, targetUserId: target?.id ?? null, targetLabel: target?.label ?? null, meta: meta ?? null },
  });
}
