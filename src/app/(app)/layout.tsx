import { TabBar } from "@/components/TabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-safe mx-auto w-full max-w-md px-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
      {children}
      <TabBar />
    </div>
  );
}
