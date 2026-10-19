import { requirePartner } from "@/lib/session";
import { chartFor, daysToBirthday, SIGN_INFO, skyToday } from "@/lib/astro";
import { fmt, inDays } from "@/lib/format";

export const metadata = { title: "Astro" };

export default async function Astro() {
  const { partner, today } = await requirePartner();
  const bd = partner.birthDate.toISOString().slice(0, 10);
  const c = chartFor(bd, partner.birthTime);
  const sky = skyToday();
  const left = daysToBirthday(bd, today);

  const rows = [
    { k: "Sol", sub: "Essência", p: c.sun, text: SIGN_INFO[c.sun.sign].essence },
    { k: "Lua", sub: "Emoções e necessidades", p: c.moon, text: SIGN_INFO[c.moon.sign].moon },
    { k: "Vênus", sub: "Como ama", p: c.venus, text: SIGN_INFO[c.venus.sign].venus },
    { k: "Marte", sub: "Desejo e conflito", p: c.mars, text: SIGN_INFO[c.mars.sign].mars },
  ];
  const topEl = Object.entries(c.elements).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <main className="space-y-5">
      <header className="rise">
        <p className="text-sm text-muted">Mapa de {partner.name}</p>
        <h1 className="font-display text-3xl">{SIGN_INFO[c.sun.sign].glyph} {c.sun.sign}</h1>
        <p className="text-sm text-muted">
          {fmt(bd, { day: "numeric", month: "long", year: "numeric" })}{partner.birthTime ? ` · ${partner.birthTime}` : ""} · aniversário {inDays(left)}
        </p>
      </header>

      <div className="rise grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <section key={r.k} className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted">{r.k} · {r.sub}</h2>
              <span className="text-2xl" aria-hidden>{SIGN_INFO[r.p.sign].glyph}</span>
            </div>
            <p className="font-display mt-1 text-2xl">{r.p.sign} <span className="text-base text-muted">{r.p.deg}°</span></p>
            <p className="mt-1 text-[15px]">{r.text}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
      <section className="rise card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Elemento dominante</h2>
        <p className="font-display mt-1 text-2xl">{topEl}</p>
        <div className="mt-3 flex gap-2">
          {Object.entries(c.elements).map(([k, n]) => (
            <div key={k} className="flex-1 text-center">
              <div className="mx-auto flex h-16 items-end"><span className="w-full rounded-t-lg bg-accent/70" style={{ height: `${Math.max(n, 0.15) * 25}%` }} /></div>
              <p className="mt-1 text-xs text-muted">{k}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rise card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Lua hoje</h2>
        <p className="mt-1">{sky.moonPhase} em {sky.moonSign}</p>
        <p className="mt-1 text-sm text-muted">{SIGN_INFO[sky.moonSign].moon}</p>
      </section>

      </div>

      <p className="px-2 text-center text-xs text-muted">
        {c.approx ? "Sem a hora de nascimento, Lua e Vênus são aproximadas (calculadas para o meio-dia). " : ""}
        Horário de Brasília. Ascendente e casas exigem hora e cidade de nascimento. Astrologia é inspiração, não ciência.
      </p>
    </main>
  );
}
