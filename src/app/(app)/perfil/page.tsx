import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { requireCouple } from "@/lib/session";
import { leaveCouple, removePartner, sendTestEmail, setShare, updateMe, updatePartner, updateSettings } from "@/app/actions";
import { PartnerFields } from "@/components/PartnerFields";
import { InviteCard } from "@/components/InviteCard";
import { Icon } from "@/components/Icon";
import { fmt } from "@/lib/format";

export const metadata = { title: "Perfil" };

const MODE = { D28: "28 dias", D31: "31 dias", IRREGULAR: "Irregular" } as const;

export default async function Perfil() {
  const { user, couple, partner, viewer, other, herUser, isAdmin } = await requireCouple();
  const her = viewer === "her";
  const role = her ? "PARTNER" : "CYCLE";
  const pending = other
    ? null
    : await db.invite.findFirst({
        where: { coupleId: couple.id, role, acceptedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
        select: { id: true, token: true, email: true },
      });
  const herEditable = her || !herUser; // depois que ela entra, os dados do ciclo são dela
  const otherName = other?.name || (her ? "seu parceiro" : partner.name);
  const partnerValues = {
    name: partner.name, birthDate: partner.birthDate.toISOString().slice(0, 10), birthTime: partner.birthTime,
    cycleMode: partner.cycleMode, periodLength: partner.periodLength,
  };

  return (
    <main className="space-y-5">
      <header className="rise flex items-center justify-between">
        <div>
          <p className="eyebrow">Conta</p>
          <h1 className="font-display mt-1 text-4xl">Perfil</h1>
        </div>
        <UserButton />
      </header>

      {isAdmin && (
        <Link href="/admin" className="rise card flex items-center justify-between gap-3 p-4 transition hover:bg-white/10">
          <span className="text-[15px]"><b>Painel admin</b><span className="block text-sm text-muted">Gerenciar usuários, casais e ver o registro de ações.</span></span>
          <Icon name="arrow" className="shrink-0 text-accent" />
        </Link>
      )}

      {/* Casal */}
      <section id="casal" className="rise card scroll-mt-6 p-5 md:p-6">
        <h2 className="font-display text-xl">Casal</h2>
        <ul className="mt-3 divide-y divide-line">
          {[user, ...(other ? [other] : [])].map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 py-3">
              <span>
                <span className="block font-medium">{u.id === user.id ? "Você" : u.name || (u.role === "CYCLE" ? partner.name : "Parceiro")}{u.name && u.id === user.id ? ` (${u.name})` : ""}</span>
                <span className="text-xs text-muted">{u.role === "CYCLE" ? "Acompanha o próprio ciclo" : "Acompanha o ciclo da parceira"}</span>
              </span>
              {u.id !== user.id && <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">conectado</span>}
            </li>
          ))}
          {!other && <li className="py-3 text-sm text-muted">{her ? "Seu parceiro ainda não entrou." : `${partner.name} ainda não entrou. Convide para ela acompanhar o próprio ciclo.`}</li>}
        </ul>
      </section>

      {!other && <InviteCard pending={pending} forPartner={her} />}

      {/* Privacidade (só quem menstrua controla) */}
      {her && (
        <section id="compartilhamento" className="rise card scroll-mt-6 p-5 md:p-6">
          <h2 className="font-display flex items-center gap-2 text-xl"><Icon name="lock" size={18} className="text-accent" />Privacidade</h2>
          <p className="mt-1 text-sm text-muted">Os dados do ciclo são seus. Você decide se {otherName} os vê.</p>
          <form action={setShare} className="mt-4 space-y-4">
            <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white/5 px-4">
              <input type="checkbox" name="shareCycle" defaultChecked={couple.shareCycle} className="h-5 w-5 accent-[#b9a8ff]" />
              <span className="text-[15px]">Compartilhar o meu ciclo com {otherName}</span>
            </label>
            <ul className="space-y-2 text-sm leading-relaxed text-muted">
              <li><b className="text-ink">Quando ligado, ele vê:</b> a sua fase e as previsões, as menstruações registradas, o seu check-in e os sinais que você enviar.</li>
              <li><b className="text-ink">Nunca compartilhado:</b> as anotações pessoais do check-in.</li>
              <li><b className="text-ink">Quando pausado:</b> ele deixa de ver o ciclo e de receber o resumo diário, sem ser removido do casal.</li>
            </ul>
            <button className="btn btn-ghost w-full sm:w-auto">Salvar</button>
          </form>
          {other && (
            <details className="mt-5 rounded-2xl bg-white/5 px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium">Remover o acesso de {otherName}</summary>
              <p className="mt-2 text-sm text-muted">Ele deixa de fazer parte do casal e perde o acesso aos seus dados. Você pode convidar a mesma pessoa de novo depois.</p>
              <form action={removePartner} className="mt-3"><button className="btn btn-ghost min-h-[44px] px-5">Remover acesso</button></form>
            </details>
          )}
        </section>
      )}

      {/* Dados */}
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        {her ? (
          <section id="voce" className="rise card flex scroll-mt-6 flex-col p-5 md:p-6 lg:col-span-2">
            <h2 className="font-display text-xl">Seus dados e seu ciclo</h2>
            <p className="text-sm text-muted">Nascimento, ritmo do ciclo e duração da menstruação.</p>
            <form action={updatePartner} className="mt-4 flex flex-1 flex-col gap-5">
              <PartnerFields v={partnerValues} />
              <button className="btn mt-auto w-full sm:w-auto">Salvar</button>
            </form>
          </section>
        ) : (
          <>
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
              {herEditable ? (
                <>
                  <p className="text-sm text-muted">Nascimento, ritmo do ciclo e duração da menstruação. Quando ela entrar, esses dados passam a ser dela.</p>
                  <form action={updatePartner} className="mt-4 flex flex-1 flex-col gap-5">
                    <PartnerFields v={partnerValues} />
                    <button className="btn mt-auto w-full">Salvar</button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">{partner.name} mantém esses dados. Se algo estiver diferente, ela ajusta por lá.</p>
                  <dl className="mt-4 space-y-2 text-[15px]">
                    <div className="flex justify-between gap-4"><dt className="text-muted">Nome</dt><dd>{partner.name}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted">Nascimento</dt><dd>{fmt(partnerValues.birthDate, { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted">Ritmo do ciclo</dt><dd>{MODE[partner.cycleMode]}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted">Menstruação</dt><dd>{partner.periodLength} dias</dd></div>
                  </dl>
                </>
              )}
            </section>
          </>
        )}
      </div>

      {/* E-mails */}
      <section className="rise card p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-xl">E-mails</h2>
            <p className="text-sm text-muted">Resumo diário enviado para {user.email || "seu e-mail"} {her ? "com a sua fase, o que ajuda e o que você pode pedir." : "com a fase do ciclo, o que ajuda e o que evitar."}</p>
          </div>
          <form action={sendTestEmail}><button className="btn btn-ghost w-full sm:w-auto">Enviar e-mail de teste</button></form>
        </div>
        <form action={updateSettings} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-line bg-white/5 px-4">
            <input type="checkbox" name="emailDaily" defaultChecked={user.emailDaily} className="h-5 w-5 accent-[#b9a8ff]" />
            <span>Receber o resumo todo dia</span>
          </label>
          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-line bg-white/5 px-4">
            <input type="checkbox" name="notifyEvents" defaultChecked={user.notifyEvents} className="h-5 w-5 accent-[#b9a8ff]" />
            <span>{her ? "Avisar quando meu parceiro registrar algo" : "Avisar quando ela registrar ou enviar um sinal"}</span>
          </label>
          <label className="block text-sm text-muted">Horário
            <select name="sendHour" defaultValue={user.sendHour} className="field mt-1">
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </select>
          </label>
          <label className="block text-sm text-muted">Fuso horário
            <input name="timezone" defaultValue={user.timezone} className="field mt-1" />
          </label>
          <button className="btn md:col-span-2 md:w-fit md:px-8">Salvar</button>
        </form>
      </section>

      {/* Sair do casal */}
      <section className="rise card p-5 md:p-6">
        <details>
          <summary className="cursor-pointer text-sm font-medium text-muted">Sair do casal</summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Você deixa de ver os dados compartilhados e volta ao início do cadastro.{" "}
            {her ? "Se quiser, apague também os seus registros de ciclo, check-ins e sinais." : "Os dados dela continuam com ela."}
          </p>
          <form action={leaveCouple} className="mt-3 space-y-3">
            {her && (
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="deleteData" className="h-5 w-5 accent-[#b9a8ff]" />
                <span>Apagar meus registros, check-ins e sinais</span>
              </label>
            )}
            <button className="btn btn-ghost min-h-[44px] px-5">Sair do casal</button>
          </form>
        </details>
      </section>
    </main>
  );
}
