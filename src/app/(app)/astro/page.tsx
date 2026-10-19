import Link from "next/link";
import { requirePartner } from "@/lib/session";
import { chartFor, daysToBirthday, SIGN_INFO, skyToday, type Chart } from "@/lib/astro";
import { compatibility } from "@/lib/synastry";
import { dateStr } from "@/lib/cycle";
import { fmt, inDays } from "@/lib/format";
import { Orbit } from "@/components/Orbit";

export const metadata = { title: "Astro" };

type View = "nos" | "ela" | "voce";

export default async function Astro({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { user, partner, today } = await requirePartner();
  const { v } = await searchParams;
  const herBd = dateStr(partner.birthDate);
  const her = chartFor(herBd, partner.birthTime);
  const him = user.birthDate ? chartFor(dateStr(user.birthDate), user.birthTime) : null;
  const view: View = v === "ela" || v === "voce" ? v : "nos";
  const sky = skyToday();

  const tabs: { id: View; label: string }[] = [
    { id: "nos", label: "Nós dois" },
    { id: "ela", label: partner.name },
    { id: "voce", label: "Você" },
  ];

  return (
    <main className="space-y-5">
      <header className="rise">
        <p className="eyebrow">Astrologia</p>
        <h1 className="font-display mt-1 text-4xl">O céu de vocês</h1>
        <p className="mt-1 text-sm text-muted">Hoje: {sky.moonPhase} em {sky.moonSign}</p>
      </header>

      <nav aria-label="Visão" className="rise flex gap-1 rounded-full border border-line bg-white/5 p-1">
        {tabs.map((t) => (
          <Link key={t.id} href={`/astro?v=${t.id}`} replace aria-current={view === t.id ? "page" : undefined}
            className={`flex min-h-[44px] flex-1 items-center justify-center truncate rounded-full px-3 text-sm font-medium transition ${view === t.id ? "bg-white/15 text-ink shadow-inner" : "text-muted hover:text-ink"}`}>
            {t.label}
          </Link>
        ))}
      </nav>

      {view === "nos" && (him ? <Together him={him} her={her} name={partner.name} /> : <CompleteProfile />)}
      {view === "ela" && <ChartView name={partner.name} chart={her} bd={herBd} bt={partner.birthTime} today={today} />}
      {view === "voce" && (him && user.birthDate
        ? <ChartView name={user.name || "Você"} chart={him} bd={dateStr(user.birthDate)} bt={user.birthTime} today={today} />
        : <CompleteProfile />)}

      <p className="px-2 text-center text-xs text-muted">
        Horário de Brasília. Sem a hora de nascimento, Lua e Vênus são aproximadas. Ascendente e casas exigem hora e cidade. Astrologia é inspiração, não ciência.
      </p>
    </main>
  );
}

function CompleteProfile() {
  return (
    <section className="rise card p-6 text-center">
      <p className="text-4xl" aria-hidden>✦</p>
      <h2 className="font-display mt-2 text-2xl">Complete o seu mapa</h2>
      <p className="mx-auto mt-1 max-w-sm text-muted">Informe sua data de nascimento para ver seu signo e a compatibilidade com ela.</p>
      <Link href="/perfil#voce" className="btn mt-5">Adicionar meus dados</Link>
    </section>
  );
}

function Together({ him, her, name }: { him: Chart; her: Chart; name: string }) {
  const c = compatibility(him, her);
  const hi = SIGN_INFO[him.sun.sign], hr = SIGN_INFO[her.sun.sign];
  return (
    <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-5 lg:space-y-0">
      <section className="rise card px-5 py-8 text-center lg:sticky lg:top-8">
        <Orbit a={hi.glyph} b={hr.glyph} />
        <p className="font-display mt-4 text-6xl leading-none"><span className="text-grad">{c.score}</span><span className="text-3xl text-muted">%</span></p>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted">de sintonia</p>
        <h2 className="font-display mt-3 text-2xl leading-snug">{c.headline}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{c.elementNote}</p>
        <p className="mt-4 text-sm"><span className="text-accent">{him.sun.sign}</span> <span className="text-muted">+</span> <span className="text-rose">{her.sun.sign}</span> <span className="text-muted">· com {name}</span></p>
      </section>
      <ul className="space-y-3">
        {c.pairs.map((p) => (
          <li key={p.kind} className="rise card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl">{p.title}</h3>
                <p className="text-xs text-muted">{p.sub}: {p.a} · {p.b}</p>
              </div>
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-accent">{p.label}</span>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed">{p.text}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#bfb0ff] to-[#ff7a9c]" style={{ width: `${p.score}%` }} /></div>
          </li>
        ))}
        <li className="px-2 text-center text-xs text-muted">Um retrato do potencial de vocês, não uma sentença.</li>
      </ul>
    </div>
  );
}

function ChartView({ name, chart: c, bd, bt, today }: { name: string; chart: Chart; bd: string; bt?: string | null; today: string }) {
  const rows = [
    { k: "Sol", sub: "Essência", p: c.sun, text: SIGN_INFO[c.sun.sign].essence },
    { k: "Lua", sub: "Emoções e necessidades", p: c.moon, text: SIGN_INFO[c.moon.sign].moon },
    { k: "Vênus", sub: "Como ama", p: c.venus, text: SIGN_INFO[c.venus.sign].venus },
    { k: "Marte", sub: "Desejo e conflito", p: c.mars, text: SIGN_INFO[c.mars.sign].mars },
  ];
  const topEl = Object.entries(c.elements).sort((a, b) => b[1] - a[1])[0][0];
  const left = daysToBirthday(bd, today);
  return (
    <div className="space-y-5">
      <section className="rise card flex items-center gap-4 p-5">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-white/20 text-5xl shadow-[0_0_50px_-8px_#bfb0ff] [background:radial-gradient(circle_at_30%_25%,#4a3bb0,#1a1538)]">{SIGN_INFO[c.sun.sign].glyph}</span>
        <div>
          <p className="eyebrow">{name}</p>
          <h2 className="font-display text-3xl"><span className="text-grad">{c.sun.sign}</span></h2>
          <p className="text-sm text-muted">{fmt(bd, { day: "numeric", month: "long", year: "numeric" })}{bt ? ` · ${bt}` : ""} · aniversário {inDays(left)}</p>
        </div>
      </section>
      <div className="rise grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <section key={r.k} className="card p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="eyebrow">{r.k} · {r.sub}</h3>
              <span className="text-2xl" aria-hidden>{SIGN_INFO[r.p.sign].glyph}</span>
            </div>
            <p className="font-display mt-1 text-2xl">{r.p.sign} <span className="text-base text-muted">{r.p.deg}°</span></p>
            <p className="mt-1 text-[15px] leading-relaxed">{r.text}</p>
          </section>
        ))}
      </div>
      <section className="rise card p-5">
        <h3 className="eyebrow">Elemento dominante</h3>
        <p className="font-display mt-1 text-2xl">{topEl}</p>
        <div className="mt-4 flex gap-2">
          {Object.entries(c.elements).map(([k, n]) => (
            <div key={k} className="flex-1 text-center">
              <div className="mx-auto flex h-16 items-end"><span className="w-full rounded-t-lg bg-gradient-to-t from-[#7b61ff] to-[#d6c9ff]" style={{ height: `${Math.max(n, 0.15) * 25}%` }} /></div>
              <p className="mt-1 text-xs text-muted">{k}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
