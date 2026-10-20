import Link from "next/link";
import { db } from "@/lib/db";
import { requireCouple } from "@/lib/session";
import { InviteCard } from "@/components/InviteCard";
import { redirect } from "next/navigation";

export const metadata = { title: "Convidar" };

export default async function Convidar({ searchParams }: { searchParams: Promise<{ novo?: string }> }) {
  const { couple, viewer, other } = await requireCouple();
  const { novo } = await searchParams;
  if (other) redirect("/hoje");
  const role = viewer === "her" ? "PARTNER" : "CYCLE";
  const pending = await db.invite.findFirst({
    where: { coupleId: couple.id, role, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { id: true, token: true, email: true },
  });
  const her = viewer === "her";
  return (
    <main className="space-y-5">
      <header className="rise">
        <p className="eyebrow">{novo ? "Tudo pronto" : "Casal"}</p>
        <h1 className="font-display mt-1 text-4xl">{her ? "Convide seu parceiro" : "Convide sua parceira"}</h1>
        <p className="mt-2 max-w-xl text-muted">
          {her
            ? "Ele passa a entender o seu ciclo, recebe orientações para o dia a dia e vê o que você deixar compartilhado. Você controla tudo em Perfil e pode pausar quando quiser."
            : "Ela passa a acompanhar o próprio ciclo em primeira pessoa, corrige o que estiver diferente e decide o que compartilha com você. O que um registrar aparece para o outro."}
        </p>
      </header>

      <InviteCard pending={pending} forPartner={her} />

      <section className="rise card p-5 md:p-6">
        <h2 className="font-display text-xl">O que muda quando {her ? "ele entra" : "ela entra"}</h2>
        <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-muted">
          <li>As menstruações registradas por um aparecem para o outro, e as previsões se atualizam para os dois.</li>
          <li>{her ? "Você escolhe se ele vê o seu ciclo, e pode pausar o acesso a qualquer momento." : "Ela escolhe se você vê o ciclo dela, e pode pausar o acesso a qualquer momento."}</li>
          <li>{her ? "Você pode enviar sinais a ele (“preciso de espaço”, “preciso de ajuda”) e fazer um check-in diário." : "Se ela usar check-ins e sinais, você vê o que ela deixar liberado e recebe orientações do que fazer."}</li>
          <li>Cada um recebe o resumo diário por e-mail na própria perspectiva.</li>
        </ul>
      </section>

      <div className="rise text-center"><Link href="/hoje" className="text-sm text-muted underline underline-offset-4">Fazer isso depois</Link></div>
    </main>
  );
}
