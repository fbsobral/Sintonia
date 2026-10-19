import { requirePartner } from "@/lib/session";
import Link from "next/link";
import { fromDay, statusOn, toDay } from "@/lib/cycle";
import { PHASES } from "@/lib/tips";
import { fmt } from "@/lib/format";
import { addCycle, deleteCycle } from "@/app/actions";

export const metadata = { title: "Ciclos" };

export default async function Ciclos({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { partner, profile, today } = await requirePartner();
  const { m } = await searchParams;
  const offset = Math.max(-6, Math.min(12, Number(m) || 0));

  const [ty, tm] = today.split("-").map(Number);
  const first = new Date(Date.UTC(ty, tm - 1 + offset, 1));
  const year = first.getUTCFullYear(), month = first.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const pad = first.getUTCDay();
  const cells = Array.from({ length: daysInMonth }, (_, i) => {
    const date = fromDay(toDay(`${year}-${String(month + 1).padStart(2, "0")}-01`) + i);
    const st = statusOn(profile, date);
    return { date, day: i + 1, phase: st ? st.phase : null, ov: st ? st.cycleDay === st.ranges.ovulationDay : false };
  });

  const needed = Math.max(0, 3 - profile.starts.length);
  const history = [...partner.cycles].reverse();

  return (
    <main className="space-y-5">
      <header className="rise">
        <h1 className="font-display text-3xl">Ciclos</h1>
        <p className="text-sm text-muted">Registre o primeiro dia de cada menstruação. Quanto mais registros, mais precisa a previsão.</p>
      </header>

      <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
      <div className="space-y-5">
      <section className="rise card p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Duração do ciclo</p>
            <p className="font-display text-4xl">{profile.length} <span className="text-lg text-muted">dias</span></p>
          </div>
          <div className="text-right text-sm text-muted">
            <p>Menstruação: {profile.periodLength} dias</p>
            <p>{profile.source === "media" ? `Média de ${profile.intervals.length} ciclos` : "Ritmo informado"}</p>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-muted">
          {needed > 0
            ? `Faltam ${needed} registro${needed > 1 ? "s" : ""} para o app usar a média real dos ciclos dela. Até lá, ele usa o ritmo informado.`
            : `Usando a média real dos ciclos registrados. Regularidade: ${profile.regularity === "regular" ? "regular" : profile.regularity === "moderada" ? "moderadamente variável" : profile.regularity === "irregular" ? "irregular" : "sem dados suficientes"}${profile.variability != null ? ` (variação de ±${profile.margin} dia${profile.margin > 1 ? "s" : ""})` : ""}.`}
        </p>
      </section>

      <section className="rise card p-5">
        <div className="mb-3 flex items-center justify-between">
          <a href={`?m=${offset - 1}`} aria-label="Mês anterior" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-xl">‹</a>
          <h2 className="font-display text-xl capitalize">{fmt(`${year}-${String(month + 1).padStart(2, "0")}-01`, { month: "long", year: "numeric" })}</h2>
          <a href={`?m=${offset + 1}`} aria-label="Próximo mês" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-xl">›</a>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: pad }).map((_, i) => <span key={`p${i}`} />)}
          {cells.map((c) => {
            const col = c.phase ? PHASES[c.phase].color : null;
            const isToday = c.date === today;
            return (
              <Link key={c.date} href={c.date === today ? "/hoje" : `/hoje?d=${c.date}`} aria-label={`Ver o dia ${c.day}`} className="relative grid aspect-square place-items-center rounded-xl text-sm font-semibold transition hover:scale-105"
                style={{ background: col ? `${col}${c.phase === "menstrual" ? "55" : "26"}` : "transparent", color: col ?? "var(--muted)", outline: isToday ? "2px solid #fff" : undefined }}>
                {c.day}
                {c.ov && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" aria-label="ovulação" />}
              </Link>
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {Object.values(PHASES).map((p) => (
            <li key={p.key} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />{p.name}</li>
          ))}
        </ul>
      </section>

      </div>
      <div className="space-y-5">
      <section className="rise card p-5">
        <h2 className="font-display text-xl">Registrar menstruação</h2>
        <form action={addCycle} className="mt-3 space-y-3">
          <label className="block text-sm text-muted">Primeiro dia
            <input type="date" name="start" required max={today} className="field mt-1" />
          </label>
          <label className="block text-sm text-muted">Último dia <span className="opacity-70">(opcional)</span>
            <input type="date" name="end" max={today} className="field mt-1" />
            <span className="mt-1 block text-xs">Informar o último dia permite calcular a duração média da menstruação.</span>
          </label>
          <button className="btn w-full">Salvar</button>
        </form>
      </section>

      <section className="rise card p-5">
        <h2 className="font-display text-xl">Histórico</h2>
        <ul className="mt-2 divide-y divide-line">
          {history.map((c, i) => {
            const start = c.startDate.toISOString().slice(0, 10);
            const end = c.endDate?.toISOString().slice(0, 10);
            const next = history[i - 1];
            const len = next ? toDay(next.startDate.toISOString().slice(0, 10)) - toDay(start) : null;
            return (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{fmt(start, { day: "numeric", month: "long", year: "numeric" })}{end ? ` → ${fmt(end)}` : ""}</p>
                  <p className="text-xs text-muted">{len ? `Ciclo de ${len} dias` : "Ciclo em andamento"}</p>
                </div>
                <form action={deleteCycle}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-white/5" aria-label="Remover registro">✕</button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
      </div>
      </div>
    </main>
  );
}
