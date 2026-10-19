import { UserButton } from "@clerk/nextjs";
import { requirePartner } from "@/lib/session";
import { sendTestEmail, updateMe, updatePartner, updateSettings } from "@/app/actions";
import { PartnerFields } from "@/components/PartnerFields";

export const metadata = { title: "Perfil" };

export default async function Perfil() {
  const { user, partner } = await requirePartner();
  return (
    <main className="space-y-5">
      <header className="rise flex items-center justify-between">
        <div>
          <p className="eyebrow">Conta</p>
          <h1 className="font-display mt-1 text-4xl">Perfil</h1>
        </div>
        <UserButton />
      </header>

      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <section id="voce" className="rise card flex scroll-mt-6 flex-col p-5 md:p-6">
          <h2 className="font-display text-xl">Seus dados</h2>
          <p className="text-sm text-muted">Para calcular o seu mapa e a compatibilidade entre vocês.</p>
          <form action={updateMe} className="mt-4 flex flex-1 flex-col gap-4">
            <label className="block text-sm text-muted">Seu nome
              <input name="myName" defaultValue={user.name ?? ""} maxLength={60} className="field mt-1" />
            </label>
            <label className="block text-sm text-muted">Data de nascimento
              <input type="date" name="myBirthDate" defaultValue={user.birthDate?.toISOString().slice(0, 10) ?? ""} className="field mt-1" />
            </label>
            <label className="block text-sm text-muted">Hora de nascimento <span className="opacity-70">(opcional)</span>
              <input type="time" name="myBirthTime" defaultValue={user.birthTime ?? ""} className="field mt-1" />
            </label>
            <button className="btn mt-auto w-full">Salvar</button>
          </form>
        </section>

        <section className="rise card flex flex-col p-5 md:p-6">
          <h2 className="font-display text-xl">Dados dela</h2>
          <p className="text-sm text-muted">Nascimento, ritmo do ciclo e duração da menstruação.</p>
          <form action={updatePartner} className="mt-4 flex flex-1 flex-col gap-5">
            <PartnerFields v={{ name: partner.name, birthDate: partner.birthDate.toISOString().slice(0, 10), birthTime: partner.birthTime, cycleMode: partner.cycleMode, periodLength: partner.periodLength }} />
            <button className="btn mt-auto w-full">Salvar</button>
          </form>
        </section>
      </div>

      <section className="rise card p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-xl">E-mail diário</h2>
            <p className="text-sm text-muted">Resumo enviado para {user.email || "seu e-mail"} com a fase do ciclo, o que ajuda e o que evitar.</p>
          </div>
          <form action={sendTestEmail}><button className="btn btn-ghost w-full sm:w-auto">Enviar e-mail de teste</button></form>
        </div>
        <form action={updateSettings} className="mt-5 grid gap-4 md:grid-cols-[auto_1fr_1fr_auto] md:items-end">
          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-line bg-white/5 px-4">
            <input type="checkbox" name="emailDaily" defaultChecked={user.emailDaily} className="h-5 w-5 accent-[#b9a8ff]" />
            <span>Receber todo dia</span>
          </label>
          <label className="block text-sm text-muted">Horário
            <select name="sendHour" defaultValue={user.sendHour} className="field mt-1">
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </select>
          </label>
          <label className="block text-sm text-muted">Fuso horário
            <input name="timezone" defaultValue={user.timezone} className="field mt-1" />
          </label>
          <button className="btn md:px-8">Salvar</button>
        </form>
      </section>
    </main>
  );
}
