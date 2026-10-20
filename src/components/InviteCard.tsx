import { createInvite, revokeInvite, sendInviteEmail } from "@/app/actions";
import { inviteUrl } from "@/lib/notify";
import { CopyButton } from "./CopyButton";

type Pending = { id: string; token: string; email: string | null } | null;

/** Convite para a outra pessoa do casal: link, WhatsApp e e-mail. */
export function InviteCard({ pending, forPartner }: { pending: Pending; forPartner: boolean }) {
  const url = pending ? inviteUrl(pending.token) : "";
  const wa = `https://wa.me/?text=${encodeURIComponent(forPartner ? `Quero usar o Sintonia com você. Aqui está o convite: ${url}` : `Convidei você para o Sintonia, onde acompanhamos o ciclo juntos. Aceite por aqui: ${url}`)}`;
  return (
    <section className="rise card p-5 md:p-6">
      <h2 className="font-display text-xl">{forPartner ? "Convidar meu parceiro" : "Convidar minha parceira"}</h2>
      <p className="mt-1 text-sm text-muted">O convite vale por 14 dias e serve para uma pessoa. Quem aceitar entra no seu casal e passa a ver os dados compartilhados.</p>

      {!pending ? (
        <form action={createInvite} className="mt-4"><button className="btn w-full sm:w-auto">Gerar link de convite</button></form>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input readOnly value={url} aria-label="Link do convite" className="field flex-1 text-sm" onFocus={undefined} />
            <CopyButton text={url} />
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-[48px] px-5">Enviar por WhatsApp</a>
            <form action={revokeInvite}>
              <input type="hidden" name="id" value={pending.id} />
              <button className="btn btn-ghost min-h-[48px] px-5">Cancelar convite</button>
            </form>
          </div>
          <form action={sendInviteEmail} className="flex flex-col gap-2 sm:flex-row">
            <input type="email" name="email" required defaultValue={pending.email ?? ""} placeholder="E-mail da pessoa convidada" className="field flex-1" autoComplete="off" />
            <button className="btn min-h-[48px] px-6">Enviar por e-mail</button>
          </form>
          {pending.email && <p className="text-xs text-muted">Último e-mail enviado para {pending.email}.</p>}
        </div>
      )}
    </section>
  );
}
