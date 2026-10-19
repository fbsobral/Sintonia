import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Ring } from "@/components/Ring";
import { Logo } from "@/components/Logo";
import { Orbit, Stars } from "@/components/Orbit";
import { Icon } from "@/components/Icon";
import { phaseRanges } from "@/lib/cycle";
import { PHASES } from "@/lib/tips";

const STEPS = [
  ["1", "Conte o básico", "Nome, nascimento e o ritmo do ciclo dela: 28 dias, 31 ou irregular. Leva 1 minuto."],
  ["2", "Registre as menstruações", "A cada novo registro o Sintonia aprende. Depois de 3, ele passa a usar a média real dela."],
  ["3", "Abra o app ou leia o e-mail", "Todo dia você sabe a fase, o que fazer, o que evitar e como abrir a conversa."],
];

const FAQ = [
  ["Ela precisa saber que eu uso?", "Não é obrigatório, mas funciona melhor com transparência. Mostrar o app e dizer “quero te entender melhor” costuma render mais carinho que qualquer dica."],
  ["Isso serve como método contraceptivo?", "Não. As datas são estimativas feitas a partir dos ciclos registrados. Para contracepção, siga a orientação médica."],
  ["E se o ciclo dela for irregular?", "Escolha “Irregular” e vá registrando. Com 3 menstruações o app passa a usar a média real e a previsão melhora a cada ciclo."],
  ["O que acontece com meus dados?", "Guardamos só o que você informa, ligado à sua conta. Você pode apagar um registro a qualquer momento."],
  ["Quanto custa?", "Por enquanto, nada."],
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/hoje");

  const demo = PHASES.lutea;
  const ranges = phaseRanges(28, 5);

  return (
    <div className="overflow-x-clip">
      <Stars />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <Logo size={30} />
        <Link href="/sign-in" className="flex min-h-[44px] items-center rounded-full px-4 text-sm text-muted hover:text-ink">Entrar</Link>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-2 md:pt-16">
        <div className="rise">
          <p className="eyebrow inline-block rounded-full border border-line bg-white/5 px-3.5 py-1.5">Para quem quer acertar mais</p>
          <h1 className="font-display mt-5 text-[2.7rem] leading-[1.04] md:text-6xl">
            Entenda o momento dela. Esteja em <em className="text-grad">sintonia</em>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            O Sintonia mostra em que fase do ciclo ela está e o que fazer hoje: como conversar, o que evitar e quando dar mais atenção. Menos conflito, mais presença.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="btn">Começar grátis</Link>
            <a href="#como-funciona" className="btn btn-ghost">Ver como funciona</a>
          </div>
          <p className="mt-4 text-sm text-muted">Grátis · Pronto em 1 minuto · Aviso diário por e-mail</p>
        </div>

        {/* Preview do app */}
        <div className="rise relative mx-auto w-full max-w-[320px]" aria-hidden>
          <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${demo.color}, transparent 65%)` }} />
          <div className="rounded-[2.2rem] border border-white/15 bg-[#120f26] p-3 shadow-2xl">
            <div className="rounded-[1.7rem] p-4" style={{ background: `linear-gradient(180deg, ${demo.soft}, #1a1730)` }}>
              <p className="text-xs text-muted">Hoje com Ana</p>
              <Ring length={28} ranges={ranges} day={21}>
                <span className="text-[10px] uppercase tracking-widest text-muted">Dia</span>
                <span className="font-display text-5xl leading-none">21</span>
                <span className="text-xs text-muted">de 28</span>
              </Ring>
              <div className="mt-3 text-center">
                <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${demo.color}26`, color: demo.color }}>Fase {demo.name}</span>
                <p className="font-display mt-1 text-lg">{demo.tagline}</p>
              </div>
              <div className="mt-4 rounded-2xl bg-black/25 p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: demo.color }}>Dica do dia</p>
                <p className="mt-1 text-sm leading-snug">Mantenha a rotina previsível. Mudanças de última hora pesam mais.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-3xl px-5 py-14 text-center">
        <h2 className="font-display text-3xl leading-tight md:text-4xl">Você não precisa adivinhar o humor dela.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          O ciclo muda energia, sono, paciência e vontade de sair. Quem sabe disso cedo evita a briga que ninguém queria e aproveita melhor os dias bons.
        </p>
      </section>

      {/* FASES */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="font-display text-3xl md:text-4xl">Quatro fases, um plano para cada uma</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Object.values(PHASES).map((p) => (
            <article key={p.key} className="card p-5" style={{ borderColor: `${p.color}44` }}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                <h3 className="font-display text-xl">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm font-medium" style={{ color: p.color }}>{p.tagline}</p>
              <p className="mt-3 text-[15px] text-muted">{p.mood}</p>
              <p className="mt-3 text-[15px]"><span className="text-emerald-300">✓</span> {p.do[0]}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-14">
        <h2 className="font-display text-3xl md:text-4xl">Como funciona</h2>
        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <li key={n} className="card p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 font-bold text-accent">{n}</span>
              <h3 className="font-display mt-3 text-xl">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* RECURSOS */}
      <section className="mx-auto grid max-w-5xl gap-3 px-5 py-6 md:grid-cols-2">
        <article className="card p-6 md:col-span-2">
          <h3 className="font-display text-2xl">Um aviso toda manhã</h3>
          <p className="mt-1 max-w-xl text-muted">Um e-mail curto com a fase do dia, a dica e uma frase pronta para puxar conversa. Você escolhe o horário.</p>
          <div className="mt-4 rounded-2xl border-l-4 bg-white/5 p-4" style={{ borderColor: demo.color }}>
            <p className="text-xs uppercase tracking-widest text-muted">Para puxar papo</p>
            <p className="font-display mt-1 text-lg">“Percebi que o dia foi puxado. Quer me contar ou prefere que eu só fique perto?”</p>
          </div>
        </article>
        <article className="card p-6">
          <h3 className="font-display text-2xl">Aprende o ritmo dela</h3>
          <p className="mt-1 text-muted">Ciclos de 28, 31 dias ou irregulares. Quanto mais você registra, mais a previsão acompanha a realidade.</p>
        </article>
        <article className="card p-6">
          <h3 className="font-display text-2xl">Seu mapa e o dela</h3>
          <p className="mt-1 text-muted">Sol, Lua, Vênus e Marte dos dois, e o que isso diz sobre como cada um ama, se emociona e discute.</p>
        </article>
        <article className="card flex items-center gap-5 p-6 md:col-span-2">
          <div className="hidden sm:block"><Orbit a="♏" b="♋" size={150} /></div>
          <div>
            <h3 className="font-display text-2xl">Compatibilidade de vocês dois</h3>
            <p className="mt-1 text-muted">Veja onde vocês fluem e onde pedem cuidado: essência, emoções, atração e acolhimento, com dicas práticas para cada ponto.</p>
          </div>
        </article>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-display text-3xl md:text-4xl">Perguntas frequentes</h2>
        <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}<span className="text-xl text-muted transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="pb-4 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center" style={{ background: "radial-gradient(90% 70% at 50% 100%, #4a3bb0 0%, #2a2160 45%, var(--bg) 100%)" }}>
        <Orbit a="♏" b="♋" />
        <h2 className="font-display mt-8 max-w-3xl text-4xl leading-[1.08] md:text-6xl">Comece hoje. Amanhã de manhã você já sabe como conduzir o dia.</h2>
        <Link href="/sign-up" className="btn mt-10 px-8 text-lg">Criar minha conta grátis<Icon name="arrow" size={18} /></Link>
        <p className="mt-4 text-sm text-muted">Grátis · Pronto em 1 minuto</p>
      </section>

      <footer className="mx-auto max-w-5xl px-5 pb-[max(env(safe-area-inset-bottom),2rem)] text-center text-xs text-muted">
        <p>As previsões são estimativas e não substituem orientação médica nem servem como método contraceptivo. Astrologia é inspiração, não ciência.</p>
        <p className="mt-3 flex justify-center opacity-70"><Logo size={22} /></p>
      </footer>
    </div>
  );
}
