import Link from "next/link";
import { requirePartner } from "@/lib/session";
import { fromDay, statusOn, timeline, toDay } from "@/lib/cycle";
import { PHASES, dayTip, pick } from "@/lib/tips";
import { chartFor, skyToday } from "@/lib/astro";
import { Ring } from "@/components/Ring";
import { Icon } from "@/components/Icon";
import { fmt, inDays } from "@/lib/format";
import { skyReading } from "@/lib/sky";

export const metadata = { title: "Hoje" };

const href = (d: string, today: string) => (d === today ? "/hoje" : `/hoje?d=${d}`);

export default async function Hoje({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { partner, profile, today } = await requirePartner();
  const { d } = await searchParams;
  const valid = !!d && /^\d{4}-\d{2}-\d{2}$/.test(d) && Math.abs(toDay(d) - toDay(today)) <= 365;
  const sel = valid ? d : today;
  const offset = toDay(sel) - toDay(today);
  const isToday = offset === 0;
  const s = statusOn(profile, sel);

  const label = isToday ? "Hoje" : offset === 1 ? "Amanhã" : offset === -1 ? "Ontem" : fmt(sel, { weekday: "long", day: "numeric", month: "long" });

  // faixa de 7 dias centrada no dia selecionado
  const strip = Array.from({ length: 7 }, (_, i) => fromDay(toDay(sel) - 3 + i));
  const cells = new Map(timeline(profile, strip[0], 7).map((c) => [c.date, c]));

  const nav = (
    <div className="rise space-y-3">
      <div className="flex items-center gap-2">
        <Link href={href(fromDay(toDay(sel) - 1), today)} replace scroll={false} aria-label="Dia anterior" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 hover:bg-white/10"><Icon name="arrow" className="rotate-180" /></Link>
        <ol className="flex flex-1 gap-1">
          {strip.map((day) => {
            const c = cells.get(day);
            const on = day === sel;
            const col = c ? PHASES[c.phase].color : "#ffffff30";
            return (
              <li key={day} className="min-w-0 flex-1">
                <Link href={href(day, today)} replace scroll={false} aria-current={on ? "date" : undefined}
                  className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-center transition ${on ? "bg-white/15 shadow-[0_0_24px_-6px_#bfb0ff]" : "hover:bg-white/5"}`}>
                  <span className="text-[10px] uppercase text-muted">{day === today ? "hoje" : fmt(day, { weekday: "short" }).replace(".", "")}</span>
                  <span className={`text-base font-semibold ${on ? "text-ink" : "text-muted"}`}>{Number(day.slice(8))}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: col }} />
                </Link>
              </li>
            );
          })}
        </ol>
        <Link href={href(fromDay(toDay(sel) + 1), today)} replace scroll={false} aria-label="Próximo dia" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 hover:bg-white/10"><Icon name="arrow" /></Link>
      </div>
      {!isToday && (
        <div className="flex justify-center">
          <Link href="/hoje" replace scroll={false} className="rounded-full border border-line bg-white/5 px-4 py-2 text-sm text-accent hover:bg-white/10">Voltar para hoje</Link>
        </div>
      )}
    </div>
  );

  if (!s) {
    return (
      <main className="space-y-5">
        <header className="rise"><p className="eyebrow">{label}</p><h1 className="font-display mt-1 text-4xl">Com <span className="text-grad">{partner.name}</span></h1></header>
        {nav}
        <section className="rise card p-6 text-center">
          <p className="text-muted">{isToday ? `Falta registrar a menstruação de ${partner.name}.` : "Ainda não há ciclos registrados nesta data."}</p>
          <Link href={isToday ? "/ciclos" : "/hoje"} className="btn mt-5">{isToday ? "Registrar agora" : "Voltar para hoje"}</Link>
        </section>
      </main>
    );
  }

  const p = PHASES[s.phase];
  const tip = dayTip(s.phase, s.phaseDay, s.pms, s.phaseLength);
  const talk = pick(p.talk, toDay(sel));
  const week = timeline(profile, sel, 7);
  const sky = skyToday(new Date(`${sel}T15:00:00Z`));
  const moon = chartFor(partner.birthDate.toISOString().slice(0, 10), partner.birthTime).moon.sign;
  const read = skyReading(sky.moonPhase, sky.moonSign, moon, s.phase, s.pms);
  const forecast = offset > 0 || s.projected;
  const total = Math.max(s.profile.length, s.cycleDay);

  return (
    <main className="space-y-5">
      <header className="rise">
        <p className="eyebrow">{isToday ? fmt(sel, { weekday: "long", day: "numeric", month: "long" }) : fmt(sel, { year: "numeric", day: "numeric", month: "long" })}</p>
        <h1 className="font-display mt-1 text-4xl leading-tight">{label} com <span className="text-grad">{partner.name}</span></h1>
      </header>

      {nav}

      <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-5 lg:space-y-0">
        <div className="space-y-5 lg:sticky lg:top-8">
          <section className="rise card relative overflow-hidden px-5 py-7" style={{ background: `radial-gradient(90% 60% at 50% 0%, ${p.color}40, transparent 70%), linear-gradient(180deg, ${p.soft}, #17142b)`, borderColor: `${p.color}55`, boxShadow: `0 30px 70px -40px ${p.color}` }}>
            <Ring length={total} ranges={s.ranges} day={s.cycleDay}>
              <span className="text-xs uppercase tracking-widest text-muted">Dia</span>
              <span className="font-display text-6xl leading-none">{s.cycleDay}</span>
              <span className="mt-1 text-sm text-muted">de {total}</span>
            </Ring>
            <div className="mt-5 text-center">
              <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: `${p.color}26`, color: p.color }}>
                Fase {p.name}{s.pms ? " · atenção TPM" : ""}
              </span>
              <p className="font-display mt-2 text-2xl">{p.tagline}</p>
              <p className="mt-1 text-sm text-muted">
                {s.daysToPeriod <= 0 ? "Menstruação prevista para este dia" : `Próxima menstruação ${inDays(s.daysToPeriod)} · ${fmt(s.nextPeriod)}`}
              </p>
              {forecast && <p className="mt-2 text-xs text-muted">Previsão baseada na média dos ciclos registrados.</p>}
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                <div className="rounded-2xl bg-black/25 p-3"><Icon name="drop" size={16} className="text-rose" /><p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Menstruação</p><p className="font-semibold">{fmt(s.nextPeriod)}</p></div>
                <div className="rounded-2xl bg-black/25 p-3"><Icon name="spark" size={16} className="text-[#F2B134]" /><p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Ovulação</p><p className="font-semibold">{fmt(s.ovulationDate)}</p></div>
              </div>
            </div>
          </section>

          <section className="rise card p-5">
            <h2 className="eyebrow flex items-center gap-1.5"><Icon name="moon" size={14} />Céu {isToday ? "de hoje" : "neste dia"}</h2>
            <p className="font-display mt-2 text-2xl">{sky.moonPhase} em {sky.moonSign}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-[#ffe9b8]" style={{ width: `${sky.illumination}%` }} /></span>{sky.illumination}% iluminada</div>
            <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
              <div><dt className="text-xs font-bold uppercase tracking-wider text-accent">O que a fase traz</dt><dd className="text-muted">{read.phase}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-accent">Lua em {sky.moonSign}</dt><dd className="text-muted">{read.sign.mood}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-accent">Com a Lua dela ({moon})</dt><dd className="text-muted">{read.vsHer}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-accent">Junto com o ciclo</dt><dd className="text-muted">{read.cross}</dd></div>
            </dl>
            <p className="mt-4 rounded-2xl bg-white/5 p-3 text-[15px]"><span className="font-semibold">Para hoje:</span> {read.sign.tip}</p>
            <p className="mt-3 text-[11px] text-muted">Leitura simbólica, para inspirar a conversa. O ciclo é biologia; o céu é só um tempero.</p>
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
            <h2 className="eyebrow">Os próximos dias</h2>
            <ol className="mt-3 flex gap-1.5">
              {week.map((day, i) => {
                const c = PHASES[day.phase].color;
                return (
                  <li key={day.date} className="flex-1">
                    <Link href={href(day.date, today)} replace scroll={false} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] uppercase text-muted">{i === 0 ? (isToday ? "hoje" : "este") : fmt(day.date, { weekday: "narrow" })}</span>
                      <span className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold" style={{ background: `${c}${i === 0 ? "" : "33"}`, color: i === 0 ? "#0f0d1f" : c }}>{day.cycleDay}</span>
                    </Link>
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
