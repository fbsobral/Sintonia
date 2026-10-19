import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { saveOnboarding } from "@/app/actions";
import { PartnerFields } from "@/components/PartnerFields";
import { todayIn } from "@/lib/cycle";

export const metadata = { title: "Começar" };

export default async function Onboarding() {
  const user = await getUser();
  if (user.partner) redirect("/hoje");
  return (
    <main className="mx-auto max-w-md px-4 py-10 md:py-20">
      <p className="text-sm uppercase tracking-[.2em] text-muted">Sintonia</p>
      <h1 className="font-display mt-2 text-4xl leading-tight">Vamos entrar em sintonia com ela</h1>
      <p className="mt-2 text-muted">Leva 1 minuto. Você pode ajustar tudo depois.</p>
      <form action={saveOnboarding} className="mt-8 space-y-6">
        <PartnerFields />
        <label className="block text-sm text-muted">Primeiro dia da última menstruação
          <input type="date" name="lastPeriod" required max={todayIn(user.timezone)} className="field mt-1" />
        </label>
        <button className="btn w-full">Começar</button>
      </form>
    </main>
  );
}
