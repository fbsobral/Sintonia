"use client";
/** Miniaturas das telas do app, usadas nos guias. Decorativas (aria-hidden): o texto do passo carrega o sentido. */

export type VisualId =
  | "logo" | "ring" | "strip" | "checkin" | "signal" | "advice" | "moon"
  | "calendar" | "form" | "history" | "tabs" | "birth" | "score"
  | "privacy" | "shared" | "email" | "profile" | "invite";

const C = { men: "#E0566B", fol: "#3FB58A", ov: "#F2B134", lut: "#8B6FE0" };
const pop = (n: number) => ({ animation: "pop .5s both", animationDelay: `${n * 0.08}s` });

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: `${color}26`, color }}>{children}</span>;
}
function Tick({ ok = true }: { ok?: boolean }) {
  return <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full text-[8px] ${ok ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"}`}>{ok ? "✓" : "✕"}</span>;
}
function Toggle({ on }: { on: boolean }) {
  return <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-accent" : "bg-white/20"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${on ? "left-[18px]" : "left-0.5"}`} /></span>;
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl bg-black/25 px-3 py-2 text-[11px]">{children}</div>;
}

function RingMini({ day = 25 }: { day?: number }) {
  const L = 28, R = 40, circ = 2 * Math.PI * R;
  const arcs: [number, number, string][] = [[1, 5, C.men], [6, 11, C.fol], [12, 15, C.ov], [16, 28, C.lut]];
  const a = ((day - 0.5) / L) * 2 * Math.PI - Math.PI / 2;
  return (
    <svg viewBox="0 0 100 100" className="h-[104px] w-[104px]">
      {arcs.map(([s, e, c]) => (
        <circle key={c} cx="50" cy="50" r={R} fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" opacity=".9"
          strokeDasharray={`${((e - s + 1) / L) * circ - 1.5} ${circ}`} strokeDashoffset={-((s - 1) / L) * circ} transform="rotate(-90 50 50)" />
      ))}
      <circle cx={50 + R * Math.cos(a)} cy={50 + R * Math.sin(a)} r="5.5" fill="#fff" />
      <circle cx={50 + R * Math.cos(a)} cy={50 + R * Math.sin(a)} r="2.5" fill="#0f0d1f" />
      <text x="50" y="47" textAnchor="middle" fontSize="6" fill="#a29dc0" letterSpacing="1">DIA</text>
      <text x="50" y="63" textAnchor="middle" fontSize="19" fill="#f1eefb" fontFamily="Georgia, serif">{day}</text>
    </svg>
  );
}

const CAL: string[] = (() => {
  const L = 28; const out: string[] = [];
  for (let d = 1; d <= 28; d++) out.push(d <= 5 ? C.men : d <= 11 ? C.fol : d <= 15 ? C.ov : C.lut);
  return out.slice(0, L);
})();

export function TourVisual({ id }: { id: VisualId }) {
  let body: React.ReactNode = null;
  switch (id) {
    case "logo":
      body = (
        <svg viewBox="0 0 64 64" className="h-24 w-24" style={pop(0)}>
          <circle cx="25" cy="32" r="18" fill="none" stroke="#9d8aff" strokeWidth="4.5" />
          <circle cx="39" cy="32" r="18" fill="none" stroke="#ff7a9c" strokeWidth="4.5" />
          <path d="M32 18.4a18 18 0 010 27.2 18 18 0 010-27.2z" fill="#ffe9b8" />
        </svg>
      );
      break;
    case "ring":
      body = (
        <div className="flex items-center gap-4">
          <div style={pop(0)}><RingMini /></div>
          <div className="space-y-1.5" style={pop(2)}>
            <Pill color={C.lut}>Fase Lútea</Pill>
            <div className="rounded-xl bg-black/25 px-2.5 py-1.5"><p className="text-[8px] uppercase tracking-wider text-muted">Próxima menstruação</p><p className="text-[12px] font-semibold">em 4 dias</p></div>
            <div className="rounded-xl bg-black/25 px-2.5 py-1.5"><p className="text-[8px] uppercase tracking-wider text-muted">Fertilidade</p><p className="text-[12px] font-semibold">baixa</p></div>
          </div>
        </div>
      );
      break;
    case "strip":
      body = (
        <div className="w-full max-w-[290px]">
          <div className="flex gap-1">
            {[22, 23, 24, 25, 26, 27, 28].map((d, i) => {
              const on = i === 3; const col = d <= 27 ? C.lut : C.men;
              return (
                <div key={d} className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 ${on ? "bg-white/15 shadow-[0_0_20px_-6px_#bfb0ff]" : ""}`} style={pop(i)}>
                  <span className="text-[8px] uppercase text-muted">{on ? "hoje" : ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"][i]}</span>
                  <span className={`text-sm font-semibold ${on ? "text-ink" : "text-muted"}`}>{d}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: col }} />
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[10px] text-muted">Toque num dia para ver o passado ou o futuro</p>
        </div>
      );
      break;
    case "checkin":
      body = (
        <div className="w-full max-w-[280px] space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {["Cansada", "Sensível", "Cólica", "Inchaço"].map((t, i) => (
              <span key={t} className={`rounded-full border px-2.5 py-1 text-[11px] ${i < 3 ? "border-accent bg-accent/20" : "border-line bg-white/5 text-muted"}`} style={pop(i)}>{t}</span>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-[11px]" style={pop(4)}><span>Preciso de espaço</span><span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">Enviar</span></div>
        </div>
      );
      break;
    case "signal":
      body = (
        <div className="w-full max-w-[280px] space-y-2">
          <div className="rounded-2xl border border-rose/50 bg-rose/10 p-3" style={pop(0)}>
            <p className="text-[8px] font-bold uppercase tracking-widest text-rose">Aviso</p>
            <p className="font-display text-[15px] leading-tight">Ana precisa de espaço hoje</p>
            <p className="mt-1 text-[10px] leading-snug text-muted">Não leve para o lado pessoal. Ofereça ajuda sem insistir.</p>
          </div>
          <div className="flex flex-wrap gap-1.5" style={pop(2)}>
            {["Cansada", "Sensível", "Cólica"].map((t) => <span key={t} className="rounded-full border border-accent bg-accent/20 px-2.5 py-0.5 text-[10px]">{t}</span>)}
          </div>
        </div>
      );
      break;
    case "advice":
      body = (
        <div className="grid w-full max-w-[290px] grid-cols-2 gap-2">
          <div className="rounded-xl bg-black/25 p-2.5" style={pop(0)}>
            <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-300">O que ajuda</p>
            {["Um jantar leve", "Ouvir sem resolver"].map((t) => <p key={t} className="mt-1.5 flex gap-1.5 text-[10px] leading-tight"><Tick />{t}</p>)}
          </div>
          <div className="rounded-xl bg-black/25 p-2.5" style={pop(2)}>
            <p className="text-[8px] font-bold uppercase tracking-wider text-rose-300">O que evitar</p>
            {["Cobrar decisões", "Minimizar o humor"].map((t) => <p key={t} className="mt-1.5 flex gap-1.5 text-[10px] leading-tight"><Tick ok={false} />{t}</p>)}
          </div>
          <div className="col-span-2 rounded-xl bg-black/25 px-3 py-2 text-[11px] italic" style={{ ...pop(4), borderLeft: `2px solid ${C.lut}` }}>“Hoje preciso de um tempo, mas gosto de ter você aqui.”</div>
        </div>
      );
      break;
    case "moon":
      body = (
        <div className="w-full max-w-[250px] rounded-2xl bg-black/25 p-3" style={pop(0)}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" className="h-11 w-11 shrink-0"><circle cx="20" cy="20" r="17" fill="#2a2455" /><path d="M20 3a17 17 0 010 34 11 17 0 010-34z" fill="#ffe9b8" /></svg>
            <div><p className="font-display text-[15px] leading-tight">Crescente em Touro</p><p className="text-[10px] text-muted">Lua do dia × seu ciclo</p></div>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[9px] text-muted"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-[58%] rounded-full bg-[#ffe9b8]" /></span>58%</div>
        </div>
      );
      break;
    case "calendar":
      body = (
        <div className="w-full max-w-[210px]">
          <div className="grid grid-cols-7 gap-[3px]">
            {CAL.map((c, i) => (
              <span key={i} className="relative grid aspect-square place-items-center rounded-[5px] text-[8px] font-semibold" style={{ background: `${c}${i < 5 ? "55" : "30"}`, color: c, animation: "pop .4s both", animationDelay: `${i * 0.015}s` }}>
                {i + 1}{i === 13 && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-white" />}
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[8px] text-muted">{[["Menstruação", C.men], ["Folicular", C.fol], ["Ovulatória", C.ov], ["Lútea", C.lut]].map(([n, c]) => <span key={n} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</span>)}</div>
        </div>
      );
      break;
    case "form":
      body = (
        <div className="w-full max-w-[250px] space-y-2">
          <div style={pop(0)}><p className="text-[9px] text-muted">Primeiro dia</p><div className="mt-0.5 rounded-xl border border-accent bg-white/8 px-3 py-2 text-[12px]">1 Nov 2026</div></div>
          <div style={pop(2)}><p className="text-[9px] text-muted">Último dia <span className="opacity-70">(opcional)</span></p><div className="mt-0.5 rounded-xl border border-line bg-white/5 px-3 py-2 text-[12px] text-muted">—</div></div>
          <div className="rounded-full bg-gradient-to-r from-white to-[#cfc2ff] py-2 text-center text-[12px] font-bold text-[#15112e]" style={pop(4)}>Salvar</div>
        </div>
      );
      break;
    case "history":
      body = (
        <div className="w-full max-w-[270px] space-y-1.5">
          {[["1 de novembro → 5 de nov.", "Ciclo em andamento"], ["4 de outubro → 8 de out.", "Ciclo de 28 dias"]].map(([t, s], i) => (
            <div key={t} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2" style={pop(i * 2)}>
              <div><p className="text-[11px] font-medium">{t}</p><p className="text-[9px] text-muted">{s}</p></div>
              <div className="flex gap-1.5 text-[12px] text-muted"><span className={`grid h-7 w-7 place-items-center rounded-full ${i === 0 ? "bg-accent/25 text-accent" : ""}`}>✎</span><span className="grid h-7 w-7 place-items-center rounded-full">✕</span></div>
            </div>
          ))}
        </div>
      );
      break;
    case "tabs":
      body = (
        <div className="w-full max-w-[270px] space-y-2.5">
          <div className="flex gap-1 rounded-full border border-line bg-white/5 p-1 text-[11px]">
            {["Nós dois", "Ele", "Você"].map((t, i) => <span key={t} className={`flex-1 rounded-full py-1.5 text-center ${i === 0 ? "bg-white/15 text-ink" : "text-muted"}`}>{t}</span>)}
          </div>
          <div className="flex items-center justify-center gap-4" style={pop(1)}>
            <span className="grid h-12 w-12 place-items-center rounded-full text-xl" style={{ background: "#7b61ff55" }}>♏︎</span>
            <span className="font-display text-3xl"><span className="text-grad">87</span><span className="text-lg text-muted">%</span></span>
            <span className="grid h-12 w-12 place-items-center rounded-full text-xl" style={{ background: "#ff5e8a55" }}>♋︎</span>
          </div>
        </div>
      );
      break;
    case "score":
      body = (
        <div className="flex items-center gap-3" style={pop(0)}>
          <span className="grid h-12 w-12 place-items-center rounded-full text-xl" style={{ background: "#7b61ff55" }}>♏︎</span>
          <div className="text-center"><p className="font-display text-3xl leading-none"><span className="text-grad">87</span><span className="text-lg text-muted">%</span></p><p className="mt-1 text-[8px] uppercase tracking-widest text-muted">compatibilidade</p></div>
          <span className="grid h-12 w-12 place-items-center rounded-full text-xl" style={{ background: "#ff5e8a55" }}>♋︎</span>
        </div>
      );
      break;
    case "birth":
      body = (
        <div className="w-full max-w-[250px] space-y-2">
          <div style={pop(0)}><p className="text-[9px] text-muted">Data de nascimento</p><div className="mt-0.5 rounded-xl border border-accent bg-white/8 px-3 py-2 text-[12px]">14 Nov 1992</div></div>
          <div style={pop(2)}><p className="text-[9px] text-muted">Hora (opcional)</p><div className="mt-0.5 rounded-xl border border-line bg-white/5 px-3 py-2 text-[12px] text-muted">08:30</div></div>
        </div>
      );
      break;
    case "privacy":
      body = (
        <div className="w-full max-w-[270px] space-y-2">
          <Row><span className="flex items-center gap-2"><span className="text-accent">🔒</span>Compartilhar meu ciclo</span><Toggle on /></Row>
          <p className="rounded-xl bg-black/25 px-3 py-2 text-[10px] leading-snug text-muted" style={pop(2)}><b className="text-ink">Nunca compartilhado:</b> as anotações pessoais do check-in.</p>
        </div>
      );
      break;
    case "shared":
      body = (
        <div className="w-full max-w-[270px] space-y-2">
          <div className="rounded-2xl bg-black/25 p-3 text-center" style={pop(0)}>
            <p className="font-display text-[15px]">Ana pausou o compartilhamento</p>
            <p className="mt-1 text-[10px] text-muted">Você volta a ver tudo quando ela retomar.</p>
          </div>
        </div>
      );
      break;
    case "email":
      body = (
        <div className="w-full max-w-[270px] space-y-2">
          <Row><span>Receber o resumo todo dia</span><Toggle on /></Row>
          <Row><span>Horário</span><span className="rounded-lg bg-white/10 px-2 py-0.5">08:00</span></Row>
          <Row><span>Avisar quando o outro registrar</span><Toggle on /></Row>
        </div>
      );
      break;
    case "profile":
      body = (
        <div className="w-full max-w-[270px] space-y-1.5">
          {[["Você", "Acompanha o próprio ciclo", false], ["Parceiro", "Acompanha o ciclo da parceira", true]].map(([n, s, ok], i) => (
            <div key={String(n)} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2" style={pop(i * 2)}>
              <div><p className="text-[12px] font-medium">{n}</p><p className="text-[9px] text-muted">{s}</p></div>
              {ok && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">conectado</span>}
            </div>
          ))}
        </div>
      );
      break;
    case "invite":
      body = (
        <div className="w-full max-w-[270px] space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white/5 px-3 py-2 text-[10px] text-muted" style={pop(0)}><span className="min-w-0 flex-1 truncate">sintonia.app/convite/Xk3…</span><span className="rounded-full bg-white/15 px-2 py-0.5 text-ink">Copiar</span></div>
          <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-semibold" style={pop(2)}>
            <span className="rounded-full bg-[#25d366]/20 py-2 text-[#7ee8a8]">WhatsApp</span>
            <span className="rounded-full bg-white/10 py-2">E-mail</span>
          </div>
        </div>
      );
      break;
  }
  return (
    <div aria-hidden className="flex h-[150px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/10 to-white/[0.02] px-3 py-3">
      {body}
    </div>
  );
}
