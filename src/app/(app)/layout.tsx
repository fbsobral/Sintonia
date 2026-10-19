import Link from "next/link";
import { TabBar } from "@/components/TabBar";
import { Logo } from "@/components/Logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-safe mx-auto w-full max-w-md px-4 pt-[max(env(safe-area-inset-top),1.25rem)] md:max-w-none md:pb-12 md:pl-72 md:pr-8 md:pt-10">
      <Link href="/hoje" aria-label="Sintonia" className="mb-5 flex md:hidden"><Logo size={26} /></Link>
      <div className="mx-auto w-full md:max-w-5xl">{children}</div>
      <TabBar />
    </div>
  );
}
