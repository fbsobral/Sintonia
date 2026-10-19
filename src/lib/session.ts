import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { buildProfile, dateStr, todayIn } from "./cycle";

export async function getUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  let user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { partner: { include: { cycles: { orderBy: { startDate: "asc" } } } } },
  });
  if (!user) {
    const cu = await currentUser();
    const email = cu?.primaryEmailAddress?.emailAddress ?? cu?.emailAddresses[0]?.emailAddress ?? "";
    user = await db.user.create({
      data: { clerkId: userId, email },
      include: { partner: { include: { cycles: { orderBy: { startDate: "asc" } } } } },
    });
  }
  return user;
}

export type FullUser = Awaited<ReturnType<typeof getUser>>;

/** Exige parceira cadastrada; senão manda para o onboarding. */
export async function requirePartner() {
  const user = await getUser();
  if (!user.partner) redirect("/onboarding");
  const partner = user.partner;
  const profile = buildProfile(
    partner.cycles.map((c) => ({ start: dateStr(c.startDate), end: c.endDate ? dateStr(c.endDate) : null })),
    partner.cycleMode,
    partner.periodLength,
  );
  return { user, partner, profile, today: todayIn(user.timezone) };
}
