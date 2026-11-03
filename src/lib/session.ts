import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { buildProfile, dateStr, todayIn } from "./cycle";
import { isAdminUser, isEnvAdmin } from "./admin-config";

/** Promove a admin quando o e-mail está em ADMIN_EMAILS E verificado no Clerk (nunca só pela string). */
export async function promoteEnvAdmin<T extends { id: string; email: string; isAdmin: boolean }>(user: T): Promise<boolean> {
  if (user.isAdmin || !isEnvAdmin(user.email)) return user.isAdmin;
  const cu = await currentUser();
  const ok = !!cu?.emailAddresses.some((e) => e.emailAddress.toLowerCase() === user.email.toLowerCase() && e.verification?.status === "verified");
  if (!ok) return false;
  await db.user.update({ where: { id: user.id }, data: { isAdmin: true } });
  return true;
}

const coupleInclude = {
  users: true,
  profile: { include: { cycles: { orderBy: { startDate: "asc" as const } } } },
} as const;

export async function getUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  let user = await db.user.findUnique({ where: { clerkId: userId }, include: { couple: { include: coupleInclude } } });
  if (!user) {
    const cu = await currentUser();
    const email = cu?.primaryEmailAddress?.emailAddress ?? cu?.emailAddresses[0]?.emailAddress ?? "";
    user = await db.user.create({ data: { clerkId: userId, email }, include: { couple: { include: coupleInclude } } });
  }
  if (user.suspendedAt) redirect("/suspenso");
  if (!user.isAdmin && (await promoteEnvAdmin(user))) {
    user = await db.user.findUniqueOrThrow({ where: { id: user.id }, include: { couple: { include: coupleInclude } } });
  }
  return user;
}

export type FullUser = Awaited<ReturnType<typeof getUser>>;
/** "her" = quem menstrua vendo a própria plataforma; "him" = parceiro acompanhando. */
export type Viewer = "her" | "him";

/** Exige casal, papel e onboarding concluído; senão manda para o onboarding. */
export async function requireCouple() {
  const user = await getUser();
  if (!user.couple || !user.role || !user.onboardedAt || !user.couple.profile) redirect("/onboarding");
  const couple = user.couple;
  const partner = couple.profile!;
  const viewer: Viewer = user.role === "CYCLE" ? "her" : "him";
  const other = couple.users.find((u) => u.id !== user.id) ?? null;
  const herUser = couple.users.find((u) => u.role === "CYCLE") ?? null;
  /** Parceiro vê o ciclo só se ela (já cadastrada) mantiver o compartilhamento ligado. */
  const paused = viewer === "him" && !!herUser && !couple.shareCycle;
  const profile = buildProfile(
    partner.cycles.map((c) => ({ start: dateStr(c.startDate), end: c.endDate ? dateStr(c.endDate) : null })),
    partner.cycleMode,
    partner.periodLength,
  );
  return { user, couple, partner, profile, today: todayIn(user.timezone), viewer, other, herUser, paused, isAdmin: isAdminUser(user) };
}

/** Compatibilidade com o nome antigo. */
export const requirePartner = requireCouple;
