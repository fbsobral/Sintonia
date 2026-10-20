"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Visão geral", exact: true },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/casais", label: "Casais" },
  { href: "/admin/registro", label: "Registro" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {ITEMS.map((i) => {
        const on = i.exact ? path === i.href : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}
            className={`flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-sm font-medium transition ${on ? "bg-white/15 text-ink" : "text-muted hover:bg-white/5 hover:text-ink"}`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
