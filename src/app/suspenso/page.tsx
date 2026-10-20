import { SignOutButton } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import { Stars } from "@/components/Orbit";

export const metadata = { title: "Conta suspensa" };

export default function Suspenso() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center">
      <Stars />
      <div className="relative z-10">
        <div className="mb-8 flex justify-center"><Logo size={32} /></div>
        <h1 className="font-display text-3xl">Conta suspensa</h1>
        <p className="mt-3 text-muted">O acesso a esta conta foi suspenso. Se você acha que foi um engano, fale com quem administra o Sintonia.</p>
        <div className="mt-6"><SignOutButton redirectUrl="/"><button className="btn btn-ghost">Sair</button></SignOutButton></div>
      </div>
    </main>
  );
}
