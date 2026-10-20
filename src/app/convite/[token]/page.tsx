import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { acceptInvite } from "@/app/actions";
import { Logo } from "@/components/Logo";
import { Stars } from "@/components/Orbit";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Convite" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalido: "Este convite expirou ou já foi usado.",
  "ja-vinculado": "Sua conta já faz parte de outro casal. Saia do casal atual em Perfil para aceitar este convite.",
  ocupado: "Este casal já tem uma pessoa nesse papel.",
};

export default async function Convite({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ erro?: string }> }) {
  const { token } = await params;
  const { erro } = await searchParams;
  const inv = await db.invite.findUnique({ where: { token }, include: { couple: { include: { users: true, profile: true } } } });
  const valid = !!inv && !inv.acceptedAt && inv.expiresAt > new Date();
  const { userId } = await auth();

  const shell = (children: React.ReactNode) => (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <Stars />
      <div className="relative z-10">
        <Link href="/" aria-label="Sintonia" className="mb-8 flex justify-center"><Logo size={32} /></Link>
        {children}
      </div>
    </main>
  );

  if (!valid || !inv) {
    return shell(
      <div className="card rise p-6 text-center">
        <h1 className="font-display text-2xl">Convite indisponível</h1>
        <p className="mt-2 text-muted">{ERRORS[erro ?? "invalido"] ?? ERRORS.invalido}</p>
        <Link href="/" className="btn mt-6">Ir para o início</Link>
      </div>,
    );
  }

  const inviter = inv.couple.users.find((u) => u.id === inv.invitedById);
  const inviterName = inviter?.name || (inv.role === "CYCLE" ? "Seu parceiro" : inv.couple.profile?.name) || "Alguém";
  const toHer = inv.role === "CYCLE";
  const points = toHer
    ? [
        "Você acompanha o seu ciclo em primeira pessoa: em que fase está, o que costuma acontecer no corpo e o que pode ajudar.",
        "O que você registrar aparece para ele, e o que ele registrar aparece para você.",
        "Você decide o que é compartilhado e pode pausar a qualquer momento. As suas anotações pessoais nunca são mostradas.",
      ]
    : [
        "Você entende o que acontece em cada fase do ciclo dela e recebe orientações para o dia a dia.",
        "O que um registrar aparece para o outro, e as previsões se atualizam para os dois.",
        "Ela decide o que compartilha e pode pausar o acesso a qualquer momento.",
      ];

  return shell(
    <div className="rise">
      <p className="eyebrow text-center">Convite para o Sintonia</p>
      <h1 className="font-display mt-3 text-center text-[2.2rem] leading-[1.08]"><span className="text-grad">{inviterName}</span> convidou você</h1>
      <p className="mt-3 text-center text-muted">{toHer ? "Para acompanharem juntos o seu ciclo." : "Para acompanharem juntos o ciclo dela."}</p>

      <ul className="card mt-7 space-y-3 p-5 text-[15px] leading-relaxed">
        {points.map((t) => (
          <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{t}</span></li>
        ))}
      </ul>

      {erro && <p role="alert" className="mt-4 rounded-xl bg-rose-400/10 p-3 text-center text-sm text-rose-200">{ERRORS[erro] ?? ERRORS.invalido}</p>}

      <div className="mt-6 space-y-3">
        {userId ? (
          <form action={acceptInvite}>
            <input type="hidden" name="token" value={token} />
            <button className="btn w-full">Aceitar convite</button>
          </form>
        ) : (
          <>
            <Link href={`/sign-up?convite=${token}`} className="btn w-full">Criar conta e aceitar</Link>
            <Link href={`/sign-in?convite=${token}`} className="btn btn-ghost w-full">Já tenho conta</Link>
          </>
        )}
      </div>
      <p className="mt-5 text-center text-xs text-muted">Se você não esperava este convite, pode ignorá-lo.</p>
    </div>,
  );
}
