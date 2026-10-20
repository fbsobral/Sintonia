import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/AdminNav";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

/** Dentro do layout do app: o menu principal continua visível. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <main className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-rose/40 bg-rose/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose">Admin</span>
        <span className="truncate text-sm text-muted">{admin.email}</span>
      </div>
      <AdminNav />
      <div className="space-y-5">{children}</div>
      <p className="pt-4 text-center text-xs text-muted">O painel mostra só metadados. Datas de ciclo, check-ins e anotações pessoais não são exibidos.</p>
    </main>
  );
}
