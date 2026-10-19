"use client";

import { useEffect, useState, useTransition } from "react";
import { saveOnboarding } from "@/app/actions";
import { revealCouple, revealSign } from "@/app/astro-actions";
import { LogoMark } from "./Logo";
import { Icon } from "./Icon";
import { Orbit, Stars } from "./Orbit";

type Reveal = Awaited<ReturnType<typeof revealSign>>;
type Duo = Awaited<ReturnType<typeof revealCouple>>;

const ORDER = ["welcome", "myName", "myBirth", "myReveal", "herName", "herBirth", "herReveal", "couple", "cycle", "last"] as const;
type Step = (typeof ORDER)[number];

const MODES = [
  { id: "D28", t: "28 dias", d: "O ciclo clássico" },
  { id: "D31", t: "31 dias", d: "Um pouco mais longo" },
  { id: "IRREGULAR", t: "Irregular", d: "Varia bastante. Vamos aprender juntos" },
];

function useCountUp(to: number, run: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min((t - t0) / 1400, 1);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return v;
}

const localISO = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return localISO(d); };

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [pending, start] = useTransition();
  const [meName, setMeName] = useState("");
  const [meDate, setMeDate] = useState("");
  const [meTime, setMeTime] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("D28");
  const [period, setPeriod] = useState(5);
  const [last, setLast] = useState("");
  const [meR, setMeR] = useState<Reveal | null>(null);
  const [herR, setHerR] = useState<Reveal | null>(null);
  const [duo, setDuo] = useState<Duo | null>(null);
  const [error, setError] = useState("");
  const today = localISO();

  const idx = ORDER.indexOf(step);
  const go = (s: Step) => { setError(""); setStep(s); window.scrollTo(0, 0); };
  const next = (from: Step = step) => {
    let i = ORDER.indexOf(from) + 1;
    while (i < ORDER.length) {
      const s = ORDER[i];
      if ((s === "myReveal" || s === "couple") && !meDate) { i++; continue; }
      break;
    }
    go(ORDER[i]);
  };
  const back = () => {
    let i = idx - 1;
    while (i > 0 && ((ORDER[i] === "myReveal" || ORDER[i] === "couple") && !meDate)) i--;
    go(ORDER[Math.max(i, 0)]);
  };

  const ready: Record<Step, boolean> = {
    welcome: true, myName: meName.trim().length > 0, myBirth: true, myReveal: true,
    herName: name.trim().length > 0, herBirth: !!date, herReveal: true, couple: true, cycle: true, last: !!last,
  };

  function advance() {
    if (!ready[step] || pending) return;
    if (step === "myBirth") {
      if (!meDate) return next();
      return start(async () => { try { setMeR(await revealSign(meDate, meTime)); next(); } catch { setError("Confira a data informada."); } });
    }
    if (step === "herBirth") {
      return start(async () => {
        try {
          if (meDate) { const r = await revealCouple(meDate, meTime, date, time); setDuo(r); setHerR(r.her); setMeR(r.him); }
          else setHerR(await revealSign(date, time));
          next();
        } catch { setError("Confira a data informada."); }
      });
    }
    if (step === "last") return; // envio pelo form
    next();
  }

  const score = useCountUp(duo?.couple.score ?? 0, step === "couple");
  const last_ = step === "last";

  return (
    <form
      action={saveOnboarding}
      onSubmit={(e) => { if (!last_) { e.preventDefault(); advance(); } }}
      className="relative flex min-h-dvh flex-col"
    >
      <Stars />
      <input type="hidden" name="myName" value={meName} /><input type="hidden" name="myBirthDate" value={meDate} /><input type="hidden" name="myBirthTime" value={meTime} />
      <input type="hidden" name="name" value={name} /><input type="hidden" name="birthDate" value={date} /><input type="hidden" name="birthTime" value={time} />
      <input type="hidden" name="cycleMode" value={mode} /><input type="hidden" name="periodLength" value={period} /><input type="hidden" name="lastPeriod" value={last} />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        {idx > 0 ? (
          <button type="button" onClick={back} aria-label="Voltar" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-muted hover:bg-white/10"><Icon name="arrow" className="rotate-180" /></button>
        ) : <span className="h-11 w-11" />}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={idx} aria-valuemax={ORDER.length - 1}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#bfb0ff] to-[#ff7a9c] transition-all duration-700" style={{ width: `${(idx / (ORDER.length - 1)) * 100}%` }} />
        </div>
        <span className="h-11 w-11" />
      </header>

      <main key={step} className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-6">
        {step === "welcome" && (
          <div className="text-center">
            <div className="float pop mx-auto w-fit"><LogoMark size={96} /></div>
            <h1 className="font-display rise d1 mt-8 text-[2.6rem] leading-[1.05]">Vamos entrar em <span className="text-grad italic">sintonia</span></h1>
            <p className="rise d2 mx-auto mt-4 max-w-xs text-lg text-muted">Algumas perguntas rápidas e você descobre o céu de vocês dois.</p>
          </div>
        )}

        {step === "myName" && (
          <Ask eyebrow="Primeiro, você" title="Como você se chama?">
            <input autoFocus value={meName} onChange={(e) => setMeName(e.target.value)} maxLength={60} placeholder="Seu nome" autoComplete="given-name" className="big-input" />
          </Ask>
        )}

        {step === "myBirth" && (
          <Ask eyebrow={`Prazer, ${meName.trim()}`} title="Quando você nasceu?" sub="Vamos descobrir seu signo e seu mapa astral.">
            <input type="date" value={meDate} onChange={(e) => setMeDate(e.target.value)} max={today} className="field text-lg" aria-label="Data de nascimento" />
            <label className="mt-4 block text-sm text-muted">Hora de nascimento <span className="opacity-60">(opcional, deixa o mapa mais preciso)</span>
              <input type="time" value={meTime} onChange={(e) => setMeTime(e.target.value)} className="field mt-1.5" />
            </label>
            <button type="button" onClick={() => { setMeDate(""); setMeTime(""); next(); }} className="mt-5 text-sm text-muted underline underline-offset-4">Prefiro não informar agora</button>
          </Ask>
        )}

        {step === "myReveal" && meR && <RevealCard who={`${meName.trim()}, você é`} r={meR} />}

        {step === "herName" && (
          <Ask eyebrow="Agora, ela" title="Como ela se chama?" sub="Como você a chama no dia a dia.">
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Nome dela" className="big-input" />
          </Ask>
        )}

        {step === "herBirth" && (
          <Ask eyebrow={name.trim()} title={`Quando ${name.trim()} nasceu?`} sub="Com isso entendemos como ela sente, ama e reage.">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} className="field text-lg" aria-label="Data de nascimento dela" />
            <label className="mt-4 block text-sm text-muted">Hora de nascimento <span className="opacity-60">(opcional)</span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1.5" />
            </label>
          </Ask>
        )}

        {step === "herReveal" && herR && <RevealCard who={`${name.trim()} é`} r={herR} />}

        {step === "couple" && duo && (
          <div className="text-center">
            <p className="eyebrow rise">O céu de vocês dois</p>
            <div className="rise d1 mt-5"><Orbit a={duo.him.glyph} b={duo.her.glyph} /></div>
            <p className="font-display pop d3 mt-4 text-6xl leading-none"><span className="text-grad">{score}</span><span className="text-3xl text-muted">%</span></p>
            <p className="rise d3 mt-1 text-xs uppercase tracking-widest text-muted">de sintonia</p>
            <h2 className="font-display rise d3 mt-3 text-2xl leading-snug">{duo.couple.headline}</h2>
            <p className="rise d4 mt-2 text-sm text-muted">{duo.couple.elementNote}</p>
            <ul className="mt-6 space-y-2 text-left">
              {duo.couple.pairs.map((p, i) => (
                <li key={p.kind} className="card rise p-4" style={{ animationDelay: `${1.1 + i * 0.12}s` }}>
                  <div className="flex items-center justify-between"><span className="font-semibold">{p.title}</span><span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-accent">{p.label}</span></div>
                  <p className="mt-1 text-sm text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">Um retrato do potencial de vocês, não uma sentença.</p>
          </div>
        )}

        {step === "cycle" && (
          <Ask eyebrow="O ritmo dela" title="Como é o ciclo dela?" sub="Sem pressão: depois de 3 registros o app passa a usar a média real.">
            <div className="space-y-2.5" role="radiogroup">
              {MODES.map((m) => (
                <button type="button" key={m.id} role="radio" aria-checked={mode === m.id} onClick={() => setMode(m.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${mode === m.id ? "border-accent bg-accent/15" : "border-line bg-white/5 hover:bg-white/10"}`}>
                  <span><span className="block font-semibold">{m.t}</span><span className="text-sm text-muted">{m.d}</span></span>
                  <span className={`grid h-6 w-6 place-items-center rounded-full border ${mode === m.id ? "border-accent bg-accent text-[#15112e]" : "border-white/25"}`}>{mode === m.id && <Icon name="check" size={14} />}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-white/5 p-3">
              <span className="pl-2 text-sm text-muted">Menstruação dura<br /><b className="text-base text-ink">{period} dias</b></span>
              <span className="flex gap-2">
                <button type="button" aria-label="Menos um dia" onClick={() => setPeriod((p) => Math.max(2, p - 1))} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl">−</button>
                <button type="button" aria-label="Mais um dia" onClick={() => setPeriod((p) => Math.min(10, p + 1))} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl">+</button>
              </span>
            </div>
          </Ask>
        )}

        {step === "last" && (
          <Ask eyebrow="Último passo" title="Quando começou a última menstruação?" sub="O primeiro dia do sangramento. Pode ser aproximado.">
            <div className="mb-3 flex flex-wrap gap-2">
              {[["Hoje", 0], ["Ontem", 1], ["Há 3 dias", 3], ["Há 1 semana", 7], ["Há 2 semanas", 14]].map(([l, n]) => (
                <button type="button" key={l as string} onClick={() => setLast(daysAgo(n as number))}
                  className={`min-h-[44px] rounded-full border px-4 text-sm transition ${last === daysAgo(n as number) ? "border-accent bg-accent/20 text-ink" : "border-line bg-white/5 text-muted hover:bg-white/10"}`}>{l}</button>
              ))}
            </div>
            <input type="date" value={last} onChange={(e) => setLast(e.target.value)} max={today} className="field text-lg" aria-label="Primeiro dia da última menstruação" />
          </Ask>
        )}

        {error && <p role="alert" className="mt-4 text-center text-sm text-rose">{error}</p>}
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-md px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-2">
        <button type="submit" disabled={!ready[step] || pending} className="btn w-full text-base">
          {pending ? "Consultando os astros…" : cta(step)}
          {!pending && <Icon name={last_ ? "spark" : "arrow"} size={18} />}
        </button>
      </footer>

      <style>{`.big-input{width:100%;background:transparent;border:0;border-bottom:2px solid #ffffff30;padding:.5rem 0 .75rem;font-family:var(--font-fraunces),serif;font-size:2.2rem;color:var(--text);outline:none;transition:border-color .2s}.big-input:focus{border-color:var(--accent)}.big-input::placeholder{color:#ffffff30}`}</style>
    </form>
  );
}

function cta(s: Step) {
  return ({
    welcome: "Começar", myName: "Continuar", myBirth: "Revelar meu signo", myReveal: "Agora, ela", herName: "Continuar",
    herBirth: "Revelar o céu dela", herReveal: "Ver nós dois", couple: "Continuar", cycle: "Continuar", last: "Entrar no Sintonia",
  } as Record<Step, string>)[s];
}

function Ask({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow rise">{eyebrow}</p>
      <h1 className="font-display rise d1 mt-3 text-[2.2rem] leading-[1.08]">{title}</h1>
      {sub && <p className="rise d1 mt-2 text-muted">{sub}</p>}
      <div className="rise d2 mt-7">{children}</div>
    </div>
  );
}

function RevealCard({ who, r }: { who: string; r: Reveal }) {
  return (
    <div className="text-center">
      <p className="eyebrow rise">{who}</p>
      <div className="relative mx-auto mt-6 grid h-44 w-44 place-items-center">
        <span className="absolute inset-0 rounded-full border border-accent/40" style={{ animation: "pulse-ring 2.6s ease-out infinite" }} />
        <span className="absolute inset-3 rounded-full border border-accent/30" style={{ animation: "pulse-ring 2.6s ease-out .8s infinite" }} />
        <span className="pop d1 grid h-36 w-36 place-items-center rounded-full border border-white/20 text-7xl shadow-[0_0_70px_-6px_#bfb0ff] [background:radial-gradient(circle_at_30%_25%,#4a3bb0,#1a1538)]">{r.glyph}</span>
      </div>
      <h1 className="font-display pop d2 mt-6 text-5xl"><span className="text-grad">{r.sign}</span></h1>
      <p className="rise d3 mt-2 text-lg text-muted">{r.essence}</p>
      <ul className="rise d4 mt-6 flex flex-wrap justify-center gap-2 text-sm">
        {[["Elemento", r.element], ["Lua", r.moon], ["Vênus", r.venus], ["Marte", r.mars]].map(([k, v]) => (
          <li key={k} className="rounded-full border border-line bg-white/5 px-3.5 py-1.5"><span className="text-muted">{k} </span>{v}</li>
        ))}
      </ul>
      {r.approx && <p className="mt-4 text-xs text-muted">Sem a hora de nascimento, Lua e Vênus são aproximadas.</p>}
    </div>
  );
}
