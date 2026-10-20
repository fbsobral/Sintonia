import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { OnboardingFlow, type Prefill, type Variant } from "@/components/OnboardingFlow";
import { dateStr } from "@/lib/cycle";

export const metadata = { title: "Começar" };

export default async function Onboarding({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const user = await getUser();
  const { role } = await searchParams;
  const couple = user.couple;

  // Já concluído
  if (couple && user.onboardedAt && user.role) redirect("/hoje");

  // Entrou por convite: o casal já existe, falta confirmar os dados
  if (couple && user.role) {
    const profile = couple.profile;
    const inviter = couple.users.find((u) => u.id !== user.id);
    if (user.role === "CYCLE" && profile) {
      const prefill: Prefill = {
        inviterName: inviter?.name || "Seu parceiro",
        selfName: profile.name, selfDate: dateStr(profile.birthDate), selfTime: profile.birthTime ?? "",
        mode: profile.cycleMode, period: profile.periodLength, cyclesCount: profile.cycles.length,
        otherDate: inviter?.birthDate ? dateStr(inviter.birthDate) : undefined, otherTime: inviter?.birthTime ?? "",
      };
      return <OnboardingFlow variant="join-cycle" prefill={prefill} />;
    }
    if (user.role === "PARTNER" && profile) {
      const prefill: Prefill = {
        inviterName: profile.name,
        otherDate: dateStr(profile.birthDate), otherTime: profile.birthTime ?? "", otherName: profile.name,
      };
      return <OnboardingFlow variant="join-partner" prefill={prefill} />;
    }
  }

  const variant: Variant | null = role === "cycle" ? "cycle-first" : role === "partner" ? "partner-first" : null;
  return <OnboardingFlow variant={variant} />;
}
