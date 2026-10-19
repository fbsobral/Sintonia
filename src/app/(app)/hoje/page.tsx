import { requirePartner } from "@/lib/session";
import { statusOn, timeline, toDay } from "@/lib/cycle";
import { PHASES, dayTip, pick } from "@/lib/tips";
import { chartFor, skyToday, SIGN_INFO } from "@/lib/astro";
import { Ring } from "@/components/Ring";
import { fmt, inDays } from "@/lib/format";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Hoje" };

export default async function Hoje() {
  const { partner, profile, today } = await requirePartner();
  const s = statusOn(profile, today);

  if (!s) {
    return (
      <main className="rise pt-10 text-center">
        <h1 className="font-display text-3xl">Falta registrar a menstruação</h1>
        <p className="mt-3 text-muted">Informe o primeiro dia da última menstruação de {partner.name}.</p>
        <Link href="/ciclos" className="btn mt-6">Registrar agora</Link>
      </main>
    );
  }

  const p = PHASES[s.phase];
  const tip = dayTip(s.phase, s.phaseDay, s.pms);
  const talk = pick(p.talk, toDay(today));
  const week = timeline(profile, today, 7);
  const sky = skyToday();
  const moon = chartFor(String(partner.birthDate.toISOString().slice(0, 10)), partner.birthTime).moon.sign;

  return (
    <main className="space-y-5">
      <header className="rise flex items-end justify-between">
        <div>
          <p className="eyebrow">{fmt(today, { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="font-display text-4xl leading-tight">Hoje com <span className="text-grad">{partner.name}</span></h1>
        </div>
      </header>

      <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-5 lg:space-y-0">
      <div className="space-y-5 lg:sticky lg:top-8">
      <section className="rise card relative overflow-hidden px-5 py-7" style={{ background: `radial-gradient(90% 60% at 50% 0%, ${p.color}40, transparent 70%), linear-gradient(180deg, ${p.soft}, #17142b)`, borderColor: `${p.color}55`, boxShadow: `0 30px 70px -40px ${p.color}` }}>
        <Ring length={s.profile.length} ranges={s.ranges} day={s.cycleDay}>
          <span className="text-xs uppercase tracking-widest text-muted">Dia</span>
          <span className="font-display text-6xl leading-none">{s.cycleDay}</span>
          <span className="mt-1 text-sm text-muted">de {s.profile.length}</span>
        </Ring>
        <div className="mt-5 text-center">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: `${p.color}26`, color: p.color }}>
            Fase {p.name}{s.pms ? " · atenção TPM" : ""}
          </span>
          <p className="font-display mt-2 text-2xl">{p.tagline}</p>
          <p className="mt-1 text-sm text-muted">
            {s.daysToPeriod <= 0 ? "Menstruação prevista para hoje" : `Próxima menstruação ${inDays(s.daysToPeriod)} · ${fmt(s.nextPeriod)}`}
          </p>
          {s.projected && <p className="mt-2 text-xs text-muted">Estimativa: registre a última menstruação para ajustar.</p>}
          <div className="mt-5 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-2xl bg-black/25 p-3"><Icon name="drop" size={16} className="text-rose" /><p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Menstruação</p><p className="font-semibold">{s.daysToPeriod <= 0 ? "hoje" : inDays(s.daysToPeriod)}</p></div>
            <div className="rounded-2xl bg-black/25 p-3"><Icon name="spark" size={16} className="text-[#F2B134]" /><p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Ovulação</p><p className="font-semibold">{fmt(s.ovulationDate)}</p></div>
          </div>
        </div>
      </section>

      <section className="rise card p-5">
        <h2 className="eyebrow flex items-center gap-1.5"><Icon name="moon" size={14} />Céu de hoje</h2>
        <p className="mt-2">{sky.moonPhase} em {sky.moonSign} · {sky.illumination}% iluminada</p>
        <p className="mt-1 text-sm text-muted">
          {sky.moonSign === moon
            ? `A Lua de hoje está no signo lunar dela (${moon}): emoções em evidência.`
            : `Lua dela em ${moon}. ${SIGN_INFO[moon].moon}`}
        </p>
      </section>
      </div>

      <div className="space-y-5">
      <section className="rise card p-5">
        <h2 className="eyebrow flex items-center gap-1.5" style={{ color: p.color }}><Icon name="spark" size={14} />Dica do dia</h2>
        <p className="mt-2 text-lg leading-snug">{tip}</p>
      </section>

      <section className="rise card p-5">
        <h2 className="eyebrow flex items-center gap-1.5"><Icon name="chat" size={14} />Para puxar papo</h2>
        <p className="font-display mt-2 border-l-2 pl-4 text-xl leading-snug" style={{ borderColor: p.color }}>{talk}</p>
      </section>

      <section className="rise card p-5">
        <h2 className="eyebrow">Como ela pode estar</h2>
        <p className="mt-2">{p.mood}</p>
        <p className="mt-2 text-sm text-muted">{p.body}</p>
        <div className="mt-3 flex items-center gap-1" aria-label={`Energia ${p.energy} de 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="h-2 flex-1 rounded-full" style={{ background: i <= p.energy ? p.color : "#ffffff14" }} />
          ))}
          <span className="ml-2 text-xs text-muted">energia</span>
        </div>
      </section>

      <div className="rise grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="card p-5">
          <h2 className="eyebrow !text-emerald-300">Faça</h2>
          <ul className="mt-2 space-y-2 text-[15px]">{p.do.map((x) => <li key={x} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300" aria-hidden><Icon name="check" size={12} /></span><span>{x}</span></li>)}</ul>
        </section>
        <section className="card p-5">
          <h2 className="eyebrow !text-rose-300">Evite</h2>
          <ul className="mt-2 space-y-2 text-[15px]">{p.avoid.map((x) => <li key={x} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-400/20 text-rose-300" aria-hidden><Icon name="x" size={12} /></span><span>{x}</span></li>)}</ul>
        </section>
      </div>

      <section className="rise card p-5">
        <h2 className="eyebrow">Próximos 7 dias</h2>
        <ol className="mt-3 flex gap-1.5">
          {week.map((d, i) => {
            const c = PHASES[d.phase].color;
            return (
              <li key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] uppercase text-muted">{i === 0 ? "hoje" : fmt(d.date, { weekday: "narrow" })}</span>
                <span className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold" style={{ background: `${c}${i === 0 ? "" : "33"}`, color: i === 0 ? "#0f0d1f" : c }}>{d.cycleDay}</span>
              </li>
            );
          })}
        </ol>
        <Link href="/ciclos" className="mt-3 inline-block text-sm text-accent">Ver calendário completo →</Link>
      </section>
      </div>
      </div>

      <p className="px-2 pb-2 text-center text-xs text-muted">
        Estimativa com ciclo de {s.profile.length} dias ({s.profile.source === "media" ? "média dos ciclos registrados" : "ritmo informado"}). Cada pessoa é única: observe, pergunte e converse.
      </p>
    </main>
  );
}
