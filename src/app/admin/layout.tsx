import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/AdminNav";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-[max(env(safe-area-inset-top),1.25rem)] md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo size={26} />
          <span className="rounded-full border border-rose/40 bg-rose/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose">Admin</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="hidden sm:inline">{admin.email}</span>
          <Link href="/hoje" className="rounded-full border border-line bg-white/5 px-4 py-2 hover:bg-white/10">Voltar ao app</Link>
        </div>
      </header>
      <div className="mt-5"><AdminNav /></div>
      <main className="mt-6 space-y-5">{children}</main>
      <p className="mt-10 text-center text-xs text-muted">O painel mostra só metadados. Datas de ciclo, check-ins e anotações pessoais não são exibidos.</p>
    </div>
  );
}
