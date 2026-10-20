import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Stars } from "@/components/Orbit";

export default async function Page({ searchParams }: { searchParams: Promise<{ role?: string; convite?: string }> }) {
  const { role, convite } = await searchParams;
  const safe = convite && /^[\w-]{10,64}$/.test(convite) ? convite : null;
  const after = safe ? `/convite/${safe}` : role === "cycle" || role === "partner" ? `/onboarding?role=${role}` : "/onboarding";
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <Stars />
      <Link href="/" aria-label="Sintonia"><Logo size={34} /></Link>
      <SignUp forceRedirectUrl={after} signInForceRedirectUrl={safe ? `/convite/${safe}` : "/hoje"} />
    </main>
  );
}
