"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const I = (d: string) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
const TABS = [
  { href: "/hoje", label: "Hoje", icon: I("M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z") },
  { href: "/ciclos", label: "Ciclos", icon: I("M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z") },
  { href: "/astro", label: "Astro", icon: I("M12 3l2.4 5.6L20 9.3l-4.2 3.9 1.2 5.8L12 16l-5 3 1.2-5.8L4 9.3l5.6-.7L12 3z") },
  { href: "/perfil", label: "Perfil", icon: I("M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0") },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#120f26]/90 backdrop-blur-xl" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = path.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link href={t.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${on ? "text-ink" : "text-muted"}`}>
                <span className={`rounded-full px-4 py-1 transition-colors ${on ? "bg-white/10" : ""}`}>{t.icon}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
