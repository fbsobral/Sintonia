import Link from "next/link";
import { requirePartner } from "@/lib/session";
import { fromDay, statusOn, timeline, toDay } from "@/lib/cycle";
import { PHASES, pick, stageFor } from "@/lib/tips";
import { chartFor, skyToday } from "@/lib/astro";
import { Ring } from "@/components/Ring";
import { Icon } from "@/components/Icon";
import { fmt, short, shortRange } from "@/lib/format";
import { skyReading } from "@/lib/sky";

export const metadata = { title: "Hoje" };

const href = (d: string, today: string) => (d === today ? "/hoje" : `/hoje?d=${d}`);
const REG = { regular: "regular", moderada: "moderadamente variável", irregular: "irregular", desconhecida: "ainda sem dados suficientes" } as const;

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted"><span>{label}</span><span>{["", "muito baixa", "baixa", "média", "alta", "muito alta"][value]}</span></div>
      <div className="mt-1 flex gap-1" aria-label={`${label}: ${value} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= value ? color : "#ffffff14" }} />)}
      </div>
    </div>
  );
}

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
        <Link href={href(fromDay(toDay(sel) - 1), today)} replace scroll={false} aria-label="Dia anterior" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 hover:bg-white/10"><Icon name="arrow" size={18} className="rotate-180" /></Link>
        <ol className="flex flex-1 gap-1">
          {strip.map((day) => {
            const c = cells.get(day);
            const on = day === sel;
            const col = c ? PHASES[c.phase].color : "#ffffff30";
            return (
              <li key={day} className="min-w-0 flex-1">
                <Link href={href(day, today)} replace scroll={false} aria-current={on ? "date" : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-center transition ${on ? "bg-white/15 shadow-[0_0_24px_-6px_#bfb0ff]" : "hover:bg-white/5"}`}>
                  <span className="text-[10px] uppercase text-muted">{day === today ? "hoje" : fmt(day, { weekday: "short" }).replace(".", "")}</span>
                  <span className={`text-base font-semibold ${on ? "text-ink" : "text-muted"}`}>{Number(day.slice(8))}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: col }} />
                </Link>
              </li>
            );
          })}
        </ol>
        <Link href={href(fromDay(toDay(sel) + 1), today)} replace scroll={false} aria-label="Próximo dia" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 hover:bg-white/10"><Icon name="arrow" size={18} /></Link>
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
          <p className="text-muted">{isToday ? `Para começar, registre o primeiro dia da última menstruação de ${partner.name}.` : "Não há ciclo registrado antes desta data, então não dá para estimar a fase."}</p>
          <Link href={isToday ? "/ciclos" : "/hoje"} className="btn mt-5">{isToday ? "Registrar agora" : "Voltar para hoje"}</Link>
        </section>
      </main>
    );
  }

  const p = PHASES[s.phase];
  const st = stageFor(s.phase, s.phaseDay, s.phaseLength);
  const talk = pick(st.talk, toDay(sel));
  const week = timeline(profile, sel, 7);
  const sky = skyToday(new Date(`${sel}T15:00:00Z`));
  const moon = chartFor(partner.birthDate.toISOString().slice(0, 10), partner.birthTime).moon.sign;
  const read = skyReading(sky.moonPhase, sky.moonSign, moon, s.phase, s.pms);
  const forecast = offset > 0 || s.projected;
  const total = Math.max(s.profile.length, s.cycleDay);
  const [r0, r1] = s.nextRange;
  const nextText = s.daysToPeriod <= 0 ? "Neste dia" : r0 !== r1 ? shortRange(r0, r1) : short(s.nextPeriod);
  const fertColor = s.fertility === "muito alta" ? "#F2B134" : s.fertility === "alta" ? "#e6c35c" : "#9a95b8";

  return (
    <main className="space-y-3 sm:space-y-5">
      <header className="rise">
        <p className="eyebrow">{isToday ? fmt(sel, { weekday: "long", day: "numeric", month: "long" }) : fmt(sel, { year: "numeric", day: "numeric", month: "long" })}</p>
        <h1 className="font-display mt-0.5 text-3xl leading-tight sm:mt-1 sm:text-4xl">{label} com <span className="text-grad">{partner.name}</span></h1>
      </header>

      {nav}

      <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-5 lg:space-y-0">
        <div className="space-y-5 lg:sticky lg:top-8">
          <section className="rise card relative overflow-hidden px-4 py-4 sm:px-5 sm:py-7" style={{ background: `radial-gradient(90% 60% at 50% 0%, ${p.color}40, transparent 70%), linear-gradient(180deg, ${p.soft}, #17142b)`, borderColor: `${p.color}55`, boxShadow: `0 30px 70px -40px ${p.color}` }}>
            <Ring length={total} ranges={s.ranges} day={s.cycleDay}>
              <span className="text-xs uppercase tracking-widest text-muted">Dia</span>
              <span className="font-display text-5xl leading-none sm:text-6xl">{s.cycleDay}</span>
              <span className="mt-1 text-sm text-muted">de {total}</span>
            </Ring>
            <div className="mt-3 text-center sm:mt-5">
              <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: `${p.color}26`, color: p.color }}>
                Fase {p.name}{s.pms ? " · janela de TPM" : ""}
              </span>
              <p className="balance font-display mt-1.5 text-xl sm:mt-2 sm:text-2xl">{p.tagline}</p>
              {forecast && <p className="mt-1 text-xs text-muted">Previsão a partir da média dos ciclos registrados.</p>}
              <div className="mt-3 grid grid-cols-2 gap-2 text-left sm:mt-5">
                <div className="flex items-center gap-2.5 rounded-2xl bg-black/25 p-2.5 sm:p-3"><Icon name="drop" size={18} className="shrink-0 text-rose" /><div><p className="text-[10px] uppercase tracking-wider text-muted">Próxima menstruação</p><p className="whitespace-nowrap text-sm font-semibold">{nextText}</p></div></div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-black/25 p-2.5 sm:p-3"><Icon name="spark" size={18} className="shrink-0" style={{ color: fertColor }} /><div><p className="text-[10px] uppercase tracking-wider text-muted">Fertilidade</p><p className="text-sm font-semibold capitalize">{s.fertility}</p></div></div>
              </div>
              <p className="mt-2 text-[11px] text-muted">Ovulação estimada em {short(s.ovulationDate)}{r0 !== r1 ? ` · margem de ±${s.profile.margin} dia${s.profile.margin > 1 ? "s" : ""}` : ""}</p>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rise card p-5">
            <div className="flex items-center justify-between gap-2"><h2 className="eyebrow">Como ela pode estar</h2><span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: `${p.color}26`, color: p.color }}>{st.name}</span></div>
            <p className="mt-2 text-[17px] leading-snug">{st.mood}</p>
            <p className="mt-2 text-sm text-muted">{st.body}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Meter label="Energia" value={st.energy} color={p.color} />
              <Meter label="Sensib." value={st.sensitivity} color={p.color} />
              <Meter label="Desejo" value={st.desire} color={p.color} />
            </div>
            <details className="group mt-4 rounded-2xl bg-white/5 px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">Por que isso acontece<span className="text-lg text-muted transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{st.why}</p>
              <p className="mt-2 text-xs font-semibold tracking-wide" style={{ color: p.color }}>{st.hormones}</p>
            </details>
            <p className="mt-3 text-[11px] text-muted">Tendências médias. Cada mulher, e cada ciclo, é diferente: confirme conversando.</p>
          </section>

          {st.flag && (
            <aside className="rise rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-100/90">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200"><Icon name="spark" size={13} />Atenção à saúde</p>
              {st.flag}
            </aside>
          )}

          <div className="rise grid grid-cols-1 gap-3 sm:grid-cols-2">
            <section className="card p-5">
              <h2 className="eyebrow !text-emerald-300">O que ajuda</h2>
              <ul className="mt-2 space-y-2.5 text-[15px] leading-snug">{st.do.map((x) => <li key={x} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300" aria-hidden><Icon name="check" size={12} /></span><span>{x}</span></li>)}</ul>
            </section>
            <section className="card p-5">
              <h2 className="eyebrow !text-rose-300">O que evitar</h2>
              <ul className="mt-2 space-y-2.5 text-[15px] leading-snug">{st.avoid.map((x) => <li key={x} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-400/20 text-rose-300" aria-hidden><Icon name="x" size={12} /></span><span>{x}</span></li>)}</ul>
            </section>
          </div>

          <section className="rise card p-5">
            <h2 className="eyebrow flex items-center gap-1.5" style={{ color: p.color }}><Icon name="spark" size={14} />Ponto de atenção do dia</h2>
            <p className="mt-2 text-lg leading-snug">{st.tip}</p>
          </section>

          <section className="rise card p-5">
            <h2 className="eyebrow flex items-center gap-1.5"><Icon name="chat" size={14} />Como abrir a conversa</h2>
            <p className="font-display mt-2 border-l-2 pl-4 text-xl leading-snug" style={{ borderColor: p.color }}>{talk}</p>
            <p className="mt-2 text-xs text-muted">Adapte ao seu jeito. A frase funciona quando soa como você.</p>
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
            <p className="mt-4 rounded-2xl bg-white/5 p-3 text-[15px]"><span className="font-semibold">Aplicação prática:</span> {read.sign.tip}</p>
            <p className="mt-3 text-[11px] text-muted">Leitura simbólica, sem base científica, usada como roteiro de conversa. O ciclo é biologia.</p>
          </section>

          <section className="rise card p-5">
            <h2 className="eyebrow">Próximos dias</h2>
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
            <Link href="/ciclos" className="mt-3 inline-block text-sm text-accent">Abrir calendário →</Link>
          </section>
        </div>
      </div>

      <div className="px-2 pb-2 text-center text-xs leading-relaxed text-muted">
        <p>
          Ciclo de {s.profile.length} dias ({s.profile.source === "media" ? `média de ${s.profile.intervals.length} ciclos` : "ritmo informado"}), regularidade {REG[s.profile.regularity]}
          {s.profile.variability != null ? `, variação de ±${s.profile.margin} dia${s.profile.margin > 1 ? "s" : ""}` : ""}.
        </p>
        <p className="mt-1">Estimativas por calendário não servem como método contraceptivo. Referências: ACOG e Wilcox et al. (NEJM, 1995).</p>
      </div>
    </main>
  );
}
