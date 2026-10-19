import { UserButton } from "@clerk/nextjs";
import { requirePartner } from "@/lib/session";
import { sendTestEmail, updatePartner, updateSettings } from "@/app/actions";
import { PartnerFields } from "@/components/PartnerFields";

export const metadata = { title: "Perfil" };

export default async function Perfil() {
  const { user, partner } = await requirePartner();
  return (
    <main className="space-y-5">
      <header className="rise flex items-center justify-between">
        <h1 className="font-display text-3xl">Perfil</h1>
        <UserButton />
      </header>

      <section className="rise card p-5">
        <h2 className="font-display text-xl">E-mail diário</h2>
        <p className="text-sm text-muted">Enviado para {user.email || "seu e-mail"} com o momento dela e como conduzir o dia.</p>
        <form action={updateSettings} className="mt-4 space-y-4">
          <label className="flex min-h-[44px] items-center justify-between">
            <span>Receber todo dia</span>
            <input type="checkbox" name="emailDaily" defaultChecked={user.emailDaily} className="h-6 w-6 accent-[#b9a8ff]" />
          </label>
          <label className="block text-sm text-muted">Horário
            <select name="sendHour" defaultValue={user.sendHour} className="field mt-1">
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </select>
          </label>
          <label className="block text-sm text-muted">Fuso horário
            <input name="timezone" defaultValue={user.timezone} className="field mt-1" />
          </label>
          <button className="btn w-full">Salvar</button>
        </form>
        <form action={sendTestEmail} className="mt-3"><button className="btn btn-ghost w-full">Enviar e-mail de teste agora</button></form>
      </section>

      <section className="rise card p-5">
        <h2 className="font-display text-xl">Dados dela</h2>
        <form action={updatePartner} className="mt-4 space-y-5">
          <PartnerFields v={{ name: partner.name, birthDate: partner.birthDate.toISOString().slice(0, 10), birthTime: partner.birthTime, cycleMode: partner.cycleMode, periodLength: partner.periodLength }} />
          <button className="btn w-full">Salvar alterações</button>
        </form>
      </section>
    </main>
  );
}
