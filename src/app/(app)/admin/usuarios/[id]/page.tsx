import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { isEnvAdmin } from "@/lib/admin-config";
import { dt } from "@/lib/format";
import { deleteUser, removeFromCouple, resendDaily, resetOnboarding, setAdmin, setSuspended } from "../../actions";

export default async function UsuarioDetalhe({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> }) {
  const me = await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;
  const u = await db.user.findUnique({
    where: { id },
    include: { couple: { include: { users: true, profile: { include: { _count: { select: { cycles: true } } } }, _count: { select: { checkIns: true, signals: true, invites: true } } } } },
  });
  if (!u) notFound();

  const self = u.id === me.id;
  const envAdmin = isEnvAdmin(u.email);
  const admin = u.isAdmin || envAdmin;
  const c = u.couple;
  const rows: [string, React.ReactNode][] = [
    ["E-mail", u.email],
    ["Nome", u.name || "—"],
    ["Papel", u.role === "CYCLE" ? "Quem menstrua" : u.role === "PARTNER" ? "Parceiro(a)" : "Sem papel"],
    ["Cadastro", u.onboardedAt ? `Concluído em ${dt(u.onboardedAt)}` : "Incompleto"],
    ["Criado em", dt(u.createdAt)],
    ["Resumo diário", `${u.emailDaily ? "ligado" : "desligado"}, às ${String(u.sendHour).padStart(2, "0")}:00 (${u.timezone})`],
    ["Último resumo", u.lastEmailOn ?? "—"],
    ["Avisos do casal", u.notifyEvents ? "ligados" : "desligados"],
    ["ID no Clerk", <code key="c" className="text-xs">{u.clerkId}</code>],
  ];

  const btn = "btn btn-ghost min-h-[44px] px-5 text-sm";
  return (
    <>
      <p><Link href="/admin/usuarios" className="text-sm text-accent">← Usuários</Link></p>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display break-words text-3xl md:text-4xl">{u.name || u.email}</h1>
          <p className="mt-1 text-sm text-muted">{u.name ? u.email : "Sem nome informado"}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {u.suspendedAt ? <span className="rounded-full bg-rose/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose">Suspenso</span> : u.onboardedAt ? <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">Ativo</span> : <span className="rounded-full bg-amber-300/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">Incompleto</span>}
          {admin && <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-semibold text-accent">Admin{envAdmin ? " (ambiente)" : ""}</span>}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-display text-xl">Conta</h2>
          <dl className="mt-3 divide-y divide-line text-[15px]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="shrink-0 text-muted">{k}</dt><dd className="min-w-0 break-words text-right">{v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-xl">Casal</h2>
          {c ? (
            <>
              <ul className="mt-3 divide-y divide-line">
                {c.users.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                    <span className="min-w-0"><Link href={`/admin/usuarios/${m.id}`} className="block truncate hover:text-accent">{m.name || m.email}{m.id === u.id ? " (esta conta)" : ""}</Link><span className="text-xs text-muted">{m.role === "CYCLE" ? "Quem menstrua" : "Parceiro(a)"}</span></span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 text-sm text-muted">
                <div className="flex justify-between"><dt>Compartilhamento</dt><dd>{c.shareCycle ? "ligado" : "pausado por quem menstrua"}</dd></div>
                <div className="flex justify-between"><dt>Ciclos registrados</dt><dd>{c.profile?._count.cycles ?? 0}</dd></div>
                <div className="flex justify-between"><dt>Check-ins / sinais</dt><dd>{c._count.checkIns} / {c._count.signals}</dd></div>
                <div className="flex justify-between"><dt>Convites</dt><dd>{c._count.invites}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-muted">Por privacidade, o painel não mostra datas de ciclo, check-ins nem anotações.</p>
            </>
          ) : <p className="mt-3 text-sm text-muted">Esta conta não faz parte de nenhum casal.</p>}
        </section>
      </div>

      <section className="card p-5">
        <h2 className="font-display text-xl">Ações</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {!self && (
            <form action={setAdmin}>
              <input type="hidden" name="userId" value={u.id} /><input type="hidden" name="value" value={admin && !envAdmin ? "0" : "1"} />
              <button className={btn} disabled={envAdmin} title={envAdmin ? "Definido por ADMIN_EMAILS" : undefined}>{admin ? "Remover admin" : "Tornar admin"}</button>
            </form>
          )}
          {!self && !admin && (
            <form action={setSuspended}>
              <input type="hidden" name="userId" value={u.id} /><input type="hidden" name="value" value={u.suspendedAt ? "0" : "1"} />
              <button className={btn}>{u.suspendedAt ? "Reativar conta" : "Suspender conta"}</button>
            </form>
          )}
          <form action={resendDaily}><input type="hidden" name="userId" value={u.id} /><button className={btn}>Reenviar resumo de hoje</button></form>
          <form action={resetOnboarding}><input type="hidden" name="userId" value={u.id} /><button className={btn}>Refazer cadastro</button></form>
          {c && <form action={removeFromCouple}><input type="hidden" name="userId" value={u.id} /><button className={btn}>Remover do casal</button></form>}
        </div>
        <ul className="mt-4 space-y-1 text-xs text-muted">
          <li>Suspender bloqueia o acesso e o envio de e-mails, e pode ser desfeito.</li>
          <li>Refazer cadastro leva a pessoa de volta ao onboarding na próxima visita, sem apagar nada.</li>
          <li>Remover do casal tira a pessoa do casal; se o casal ficar vazio, os dados dele são apagados.</li>
        </ul>
      </section>

      {!self && (
        <section className="rounded-3xl border border-rose/40 bg-rose/5 p-5">
          <h2 className="font-display text-xl text-rose">Zona de risco</h2>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium">Excluir esta conta</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">Remove a conta do Sintonia e do Clerk. Se for a última pessoa do casal, os dados do casal também são apagados. Não dá para desfazer.</p>
            {erro === "confirmacao" && <p role="alert" className="mt-2 text-sm text-rose">O e-mail digitado não confere.</p>}
            <form action={deleteUser} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="userId" value={u.id} />
              <input name="confirm" required placeholder={`Digite ${u.email} para confirmar`} className="field flex-1" autoComplete="off" />
              <button className="btn min-h-[52px] bg-none px-6" style={{ background: "var(--rose)", color: "#1a0a12" }}>Excluir conta</button>
            </form>
          </details>
        </section>
      )}
    </>
  );
}
