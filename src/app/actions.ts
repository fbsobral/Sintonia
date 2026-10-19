"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser, requirePartner } from "@/lib/session";
import { buildDailyEmail, sendEmail } from "@/lib/email";
import { statusOn } from "@/lib/cycle";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const asDate = (s: string) => new Date(`${s}T00:00:00Z`);

const partnerSchema = z.object({
  name: z.string().trim().min(1).max(60),
  birthDate: date,
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  cycleMode: z.enum(["D28", "D31", "IRREGULAR"]),
  periodLength: z.coerce.number().int().min(2).max(10),
});

export async function saveOnboarding(fd: FormData) {
  const user = await getUser();
  const p = partnerSchema.parse(Object.fromEntries(fd));
  const lastPeriod = date.parse(fd.get("lastPeriod"));
  const data = {
    name: p.name,
    birthDate: asDate(p.birthDate),
    birthTime: p.birthTime || null,
    cycleMode: p.cycleMode,
    periodLength: p.periodLength,
  };
  const partner = await db.partner.upsert({
    where: { userId: user.id },
    create: { ...data, userId: user.id },
    update: data,
  });
  await db.cycle.upsert({
    where: { partnerId_startDate: { partnerId: partner.id, startDate: asDate(lastPeriod) } },
    create: { partnerId: partner.id, startDate: asDate(lastPeriod) },
    update: {},
  });
  redirect("/hoje");
}

export async function updatePartner(fd: FormData) {
  const { partner } = await requirePartner();
  const p = partnerSchema.parse(Object.fromEntries(fd));
  await db.partner.update({
    where: { id: partner.id },
    data: {
      name: p.name,
      birthDate: asDate(p.birthDate),
      birthTime: p.birthTime || null,
      cycleMode: p.cycleMode,
      periodLength: p.periodLength,
    },
  });
  revalidatePath("/", "layout");
}

export async function addCycle(fd: FormData) {
  const { partner } = await requirePartner();
  const start = date.parse(fd.get("start"));
  const endRaw = fd.get("end");
  const end = endRaw ? date.parse(endRaw) : null;
  if (end && end < start) return;
  await db.cycle.upsert({
    where: { partnerId_startDate: { partnerId: partner.id, startDate: asDate(start) } },
    create: { partnerId: partner.id, startDate: asDate(start), endDate: end ? asDate(end) : null },
    update: { endDate: end ? asDate(end) : null },
  });
  revalidatePath("/", "layout");
}

export async function deleteCycle(fd: FormData) {
  const { partner } = await requirePartner();
  await db.cycle.deleteMany({ where: { id: String(fd.get("id")), partnerId: partner.id } });
  revalidatePath("/", "layout");
}

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
    data: { sendHour: s.sendHour, timezone: s.timezone, emailDaily: fd.get("emailDaily") === "on" },
  });
  revalidatePath("/", "layout");
}

export async function sendTestEmail() {
  const { user, partner, profile, today } = await requirePartner();
  const status = statusOn(profile, today);
  if (!status || !user.email) return;
  const { subject, html } = buildDailyEmail(partner.name, status, today);
  await sendEmail(user.email, subject, html);
}
