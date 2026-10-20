"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const I = (d: string) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
const TABS = [
  { href: "/hoje", label: "Hoje", icon: I("M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z") },
  { href: "/ciclos", label: "Ciclos", icon: I("M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z") },
  { href: "/astro", label: "Astro", icon: I("M12 3l2.4 5.6L20 9.3l-4.2 3.9 1.2 5.8L12 16l-5 3 1.2-5.8L4 9.3l5.6-.7L12 3z") },
  { href: "/perfil", label: "Perfil", icon: I("M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0") },
];

/** Barra inferior no celular; barra lateral a partir de md. */
const ADMIN_TAB = { href: "/admin", label: "Admin", icon: I("M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4") };

export function TabBar({ isAdmin = false }: { isAdmin?: boolean }) {
  const path = usePathname();
  const tabs = isAdmin ? [...TABS, ADMIN_TAB] : TABS;
  return (
    <nav aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#0d0a20]/85 backdrop-blur-2xl md:inset-y-0 md:right-auto md:w-60 md:border-r md:border-t-0 md:bg-[#120f26]/70 md:px-4 md:py-8"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <Link href="/hoje" aria-label="Sintonia" className="mb-8 hidden px-3 md:block"><Logo size={30} /></Link>
      <ul className="mx-auto flex max-w-md md:max-w-none md:flex-col md:gap-1">
        {tabs.map((t) => {
          const on = path.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1 md:flex-none">
              <Link href={t.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors md:min-h-[48px] md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:text-[15px] md:hover:bg-white/5 ${on ? "text-ink md:bg-gradient-to-r md:from-white/15 md:to-transparent" : "text-muted"}`}>
                <span className={`rounded-full px-4 py-1 transition-colors md:p-0 ${on ? "bg-white/12 shadow-[0_0_24px_-4px_#bfb0ff88] md:bg-transparent md:shadow-none" : ""}`}>{t.icon}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
