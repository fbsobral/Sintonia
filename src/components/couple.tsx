import { ackSignals, saveCheckIn, sendSignal } from "@/app/actions";
import { FLOWS, LIBIDO, MOODS, SIGNALS, SYMPTOMS, TAG_TIPS, type SignalKind } from "@/lib/checkin";
import { Icon } from "./Icon";

type CheckInData = { moods: string[]; symptoms: string[]; flow: string | null; libido: number | null } | null;

const chip =
  "flex min-h-[40px] cursor-pointer items-center rounded-full border border-line bg-white/5 px-3.5 text-sm text-muted transition hover:bg-white/10 peer-checked:border-accent peer-checked:bg-accent/20 peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent";

function Chips({ name, options, selected, type = "checkbox" }: { name: string; options: readonly string[]; selected: string[]; type?: "checkbox" | "radio" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o}>
          <input type={type} name={name} value={o} defaultChecked={selected.includes(o)} className="peer sr-only" />
          <span className={chip}>{o}</span>
        </label>
      ))}
    </div>
  );
}

const tipsFor = (tags: string[], who: "him" | "her") => tags.filter((t) => TAG_TIPS[t]).map((t) => ({ tag: t, tip: TAG_TIPS[t][who] }));

/** Check-in diário (só ela). Mostra, abaixo, o que costuma ajudar com o que ela marcou. */
export function CheckInForm({ data, note, menstrual }: { data: CheckInData; note: string; menstrual: boolean }) {
  const picked = [...(data?.moods ?? []), ...(data?.symptoms ?? []), ...(data?.flow === "Intenso" ? ["Intenso"] : [])];
  const tips = tipsFor(picked, "her");
  return (
    <section className="rise card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="eyebrow flex items-center gap-1.5"><Icon name="heart" size={14} />Como você está hoje</h2>
        {data && <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">salvo</span>}
      </div>
      <form action={saveCheckIn} className="mt-4 space-y-4">
        <fieldset><legend className="mb-2 text-sm text-muted">Humor</legend><Chips name="moods" options={MOODS} selected={data?.moods ?? []} /></fieldset>
        <fieldset><legend className="mb-2 text-sm text-muted">Sintomas</legend><Chips name="symptoms" options={SYMPTOMS} selected={data?.symptoms ?? []} /></fieldset>
        {(menstrual || data?.flow) && <fieldset><legend className="mb-2 text-sm text-muted">Fluxo</legend><Chips name="flow" options={FLOWS} selected={data?.flow ? [data.flow] : []} type="radio" /></fieldset>}
        <fieldset>
          <legend className="mb-2 text-sm text-muted">Desejo</legend>
          <div className="flex flex-wrap gap-2">
            {LIBIDO.map((l, i) => (
              <label key={l}><input type="radio" name="libido" value={i + 1} defaultChecked={data?.libido === i + 1} className="peer sr-only" /><span className={chip}>{l}</span></label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm text-muted">Anotação pessoal <span className="opacity-70">(só você vê, nunca é compartilhada)</span>
          <textarea name="note" defaultValue={note} maxLength={500} rows={2} className="field mt-1.5 resize-none" />
        </label>
        <button className="btn w-full sm:w-auto">Salvar check-in</button>
      </form>
      {tips.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-line pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">O que costuma ajudar</p>
          {tips.map(({ tag, tip }) => <p key={tag} className="text-[15px] leading-relaxed text-muted"><b className="text-ink">{tag}.</b> {tip}</p>)}
        </div>
      )}
    </section>
  );
}

/** O que ela marcou, na visão dele, com a orientação para cada ponto. */
export function CheckInSummary({ name, data }: { name: string; data: NonNullable<CheckInData> }) {
  const tags = [...data.moods, ...data.symptoms, ...(data.flow ? [`Fluxo ${data.flow.toLowerCase()}`] : []), ...(data.libido ? [`Desejo ${LIBIDO[data.libido - 1].toLowerCase()}`] : [])];
  const tips = tipsFor([...data.moods, ...data.symptoms, ...(data.flow === "Intenso" ? ["Intenso"] : [])], "him");
  if (!tags.length) return null;
  return (
    <section className="rise card p-5">
      <h2 className="eyebrow flex items-center gap-1.5"><Icon name="heart" size={14} />Como {name} marcou hoje</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => <span key={t} className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-sm">{t}</span>)}
      </div>
      {tips.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">O que fazer com isso</p>
          {tips.map(({ tag, tip }) => <p key={tag} className="text-[15px] leading-relaxed text-muted"><b className="text-ink">{tag}.</b> {tip}</p>)}
        </div>
      )}
    </section>
  );
}

/** Sinais rápidos dela ao parceiro. */
export function SignalPanel({ sent }: { sent: { id: string; kind: string; createdAt: Date }[] }) {
  return (
    <section className="rise card p-5">
      <h2 className="eyebrow flex items-center gap-1.5"><Icon name="chat" size={14} />Avisar o seu parceiro</h2>
      <p className="mt-2 text-sm text-muted">Um toque e ele recebe o aviso, com uma orientação de como responder. Poupa explicação quando você não está com energia para falar.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(Object.keys(SIGNALS) as SignalKind[]).map((k) => (
          <form key={k} action={sendSignal}>
            <input type="hidden" name="kind" value={k} />
            <button className="btn btn-ghost w-full justify-start px-4 text-left text-[15px]">{SIGNALS[k].her}</button>
          </form>
        ))}
      </div>
      {sent.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm text-muted">
          {sent.map((s) => (
            <li key={s.id}>Enviado às {new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(s.createdAt)}: {SIGNALS[s.kind as SignalKind]?.her ?? s.kind}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Sinais recebidos (visão dele), com a orientação de como responder. */
export function SignalAlerts({ name, signals }: { name: string; signals: { id: string; kind: string; seenAt: Date | null; createdAt: Date }[] }) {
  if (!signals.length) return null;
  const unseen = signals.some((s) => !s.seenAt);
  return (
    <section className={`rise rounded-3xl border p-5 ${unseen ? "border-rose/50 bg-rose/10" : "card"}`} aria-live="polite">
      <h2 className="eyebrow flex items-center gap-1.5" style={{ color: unseen ? "var(--rose)" : undefined }}><Icon name="spark" size={14} />{unseen ? `Aviso de ${name}` : `Avisos de ${name} hoje`}</h2>
      <ul className="mt-3 space-y-4">
        {signals.map((s) => {
          const def = SIGNALS[s.kind as SignalKind];
          if (!def) return null;
          return (
            <li key={s.id}>
              <p className="font-display text-xl">{name} {def.himTitle}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{def.guide}</p>
            </li>
          );
        })}
      </ul>
      {unseen && <form action={ackSignals} className="mt-4"><button className="btn btn-ghost min-h-[44px] px-5">Entendi</button></form>}
    </section>
  );
}
