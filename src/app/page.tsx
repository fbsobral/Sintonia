import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Ring } from "@/components/Ring";
import { Logo } from "@/components/Logo";
import { Orbit, Stars } from "@/components/Orbit";
import { Icon } from "@/components/Icon";
import { phaseRanges } from "@/lib/cycle";
import { PHASES, STAGES } from "@/lib/tips";

const STEPS = [
  ["1", "Configure em 1 minuto", "Informe o ritmo do ciclo dela (28 dias, 31 ou irregular), a duração da menstruação e o primeiro dia da última."],
  ["2", "Registre cada menstruação", "A partir de 3 registros, o app passa a usar a média real e calcula a regularidade e a margem de erro das previsões."],
  ["3", "Receba o resumo diário", "No app ou por e-mail: a fase, o que está acontecendo, o que ajuda, o que evitar e como abrir a conversa."],
];

const FAQ = [
  ["Ela precisa saber que eu uso o app?", "Não é obrigatório, mas o app funciona melhor com transparência. Dizer que você quer entender melhor o ciclo dela costuma ser bem recebido, e ela pode corrigir o que o app errar."],
  ["As previsões são confiáveis?", "São estimativas por média. Em ciclos regulares a margem costuma ser de 1 a 2 dias; em ciclos irregulares ela é maior, e o app mostra isso. Nenhum calendário prevê a ovulação com precisão individual."],
  ["Serve como método contraceptivo?", "Não. Métodos baseados em calendário têm taxa de falha relevante. Para contracepção, siga a orientação de um médico."],
  ["O que o app faz com os meus dados?", "Guardamos apenas o que você informa (datas de ciclo, nascimento e preferências de e-mail), ligado à sua conta. Você pode editar ou apagar registros quando quiser."],
  ["A astrologia tem base científica?", "Não. Ela entra como repertório simbólico para conversar sobre estilos e preferências. O cálculo do ciclo e as orientações de saúde usam fisiologia, e as duas partes ficam separadas."],
  ["Quanto custa?", "Por enquanto, é gratuito."],
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/hoje");

  const demo = PHASES.lutea;
  const demoStage = STAGES.lutea[4];
  const ranges = phaseRanges(28, 5);
  const total = Object.values(STAGES).reduce((n, s) => n + s.length, 0);

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
          <p className="eyebrow inline-block rounded-full border border-line bg-white/5 px-3.5 py-1.5">Para quem quer entender melhor a parceira</p>
          <h1 className="font-display mt-5 text-[2.6rem] leading-[1.05] md:text-6xl">
            Entenda o ciclo dela. Esteja em <em className="text-grad">sintonia</em>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            O Sintonia mostra em que fase ela está, o que os hormônios estão fazendo e como agir: o que ajuda, o que evitar e como abrir a conversa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="btn">Começar grátis</Link>
            <a href="#como-funciona" className="btn btn-ghost">Ver como funciona</a>
          </div>
          <p className="mt-4 text-sm text-muted">Gratuito · Configuração em 1 minuto · Resumo diário por e-mail</p>
        </div>

        {/* Preview do app */}
        <div className="rise relative mx-auto w-full max-w-[320px]" aria-hidden>
          <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${demo.color}, transparent 65%)` }} />
          <div className="rounded-[2.2rem] border border-white/15 bg-[#120f26] p-3 shadow-2xl">
            <div className="rounded-[1.7rem] p-4" style={{ background: `linear-gradient(180deg, ${demo.soft}, #1a1738)` }}>
              <p className="text-xs text-muted">Hoje com Ana</p>
              <Ring length={28} ranges={ranges} day={25}>
                <span className="text-[10px] uppercase tracking-widest text-muted">Dia</span>
                <span className="font-display text-5xl leading-none">25</span>
                <span className="text-xs text-muted">de 28</span>
              </Ring>
              <div className="mt-3 text-center">
                <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${demo.color}26`, color: demo.color }}>Fase {demo.name} · janela de TPM</span>
                <p className="font-display mt-1 text-lg">{demoStage.name}</p>
              </div>
              <div className="mt-4 rounded-2xl bg-black/25 p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: demo.color }}>O que ajuda</p>
                <p className="mt-1 text-sm leading-snug">{demoStage.do[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXTO */}
      <section className="mx-auto max-w-3xl px-5 py-14 text-center">
        <h2 className="font-display text-3xl leading-tight md:text-4xl">Humor, energia e paciência variam ao longo do ciclo. Isso é fisiologia.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Estrogênio e progesterona mudam de forma previsível ao longo do mês e influenciam sono, disposição e tolerância ao estresse, com intensidade diferente em cada mulher. Saber em que ponto ela está ajuda a não levar as oscilações para o lado pessoal e a escolher o melhor momento para cada conversa.
        </p>
      </section>

      {/* FASES */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="font-display text-3xl md:text-4xl">Quatro fases, {total} momentos</h2>
        <p className="mt-2 max-w-xl text-muted">Cada fase se divide em momentos, cada um com hormônios, tendências e orientações próprias. O conteúdo muda ao longo dos dias, não só entre as fases.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Object.values(PHASES).map((p) => (
            <article key={p.key} className="card p-5" style={{ borderColor: `${p.color}44` }}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                <h3 className="font-display text-xl">{p.name}</h3>
                <span className="ml-auto text-xs text-muted">{STAGES[p.key].length} momentos</span>
              </div>
              <p className="mt-1 text-sm font-medium" style={{ color: p.color }}>{p.tagline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.blurb}</p>
              <p className="mt-3 text-[15px] leading-relaxed"><span className="text-emerald-300">✓</span> {p.highlight}</p>
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
          <h3 className="font-display text-2xl">Resumo diário por e-mail</h3>
          <p className="mt-1 max-w-xl text-muted">Uma mensagem curta no horário que você escolher: a fase do dia, o que está acontecendo no corpo dela e uma sugestão de como abrir a conversa.</p>
          <div className="mt-4 rounded-2xl border-l-4 bg-white/5 p-4" style={{ borderColor: demo.color }}>
            <p className="text-xs uppercase tracking-widest text-muted">Como abrir a conversa</p>
            <p className="font-display mt-1 text-lg">{demoStage.talk[0]}</p>
          </div>
        </article>
        <article className="card p-6">
          <h3 className="font-display text-2xl">Previsão que aprende</h3>
          <p className="mt-1 text-muted">Ciclos de 28, 31 dias ou irregulares. Quanto mais registros, melhor a estimativa, com margem de erro e regularidade sempre à vista.</p>
        </article>
        <article className="card p-6">
          <h3 className="font-display text-2xl">Fertilidade e TPM no radar</h3>
          <p className="mt-1 text-muted">Mostra a janela fértil (cerca de 6 dias) e o período provável de sintomas pré-menstruais, com base em critérios clínicos.</p>
        </article>
        <article className="card flex items-center gap-5 p-6 md:col-span-2">
          <div className="hidden sm:block"><Orbit a="♏︎" b="♋︎" size={150} /></div>
          <div>
            <h3 className="font-display text-2xl">Astrologia como roteiro de conversa</h3>
            <p className="mt-1 text-muted">Mapa dos dois e compatibilidade entre vocês, com leitura de essência, emoções, atração e acolhimento. É uma leitura simbólica, usada como repertório e não como ciência.</p>
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
              <p className="pb-4 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center" style={{ background: "radial-gradient(90% 70% at 50% 100%, #4a3bb0 0%, #2a2160 45%, var(--bg) 100%)" }}>
        <Orbit a="♏︎" b="♋︎" />
        <h2 className="font-display mt-8 max-w-3xl text-4xl leading-[1.08] md:text-6xl">Entenda o que está acontecendo e responda melhor a cada dia.</h2>
        <Link href="/sign-up" className="btn mt-10 px-8 text-lg">Criar minha conta grátis<Icon name="arrow" size={18} /></Link>
        <p className="mt-4 text-sm text-muted">Gratuito · Configuração em 1 minuto</p>
      </section>

      <footer className="mx-auto max-w-5xl px-5 pb-[max(env(safe-area-inset-bottom),2rem)] pt-6 text-center text-xs leading-relaxed text-muted">
        <p>Conteúdo informativo, sem finalidade de diagnóstico, tratamento ou contracepção. Em caso de dor intensa, sangramento anormal ou sintomas emocionais graves, procure atendimento médico. A astrologia é uma leitura simbólica, sem base científica.</p>
        <p className="mt-3 flex justify-center opacity-70"><Logo size={22} /></p>
      </footer>
    </div>
  );
}
