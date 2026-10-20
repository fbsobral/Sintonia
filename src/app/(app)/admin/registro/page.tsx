import Link from "next/link";
import { db } from "@/lib/db";
import { dt } from "@/lib/format";

const PAGE = 50;
const NAMES: Record<string, string> = {
  "admin.grant": "Concedeu admin", "admin.revoke": "Removeu admin", "user.suspend": "Suspendeu conta", "user.unsuspend": "Reativou conta",
  "user.reset_onboarding": "Refez cadastro", "user.leave_couple": "Removeu do casal", "user.resend_daily": "Reenviou o resumo",
  "user.resend_daily_skipped": "Resumo não enviado", "user.delete": "Excluiu conta", "couple.revoke_invites": "Revogou convites", "couple.delete": "Excluiu casal",
};

export default async function Registro({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const page = Math.max(1, Number((await searchParams).p) || 1);
  const [total, logs] = await Promise.all([db.adminLog.count(), db.adminLog.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE })]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return (
    <>
      <header>
        <h1 className="font-display text-4xl">Registro</h1>
        <p className="mt-1 text-sm text-muted">Tudo o que foi feito no painel, com quem fez e quando.</p>
      </header>
      <section className="card overflow-hidden">
        <ul className="divide-y divide-line">
          {logs.map((l) => (
            <li key={l.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{NAMES[l.action] ?? l.action}{l.targetLabel ? <span className="font-normal text-muted"> · {l.targetLabel}</span> : null}</span>
                <span className="text-xs text-muted">{dt(l.createdAt)}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">por {l.adminEmail}{l.meta ? ` · ${l.meta}` : ""}</p>
            </li>
          ))}
          {logs.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted">Nenhuma ação registrada ainda.</li>}
        </ul>
      </section>
      {pages > 1 && (
        <nav className="flex items-center justify-between text-sm" aria-label="Paginação">
          {page > 1 ? <Link href={`/admin/registro?p=${page - 1}`} className="btn btn-ghost min-h-[44px] px-5">← Anterior</Link> : <span />}
          <span className="text-muted">Página {page} de {pages}</span>
          {page < pages ? <Link href={`/admin/registro?p=${page + 1}`} className="btn btn-ghost min-h-[44px] px-5">Próxima →</Link> : <span />}
        </nav>
      )}
    </>
  );
}
