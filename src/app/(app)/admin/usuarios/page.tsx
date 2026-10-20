import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { dt } from "@/lib/format";
import { isEnvAdmin } from "@/lib/admin-config";

const PAGE = 25;
type SP = { q?: string; papel?: string; status?: string; p?: string; ok?: string };

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "ok" | "warn" | "rose" | "accent" }) {
  const t = { muted: "bg-white/8 text-muted", ok: "bg-emerald-400/15 text-emerald-300", warn: "bg-amber-300/15 text-amber-200", rose: "bg-rose/15 text-rose", accent: "bg-accent/20 text-accent" }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${t}`}>{children}</span>;
}

export default async function Usuarios({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.p) || 1);

  const where: Prisma.UserWhereInput = {};
  if (q) where.OR = [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }];
  if (sp.papel === "CYCLE" || sp.papel === "PARTNER") where.role = sp.papel;
  if (sp.papel === "none") where.role = null;
  if (sp.status === "incompleto") where.onboardedAt = null;
  if (sp.status === "suspenso") where.suspendedAt = { not: null };
  if (sp.status === "admin") where.isAdmin = true;

  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { couple: { select: { id: true, _count: { select: { users: true } } } } } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const href = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (sp.papel) u.set("papel", sp.papel);
    if (sp.status) u.set("status", sp.status);
    if (p > 1) u.set("p", String(p));
    return `/admin/usuarios${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <header>
        <h1 className="font-display text-4xl">Usuários</h1>
        <p className="mt-1 text-sm text-muted">{total} {total === 1 ? "usuário" : "usuários"}{q ? ` para “${q}”` : ""}</p>
        {sp.ok === "excluido" && <p role="status" className="mt-3 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">Usuário excluído.</p>}
      </header>

      <form className="card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto]" role="search">
        <input name="q" defaultValue={q} placeholder="Buscar por e-mail ou nome" className="field" aria-label="Buscar" />
        <select name="papel" defaultValue={sp.papel ?? ""} className="field md:w-44" aria-label="Papel">
          <option value="">Todos os papéis</option><option value="CYCLE">Quem menstrua</option><option value="PARTNER">Parceiro(a)</option><option value="none">Sem papel</option>
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className="field md:w-44" aria-label="Situação">
          <option value="">Qualquer situação</option><option value="incompleto">Cadastro incompleto</option><option value="suspenso">Suspensos</option><option value="admin">Admins</option>
        </select>
        <button className="btn min-h-[52px] px-6">Filtrar</button>
      </form>

      <section className="card overflow-hidden">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 border-b border-line px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted md:grid">
          <span>Usuário</span><span>Papel</span><span>Casal</span><span>Cadastro</span><span>Situação</span>
        </div>
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.id}>
              <Link href={`/admin/usuarios/${u.id}`} className="grid gap-1 px-5 py-4 transition hover:bg-white/5 md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] md:items-center md:gap-4">
                <span className="min-w-0"><span className="block truncate font-medium">{u.name || "Sem nome"}</span><span className="block truncate text-xs text-muted">{u.email}</span></span>
                <span className="text-sm text-muted">{u.role === "CYCLE" ? "Quem menstrua" : u.role === "PARTNER" ? "Parceiro(a)" : "Sem papel"}</span>
                <span className="text-sm text-muted">{u.couple ? `${u.couple._count.users} ${u.couple._count.users > 1 ? "pessoas" : "pessoa"}` : "Sem casal"}</span>
                <span className="text-xs text-muted">{dt(u.createdAt)}</span>
                <span className="flex flex-wrap gap-1.5">
                  {u.suspendedAt ? <Badge tone="rose">Suspenso</Badge> : u.onboardedAt ? <Badge tone="ok">Ativo</Badge> : <Badge tone="warn">Incompleto</Badge>}
                  {(u.isAdmin || isEnvAdmin(u.email)) && <Badge tone="accent">Admin</Badge>}
                </span>
              </Link>
            </li>
          ))}
          {users.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted">Nenhum usuário encontrado.</li>}
        </ul>
      </section>

      {pages > 1 && (
        <nav className="flex items-center justify-between text-sm" aria-label="Paginação">
          {page > 1 ? <Link href={href(page - 1)} className="btn btn-ghost min-h-[44px] px-5">← Anterior</Link> : <span />}
          <span className="text-muted">Página {page} de {pages}</span>
          {page < pages ? <Link href={href(page + 1)} className="btn btn-ghost min-h-[44px] px-5">Próxima →</Link> : <span />}
        </nav>
      )}
    </>
  );
}
