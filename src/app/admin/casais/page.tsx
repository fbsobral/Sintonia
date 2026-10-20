import Link from "next/link";
import { db } from "@/lib/db";
import { dt } from "@/lib/format";
import { deleteCouple, revokeCoupleInvites } from "../actions";

const PAGE = 25;

export default async function Casais({ searchParams }: { searchParams: Promise<{ p?: string; ok?: string; erro?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const [total, couples] = await Promise.all([
    db.couple.count(),
    db.couple.findMany({
      orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE,
      include: { users: true, profile: { include: { _count: { select: { cycles: true } } } }, _count: { select: { checkIns: true, signals: true } }, invites: { where: { acceptedAt: null, expiresAt: { gt: new Date() } }, select: { id: true } } },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <>
      <header>
        <h1 className="font-display text-4xl">Casais</h1>
        <p className="mt-1 text-sm text-muted">{total} {total === 1 ? "casal" : "casais"}</p>
        {sp.ok === "excluido" && <p role="status" className="mt-3 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">Casal excluído.</p>}
        {sp.erro === "confirmacao" && <p role="alert" className="mt-3 rounded-xl bg-rose/10 p-3 text-sm text-rose">Digite EXCLUIR para confirmar.</p>}
      </header>

      <ul className="space-y-3">
        {couples.map((c) => (
          <li key={c.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{c.profile?.name ?? "Sem perfil"}</p>
                <p className="text-xs text-muted">Criado em {dt(c.createdAt)} · <code>{c.id.slice(0, 10)}</code></p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.shareCycle ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-300/15 text-amber-200"}`}>{c.shareCycle ? "Compartilhando" : "Compartilhamento pausado"}</span>
            </div>
            <ul className="mt-3 divide-y divide-line text-[15px]">
              {c.users.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2"><Link href={`/admin/usuarios/${m.id}`} className="min-w-0 truncate hover:text-accent">{m.name || m.email}</Link><span className="shrink-0 text-xs text-muted">{m.role === "CYCLE" ? "Quem menstrua" : "Parceiro(a)"}</span></li>
              ))}
              {c.users.length === 0 && <li className="py-2 text-sm text-muted">Sem usuários vinculados.</li>}
            </ul>
            <p className="mt-3 text-sm text-muted">{c.profile?._count.cycles ?? 0} ciclos · {c._count.checkIns} check-ins · {c._count.signals} sinais · {c.invites.length} convite(s) pendente(s)</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {c.invites.length > 0 && (
                <form action={revokeCoupleInvites}><input type="hidden" name="coupleId" value={c.id} /><button className="btn btn-ghost min-h-[44px] px-5 text-sm">Revogar convites</button></form>
              )}
              <details className="min-w-0 flex-1">
                <summary className="cursor-pointer text-sm text-rose">Excluir casal</summary>
                <form action={deleteCouple} className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="coupleId" value={c.id} />
                  <input name="confirm" required placeholder="Digite EXCLUIR" className="field flex-1" autoComplete="off" />
                  <button className="btn min-h-[52px] px-6" style={{ background: "var(--rose)", color: "#1a0a12" }}>Excluir</button>
                </form>
                <p className="mt-2 text-xs text-muted">Apaga ciclos, check-ins, sinais e convites. As contas continuam, voltando ao cadastro.</p>
              </details>
            </div>
          </li>
        ))}
        {couples.length === 0 && <li className="card p-6 text-center text-sm text-muted">Nenhum casal ainda.</li>}
      </ul>

      {pages > 1 && (
        <nav className="flex items-center justify-between text-sm" aria-label="Paginação">
          {page > 1 ? <Link href={`/admin/casais?p=${page - 1}`} className="btn btn-ghost min-h-[44px] px-5">← Anterior</Link> : <span />}
          <span className="text-muted">Página {page} de {pages}</span>
          {page < pages ? <Link href={`/admin/casais?p=${page + 1}`} className="btn btn-ghost min-h-[44px] px-5">Próxima →</Link> : <span />}
        </nav>
      )}
    </>
  );
}
