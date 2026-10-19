import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const FEATURES = [
  ["Saiba em que fase ela está", "Menstruação, folicular, ovulatória ou lútea, calculadas pela média real dos ciclos dela."],
  ["Dica e papo para cada dia", "O que fazer, o que evitar e uma frase pronta para abrir a conversa."],
  ["E-mail toda manhã", "Um resumo curto para você começar o dia sabendo como conduzir."],
  ["Signo e mapa astral", "Sol, Lua, Vênus e Marte dela, com o que isso diz sobre como ama e como se emociona."],
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/hoje");
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),2rem)]">
      <p className="rise text-sm uppercase tracking-[.25em] text-muted">Sintonia</p>
      <h1 className="rise font-display mt-6 text-[2.8rem] leading-[1.05]">Entenda o momento dela. Esteja em <em className="text-accent">sintonia</em>.</h1>
      <p className="rise mt-4 text-lg text-muted">O app para quem quer menos conflito e mais presença na relação.</p>
      <div className="rise mt-8 flex flex-col gap-3">
        <Link href="/sign-up" className="btn">Começar grátis</Link>
        <Link href="/sign-in" className="btn btn-ghost">Já tenho conta</Link>
      </div>
      <ul className="mt-12 space-y-3">
        {FEATURES.map(([t, d]) => (
          <li key={t} className="card rise p-5"><h2 className="font-display text-xl">{t}</h2><p className="mt-1 text-muted">{d}</p></li>
        ))}
      </ul>
    </main>
  );
}
