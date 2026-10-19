import { TabBar } from "@/components/TabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-safe mx-auto w-full max-w-md px-4 pt-[max(env(safe-area-inset-top),1.25rem)] md:max-w-none md:pb-12 md:pl-72 md:pr-8 md:pt-10">
      <div className="mx-auto w-full md:max-w-5xl">{children}</div>
      <TabBar />
    </div>
  );
}
