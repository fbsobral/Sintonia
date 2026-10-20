import { notFound } from "next/navigation";
import { db } from "./db";
import { getUser } from "./session";
import { isAdminUser } from "./admin-config";

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
