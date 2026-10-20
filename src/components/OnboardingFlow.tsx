"use client";

import { useEffect, useState, useTransition } from "react";
import { joinAsCycle, joinAsPartner, startAsCycle, startAsPartner } from "@/app/actions";
import { revealCouple, revealSign } from "@/app/astro-actions";
import { LogoMark } from "./Logo";
import { Icon } from "./Icon";
import { Orbit, Stars } from "./Orbit";

type Reveal = Awaited<ReturnType<typeof revealSign>>;
type Duo = Awaited<ReturnType<typeof revealCouple>>;

export type Variant = "cycle-first" | "partner-first" | "join-cycle" | "join-partner";
export type Prefill = {
  inviterName?: string;
  /** join-cycle: dados dela já cadastrados pelo parceiro. */
  selfName?: string; selfDate?: string; selfTime?: string; mode?: string; period?: number; cyclesCount?: number;
  /** Mapa do outro (ele, em join-cycle; ela, em join-partner), para a compatibilidade. */
  otherDate?: string; otherTime?: string; otherName?: string;
};

type Step = "role" | "welcome" | "meName" | "meBirth" | "meReveal" | "herName" | "herBirth" | "herReveal" | "couple" | "cycle" | "last" | "consent";

const STEPS: Record<Variant, Step[]> = {
  "cycle-first": ["welcome", "herName", "herBirth", "herReveal", "cycle", "last", "consent"],
  "partner-first": ["welcome", "meName", "meBirth", "meReveal", "herName", "herBirth", "herReveal", "couple", "cycle", "last"],
  "join-cycle": ["welcome", "herName", "herBirth", "herReveal", "couple", "cycle", "consent"],
  "join-partner": ["welcome", "meName", "meBirth", "meReveal", "couple", "consent"],
};

const MODES = [
  { id: "D28", t: "28 dias", d: "Duração mais comum" },
  { id: "D31", t: "31 dias", d: "Ciclo um pouco mais longo" },
  { id: "IRREGULAR", t: "Irregular", d: "A duração varia bastante entre ciclos" },
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

export function OnboardingFlow({ variant: initial, prefill = {} }: { variant: Variant | null; prefill?: Prefill }) {
  const [variant, setVariant] = useState<Variant | null>(initial);
  const [step, setStep] = useState<Step>(initial ? "welcome" : "role");
  const [pending, start] = useTransition();
  const [meName, setMeName] = useState("");
  const [meDate, setMeDate] = useState("");
  const [meTime, setMeTime] = useState("");
  const [name, setName] = useState(prefill.selfName ?? "");
  const [date, setDate] = useState(prefill.selfDate ?? "");
  const [time, setTime] = useState(prefill.selfTime ?? "");
  const [mode, setMode] = useState(prefill.mode ?? "D28");
  const [period, setPeriod] = useState(prefill.period ?? 5);
  const [last, setLast] = useState("");
  const [share, setShare] = useState(true);
  const [meR, setMeR] = useState<Reveal | null>(null);
  const [herR, setHerR] = useState<Reveal | null>(null);
  const [duo, setDuo] = useState<Duo | null>(null);
  const [error, setError] = useState("");
  const today = localISO();

  const steps: Step[] = variant ? STEPS[variant] : ["role"];
  const idx = Math.max(steps.indexOf(step), 0);
  const isFinal = !!variant && step === steps[steps.length - 1];
  const viewer = variant === "cycle-first" || variant === "join-cycle" ? "her" : "him";
  const her = viewer === "her"; // ela vendo a própria plataforma
  const other = prefill.inviterName || prefill.otherName || "";

  const skip = (s: Step) => (s === "meReveal" && variant === "partner-first" && !meDate) || (s === "couple" && !duo);
  const go = (s: Step) => { setError(""); setStep(s); window.scrollTo(0, 0); };
  const next = () => {
    let i = idx + 1;
    while (i < steps.length && skip(steps[i])) i++;
    go(steps[Math.min(i, steps.length - 1)]);
  };
  const back = () => {
    let i = idx - 1;
    while (i > 0 && skip(steps[i])) i--;
    go(steps[Math.max(i, 0)]);
  };

  const ready: Record<Step, boolean> = {
    role: false, welcome: true, meName: meName.trim().length > 0, meBirth: true, meReveal: true,
    herName: name.trim().length > 0, herBirth: !!date, herReveal: true, couple: true, cycle: true, last: !!last, consent: true,
  };

  /** Datas de cada pessoa para a compatibilidade, conforme quem já está cadastrado. */
  const himBirth = variant === "join-cycle" ? { d: prefill.otherDate ?? "", t: prefill.otherTime ?? "" } : { d: meDate, t: meTime };
  const herBirth = variant === "join-partner" ? { d: prefill.otherDate ?? "", t: prefill.otherTime ?? "" } : { d: date, t: time };

  function pickRole(v: Variant) {
    setVariant(v);
    setStep(STEPS[v][1]);
    window.scrollTo(0, 0);
  }

  function advance() {
    if (!variant) return;
    if (step === "role" || !ready[step] || pending) return;
    if (step === "meBirth" || step === "herBirth") {
      const mine = step === "meBirth" ? { d: meDate, t: meTime } : { d: date, t: time };
      if (!mine.d) return next();
      return start(async () => {
        try {
          if (steps.includes("couple") && himBirth.d && herBirth.d) {
            const r = await revealCouple(himBirth.d, himBirth.t, herBirth.d, herBirth.t, viewer);
            setDuo(r); setMeR(r.him); setHerR(r.her);
          } else if (step === "meBirth") setMeR(await revealSign(meDate, meTime, "him", viewer));
          else setHerR(await revealSign(date, time, "her", viewer));
          next();
        } catch { setError("Confira a data informada."); }
      });
    }
    if (isFinal) return; // envio pelo form
    next();
  }

  const score = useCountUp(duo?.couple.score ?? 0, step === "couple");
  const action = variant === "cycle-first" ? startAsCycle : variant === "partner-first" ? startAsPartner : variant === "join-cycle" ? joinAsCycle : joinAsPartner;

  return (
    <form action={action as unknown as (fd: FormData) => void} onSubmit={(e) => { if (!isFinal) { e.preventDefault(); advance(); } }} className="relative flex min-h-dvh flex-col">
      <Stars />
      <input type="hidden" name="myName" value={meName} /><input type="hidden" name="myBirthDate" value={meDate} /><input type="hidden" name="myBirthTime" value={meTime} />
      <input type="hidden" name="name" value={name} /><input type="hidden" name="birthDate" value={date} /><input type="hidden" name="birthTime" value={time} />
      <input type="hidden" name="cycleMode" value={mode} /><input type="hidden" name="periodLength" value={period} /><input type="hidden" name="lastPeriod" value={last} />
      <input type="hidden" name="shareCycle" value={share ? "on" : "off"} />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        {idx > 0 && variant ? (
          <button type="button" onClick={back} aria-label="Voltar" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-muted hover:bg-white/10"><Icon name="arrow" className="rotate-180" /></button>
        ) : <span className="h-11 w-11" />}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={idx} aria-valuemax={steps.length - 1}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#bfb0ff] to-[#ff7a9c] transition-all duration-700" style={{ width: `${variant ? (idx / (steps.length - 1)) * 100 : 0}%` }} />
        </div>
        <span className="h-11 w-11" />
      </header>

      <main key={step} className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-6">
        {step === "role" && (
          <Ask eyebrow="Bem-vindo(a)" title="Como você vai usar o Sintonia?" sub="Você pode convidar a outra pessoa depois, e os dados ficam compartilhados entre vocês.">
            <div className="space-y-3">
              <RoleCard title="Eu menstruo" desc="Acompanho o meu ciclo, vejo como estou a cada dia e posso convidar meu parceiro para entender e ajudar." onClick={() => pickRole("cycle-first")} />
              <RoleCard title="Acompanho minha parceira" desc="Entendo o ciclo dela e recebo orientações para o dia a dia. Ela pode entrar depois e assumir os próprios dados." onClick={() => pickRole("partner-first")} />
            </div>
          </Ask>
        )}

        {step === "welcome" && variant && (
          <div className="text-center">
            <div className="float pop mx-auto w-fit"><LogoMark size={96} /></div>
            <h1 className="font-display rise d1 mt-8 text-[2.4rem] leading-[1.06]">
              {variant === "cycle-first" ? <>Vamos montar o <span className="text-grad italic">seu</span> Sintonia</> :
               variant === "partner-first" ? <>Vamos entrar em <span className="text-grad italic">sintonia</span></> :
               <>{other || "Alguém"} convidou você</>}
            </h1>
            <p className="rise d2 mx-auto mt-4 max-w-xs text-lg text-muted">
              {variant === "cycle-first" && "Algumas perguntas rápidas e você passa a acompanhar o seu ciclo em primeira pessoa. Depois, se quiser, convide seu parceiro para ver junto."}
              {variant === "partner-first" && "Algumas perguntas rápidas para personalizar o app: seus dados, os dela e o ritmo do ciclo. Leva cerca de 1 minuto."}
              {variant === "join-cycle" && "Você vai acompanhar o seu ciclo em primeira pessoa. O que você registrar aparece para ele, e é você quem decide o que é compartilhado."}
              {variant === "join-partner" && "Você vai entender o que acontece em cada fase do ciclo dela e receber orientações no dia a dia. Ela decide o que compartilha com você."}
            </p>
          </div>
        )}

        {step === "meName" && (
          <Ask eyebrow="Primeiro, você" title="Como você se chama?" sub="Usamos o nome para personalizar as mensagens.">
            <input autoFocus value={meName} onChange={(e) => setMeName(e.target.value)} maxLength={60} placeholder="Seu nome" autoComplete="given-name" className="big-input" />
          </Ask>
        )}

        {step === "meBirth" && (
          <Ask eyebrow={`Prazer, ${meName.trim()}`} title="Quando você nasceu?" sub="Usamos a data para calcular o seu signo e o seu mapa astral.">
            <input type="date" value={meDate} onChange={(e) => setMeDate(e.target.value)} max={today} className="field text-lg" aria-label="Data de nascimento" />
            <label className="mt-4 block text-sm text-muted">Hora de nascimento <span className="opacity-60">(opcional: melhora a precisão da Lua e de Vênus)</span>
              <input type="time" value={meTime} onChange={(e) => setMeTime(e.target.value)} className="field mt-1.5" />
            </label>
            {variant === "partner-first" && <button type="button" onClick={() => { setMeDate(""); setMeTime(""); next(); }} className="mt-5 text-sm text-muted underline underline-offset-4">Prefiro não informar agora</button>}
          </Ask>
        )}

        {step === "meReveal" && meR && <RevealCard who={`${meName.trim()}, você é`} r={meR} />}

        {step === "herName" && (
          her ? (
            <Ask eyebrow="Primeiro, você" title="Como você se chama?" sub="Usamos o nome para personalizar o app e as mensagens.">
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Seu nome" autoComplete="given-name" className="big-input" />
            </Ask>
          ) : (
            <Ask eyebrow="Agora, ela" title="Como ela se chama?" sub="O nome pelo qual você a chama no dia a dia.">
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Nome dela" className="big-input" />
            </Ask>
          )
        )}

        {step === "herBirth" && (
          her ? (
            <Ask eyebrow={`Prazer, ${name.trim()}`} title="Quando você nasceu?" sub="Usamos a data para calcular o seu signo e o seu mapa astral.">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} className="field text-lg" aria-label="Data de nascimento" />
              <label className="mt-4 block text-sm text-muted">Hora de nascimento <span className="opacity-60">(opcional: melhora a precisão da Lua e de Vênus)</span>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1.5" />
              </label>
            </Ask>
          ) : (
            <Ask eyebrow={name.trim()} title={`Quando ${name.trim()} nasceu?`} sub="Usamos a data para calcular o mapa dela e a compatibilidade entre vocês.">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} className="field text-lg" aria-label="Data de nascimento dela" />
              <label className="mt-4 block text-sm text-muted">Hora de nascimento <span className="opacity-60">(opcional)</span>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1.5" />
              </label>
            </Ask>
          )
        )}

        {step === "herReveal" && herR && <RevealCard who={her ? `${name.trim()}, você é` : `${name.trim()} é`} r={herR} />}

        {step === "couple" && duo && (
          <div className="text-center">
            <p className="eyebrow rise">O céu de vocês dois</p>
            <div className="rise d1 mt-5"><Orbit a={duo.him.glyph} b={duo.her.glyph} /></div>
            <p className="font-display pop d3 mt-4 text-6xl leading-none"><span className="text-grad">{score}</span><span className="text-3xl text-muted">%</span></p>
            <p className="rise d3 mt-1 text-xs uppercase tracking-widest text-muted">de compatibilidade astral</p>
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
            <p className="mt-4 text-xs text-muted">Leitura simbólica: serve como ponto de partida para conversar, não como previsão.</p>
          </div>
        )}

        {step === "cycle" && (
          <Ask eyebrow={her ? "O seu ritmo" : "O ritmo dela"} title={her ? "Como é o seu ciclo?" : "Como é o ciclo dela?"}
            sub={`Escolha o que mais se aproxima. Depois de 3 menstruações registradas, o app passa a usar a média real ${her ? "dos seus ciclos" : "dos ciclos dela"}.`}>
            {prefill.cyclesCount ? <p className="mb-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-muted">{other} já registrou {prefill.cyclesCount} menstruaç{prefill.cyclesCount > 1 ? "ões" : "ão"}. Elas continuam valendo.</p> : null}
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
              <span className="pl-2 text-sm text-muted">Duração da menstruação<br /><b className="text-base text-ink">{period} dias</b></span>
              <span className="flex gap-2">
                <button type="button" aria-label="Menos um dia" onClick={() => setPeriod((p) => Math.max(2, p - 1))} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl">−</button>
                <button type="button" aria-label="Mais um dia" onClick={() => setPeriod((p) => Math.min(10, p + 1))} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl">+</button>
              </span>
            </div>
          </Ask>
        )}

        {step === "last" && (
          <Ask eyebrow="Último passo" title={her ? "Quando começou a sua última menstruação?" : "Quando começou a última menstruação?"} sub="Conte o primeiro dia de sangramento. Pode ser aproximado.">
            <div className="mb-3 flex flex-wrap gap-2">
              {[["Hoje", 0], ["Ontem", 1], ["Há 3 dias", 3], ["Há 1 semana", 7], ["Há 2 semanas", 14]].map(([l, n]) => (
                <button type="button" key={l as string} onClick={() => setLast(daysAgo(n as number))}
                  className={`min-h-[44px] rounded-full border px-4 text-sm transition ${last === daysAgo(n as number) ? "border-accent bg-accent/20 text-ink" : "border-line bg-white/5 text-muted hover:bg-white/10"}`}>{l}</button>
              ))}
            </div>
            <input type="date" value={last} onChange={(e) => setLast(e.target.value)} max={today} className="field text-lg" aria-label="Primeiro dia da última menstruação" />
          </Ask>
        )}

        {step === "consent" && (
          her ? (
            <Ask eyebrow="Privacidade" title="Você decide o que é compartilhado" sub={other ? `${other} vai ver o que você deixar liberado.` : "Quando seu parceiro entrar, ele vai ver o que você deixar liberado."}>
              <ul className="space-y-2.5 text-[15px] leading-snug">
                {[
                  "A fase do ciclo e as previsões (menstruação, ovulação, janela fértil).",
                  "As menstruações registradas: o que um registra, aparece para o outro.",
                  "Os seus check-ins e sinais, se você usar.",
                ].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{t}</span></li>)}
                <li className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-muted"><Icon name="lock" size={12} /></span><span><b>Nunca compartilhado:</b> as anotações pessoais do check-in.</span></li>
              </ul>
              <label className="mt-5 flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white/5 px-4">
                <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="h-5 w-5 accent-[#b9a8ff]" />
                <span className="text-[15px]">Compartilhar o meu ciclo com meu parceiro</span>
              </label>
              <p className="mt-2 text-xs text-muted">Você pode pausar ou retomar quando quiser, em Perfil.</p>
            </Ask>
          ) : (
            <Ask eyebrow="Privacidade" title="Ela decide o que compartilha" sub="Os dados do ciclo pertencem a quem menstrua. O que você vê depende da escolha dela.">
              <ul className="space-y-2.5 text-[15px] leading-snug">
                {[
                  "Você vê a fase, as previsões e as orientações enquanto ela mantiver o compartilhamento ligado.",
                  "As menstruações registradas aparecem para os dois, e você também pode registrar.",
                  "Se ela usar check-ins e sinais, você recebe o que ela deixar liberado.",
                ].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{t}</span></li>)}
                <li className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-muted"><Icon name="lock" size={12} /></span><span>As anotações pessoais dela nunca são compartilhadas, e ela pode pausar o acesso a qualquer momento.</span></li>
              </ul>
            </Ask>
          )
        )}

        {error && <p role="alert" className="mt-4 text-center text-sm text-rose">{error}</p>}
      </main>

      {step !== "role" && (
        <footer className="relative z-10 mx-auto w-full max-w-md px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-2">
          <button type="submit" disabled={!ready[step] || pending} className="btn w-full text-base">
            {pending ? "Calculando…" : cta(step, her, isFinal)}
            {!pending && <Icon name={isFinal ? "spark" : "arrow"} size={18} />}
          </button>
        </footer>
      )}

      <style>{`.big-input{width:100%;background:transparent;border:0;border-bottom:2px solid #ffffff30;padding:.5rem 0 .75rem;font-family:var(--font-fraunces),serif;font-size:2.2rem;color:var(--text);outline:none;transition:border-color .2s}.big-input:focus{border-color:var(--accent)}.big-input::placeholder{color:#ffffff30}`}</style>
    </form>
  );
}

function cta(s: Step, her: boolean, final: boolean) {
  if (final) return "Concluir";
  return ({
    role: "", welcome: "Começar", meName: "Continuar", meBirth: "Calcular meu mapa", meReveal: "Continuar",
    herName: "Continuar", herBirth: her ? "Calcular meu mapa" : "Calcular o mapa dela", herReveal: "Continuar",
    couple: "Continuar", cycle: "Continuar", last: "Continuar", consent: "Continuar",
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

function RoleCard({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="card w-full p-5 text-left transition hover:bg-white/10 active:scale-[.99]">
      <span className="flex items-center justify-between gap-3"><span className="font-display text-xl">{title}</span><Icon name="arrow" className="text-accent" /></span>
      <span className="mt-1 block text-[15px] leading-relaxed text-muted">{desc}</span>
    </button>
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
      {r.approx && <p className="mt-4 text-xs text-muted">Sem a hora de nascimento, a Lua e Vênus são aproximadas.</p>}
    </div>
  );
}
