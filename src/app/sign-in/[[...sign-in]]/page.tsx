import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Stars } from "@/components/Orbit";
export default function Page() {
  return <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <Stars />
      <Link href="/" aria-label="Sintonia"><Logo size={34} /></Link>
      <SignIn forceRedirectUrl="/hoje" /></main>;
}
