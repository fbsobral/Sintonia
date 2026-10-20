import Link from "next/link";
import { db } from "@/lib/db";
import { dt } from "@/lib/format";

const ago = (days: number) => new Date(Date.now() - days * 86_400_000);

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="font-display mt-1 text-3xl">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function AdminHome() {
  const [users, onboarded, incomplete, couples, pairs, invites, cycles, checkIns7, signals7, suspended, admins, new7, recent, logs] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { onboardedAt: { not: null } } }),
    db.user.count({ where: { onboardedAt: null } }),
    db.couple.count(),
    db.user.groupBy({ by: ["coupleId"], where: { coupleId: { not: null } }, _count: { _all: true } }).then((g) => g.filter((x) => x._count._all >= 2).length),
    db.invite.count({ where: { acceptedAt: null, expiresAt: { gt: new Date() } } }),
    db.cycle.count(),
    db.checkIn.count({ where: { createdAt: { gt: ago(7) } } }),
    db.signal.count({ where: { createdAt: { gt: ago(7) } } }),
    db.user.count({ where: { suspendedAt: { not: null } } }),
    db.user.count({ where: { isAdmin: true } }),
    db.user.count({ where: { createdAt: { gt: ago(7) } } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <>
      <header>
        <h1 className="font-display text-4xl">Visão geral</h1>
        <p className="mt-1 text-sm text-muted">Números de uso e contas recentes.</p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Usuários" value={users} hint={`${new7} nos últimos 7 dias`} />
        <Stat label="Cadastro concluído" value={onboarded} hint={`${incomplete} incompletos`} />
        <Stat label="Casais" value={couples} hint={`${pairs} com os dois conectados`} />
        <Stat label="Convites pendentes" value={invites} />
        <Stat label="Ciclos registrados" value={cycles} />
        <Stat label="Check-ins (7 dias)" value={checkIns7} />
        <Stat label="Sinais (7 dias)" value={signals7} />
        <Stat label="Suspensos / admins" value={`${suspended} / ${admins}`} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl">Cadastros recentes</h2><Link href="/admin/usuarios" className="text-sm text-accent">Ver todos →</Link></div>
          <ul className="mt-3 divide-y divide-line">
            {recent.map((u) => (
              <li key={u.id}>
                <Link href={`/admin/usuarios/${u.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
                  <span className="min-w-0"><span className="block truncate font-medium">{u.name || u.email}</span><span className="block truncate text-xs text-muted">{u.name ? u.email : "sem nome"}</span></span>
                  <span className="shrink-0 text-xs text-muted">{dt(u.createdAt)}</span>
                </Link>
              </li>
            ))}
            {recent.length === 0 && <li className="py-3 text-sm text-muted">Nenhum usuário ainda.</li>}
          </ul>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl">Últimas ações</h2><Link href="/admin/registro" className="text-sm text-accent">Ver registro →</Link></div>
          <ul className="mt-3 divide-y divide-line text-sm">
            {logs.map((l) => (
              <li key={l.id} className="py-3"><span className="font-medium">{l.action}</span>{l.targetLabel ? <span className="text-muted"> · {l.targetLabel}</span> : null}<span className="block text-xs text-muted">{l.adminEmail} · {dt(l.createdAt)}</span></li>
            ))}
            {logs.length === 0 && <li className="py-3 text-muted">Nenhuma ação registrada.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
