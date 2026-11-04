import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Ring } from "@/components/Ring";
import { Logo } from "@/components/Logo";
import { Orbit, Stars } from "@/components/Orbit";
import { Icon } from "@/components/Icon";
import { phaseRanges } from "@/lib/cycle";
import { PHASES, STAGES, stageForViewer } from "@/lib/tips";
import { SIGNALS } from "@/lib/checkin";
import type { IconName } from "@/components/Icon";

const first = (s: string) => s.split(/(?<=\.)\s/)[0];

const STEPS = [
  ["1", "Um dos dois cria a conta", "Quem menstrua informa o próprio ciclo; o parceiro pode começar cadastrando os dados dela. Leva cerca de 1 minuto."],
  ["2", "Convida o outro", "Por link, WhatsApp ou e-mail. Quem aceita entra no mesmo casal e vê o ciclo pela própria perspectiva."],
  ["3", "Os dois acompanham o mesmo ciclo", "O que um registra aparece para o outro, e as previsões se atualizam para os dois, com margem de erro e regularidade à vista."],
];

const FAQ = [
  ["Posso usar sozinha, sem o meu parceiro?", "Sim. Quem menstrua pode usar o Sintonia só para acompanhar o próprio ciclo e convidar o parceiro quando quiser."],
  ["E se eu sou o parceiro e ela ainda não sabe?", "Você pode começar cadastrando os dados dela, mas o app funciona melhor com ela dentro: ela corrige o que estiver errado, vê o ciclo em primeira pessoa e decide o que compartilha. Convidar é um bom jeito de abrir essa conversa."],
  ["Ela pode esconder o ciclo de mim?", "Pode, e é por design. Os dados do ciclo pertencem a quem menstrua: ela liga ou pausa o compartilhamento quando quiser, e as anotações pessoais dela nunca são mostradas. Quando pausa, você deixa de ver o ciclo e de receber o resumo diário."],
  ["Quem pode editar os registros?", "Os dois podem registrar uma menstruação, e o app mostra quem registrou. Os dados do perfil dela (nascimento, ritmo do ciclo) passam a ser editados só por ela depois que ela entra."],
  ["As previsões são confiáveis?", "São estimativas por média. Em ciclos regulares a margem costuma ser de 1 a 2 dias; em ciclos irregulares ela é maior, e o app mostra isso. Nenhum calendário prevê a ovulação com precisão individual."],
  ["Serve como método contraceptivo?", "Não. Métodos baseados em calendário têm taxa de falha relevante. Para contracepção, siga a orientação de um médico."],
  ["E se um de nós quiser sair?", "Qualquer um pode sair do casal em Perfil. Quem menstrua também pode remover o acesso do parceiro e apagar os próprios registros."],
  ["A astrologia tem base científica?", "Não. Ela entra como repertório simbólico para conversar sobre estilos e preferências. O cálculo do ciclo e as orientações de saúde usam fisiologia, e as duas partes ficam separadas."],
  ["Preciso instalar alguma coisa?", "Não. O Sintonia funciona no navegador do celular ou do computador. No celular, você pode adicioná-lo à tela inicial e usá-lo como um app, com a barra de navegação embaixo."],
  ["Errei uma data. Dá para corrigir?", "Dá. Em Ciclos, cada registro do histórico pode ser editado ou removido, e as previsões se recalculam na hora para os dois."],
  ["O app me ensina a usar?", "Sim. Na primeira vez você vê um guia de boas-vindas e, ao abrir cada tela, um guia curto daquele módulo. O botão ? no topo de cada tela reabre o guia, e em Perfil dá para rever tudo."],
  ["Quanto custa?", "Por enquanto, é gratuito."],
];

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "sun", title: "Hoje, em uma tela", text: "Dia do ciclo, fase, próxima menstruação e fertilidade. Navegue por uma faixa de dias para ver o passado e o futuro." },
  { icon: "spark", title: "O que ajuda e o que evitar", text: "Cada momento da fase traz tendências, o porquê fisiológico, dicas práticas e o ponto de atenção do dia." },
  { icon: "chat", title: "Frases para conversar", text: "Ela tem o que dizer para pedir o que precisa. Ele tem como abrir a conversa no tom certo." },
  { icon: "check", title: "Check-in e sinais", text: "Humor, sintomas, fluxo e desejo em poucos toques, e sinais como “preciso de espaço” que chegam ao parceiro com orientação." },
  { icon: "calendar", title: "Calendário do ciclo", text: "Veja o mês inteiro colorido por fase, com a ovulação marcada. Registre, edite ou remova menstruações quando precisar." },
  { icon: "drop", title: "Previsão que aprende", text: "Ciclos de 28, 31 dias ou irregulares. Depois de 3 registros, o app usa a média real e mostra margem de erro e regularidade." },
  { icon: "heart", title: "Fertilidade e TPM no radar", text: "Janela fértil de cerca de 6 dias e período provável de sintomas pré-menstruais, com critérios clínicos." },
  { icon: "mail", title: "Resumo e avisos por e-mail", text: "Um resumo diário para cada um, no horário que escolher, e avisos quando o outro registra algo ou envia um sinal." },
  { icon: "moon", title: "Astrologia e céu do dia", text: "Mapa de cada um, compatibilidade do casal e a Lua do dia cruzada com o ciclo. Leitura simbólica, separada da ciência." },
];

const TOUR: { icon: IconName; tab: string; title: string; points: string[] }[] = [
  { icon: "sun", tab: "Hoje", title: "O seu dia", points: ["Anel do ciclo e fase atual", "Check-in, sinais e orientações", "Céu de hoje e próximos dias"] },
  { icon: "calendar", tab: "Ciclos", title: "O calendário", points: ["Mês colorido por fase", "Registrar, editar e remover", "Duração média e regularidade"] },
  { icon: "star", tab: "Astro", title: "O céu de vocês", points: ["Mapa de cada um", "Compatibilidade do casal", "Lido da sua perspectiva"] },
  { icon: "user", tab: "Perfil", title: "Controle e conta", points: ["Pausar o compartilhamento", "E-mails, horário e fuso", "Sair do casal ou excluir a conta"] },
];

function Phone({ who, title, children }: { who: "her" | "him"; title: string; children: React.ReactNode }) {
  const demo = PHASES.lutea;
  return (
    <div className="rounded-[1.8rem] border border-white/15 bg-[#120f26] p-2.5 shadow-2xl">
      <div className="rounded-[1.4rem] p-3" style={{ background: `linear-gradient(180deg, ${demo.soft}, #1a1738)` }}>
        <p className="text-[11px] text-muted">{title}</p>
        <div className="mx-auto mt-1 w-[130px] sm:w-[150px]">
          <Ring length={28} ranges={phaseRanges(28, 5)} day={25}>
            <span className="text-[8px] uppercase tracking-widest text-muted">Dia</span>
            <span className="font-display text-3xl leading-none">25</span>
          </Ring>
        </div>
        <div className="mt-2 text-center">
          <span className="inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ background: `${demo.color}26`, color: demo.color }}>{who === "her" ? "Sua fase · Lútea" : "Fase · Lútea"}</span>
        </div>
        <div className="mt-2.5 rounded-xl bg-black/25 p-2.5 text-left">{children}</div>
      </div>
    </div>
  );
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/hoje");

  const demo = PHASES.lutea;
  const herSt = stageForViewer("lutea", 10, 13, "her");
  const himSt = stageForViewer("lutea", 10, 13, "him");
  const total = Object.values(STAGES).reduce((n, s) => n + s.length, 0);

  return (
    <div className="overflow-x-clip">
      <Stars />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <Logo size={30} />
        <nav className="flex items-center" aria-label="Seções">
          <a href="#recursos" className="hidden min-h-[44px] items-center rounded-full px-4 text-sm text-muted hover:text-ink sm:flex">Recursos</a>
          <a href="#como-funciona" className="hidden min-h-[44px] items-center rounded-full px-4 text-sm text-muted hover:text-ink sm:flex">Como funciona</a>
          <Link href="/sign-in" className="flex min-h-[44px] items-center rounded-full px-4 text-sm text-muted hover:text-ink">Entrar</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_1fr] md:pt-16">
        <div className="rise">
          <p className="eyebrow inline-block rounded-full border border-line bg-white/5 px-3.5 py-1.5">Para quem menstrua e para quem acompanha</p>
          <h1 className="font-display mt-5 text-[2.6rem] leading-[1.05] md:text-6xl">
            O ciclo, entendido pelos <em className="text-grad">dois</em>.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            O Sintonia mostra, a cada dia, o que está acontecendo no corpo dela e como cada um pode ajudar o outro. Ela acompanha em primeira pessoa, ele entende com contexto, e os dados são compartilhados entre vocês.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up?role=cycle" className="btn">Eu menstruo</Link>
            <Link href="/sign-up?role=partner" className="btn btn-ghost">Acompanho minha parceira</Link>
          </div>
          <p className="mt-4 text-sm text-muted">Gratuito · Pronto em 1 minuto · Ela decide o que compartilha</p>
          <p className="mt-2 text-sm text-muted">Recebeu um convite? Abra o link que a pessoa enviou.</p>
        </div>

        {/* As duas perspectivas */}
        <div className="rise relative mx-auto grid w-full max-w-[420px] grid-cols-2 gap-3" aria-hidden>
          <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${demo.color}, transparent 65%)` }} />
          <Phone who="her" title="Hoje, Ana">
            <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: demo.color }}>Como você pode estar</p>
            <p className="mt-1 text-[10px] leading-snug">{first(herSt.mood)}</p>
          </Phone>
          <div className="mt-6">
            <Phone who="him" title="Hoje com Ana">
              <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: demo.color }}>O que ajuda</p>
              <p className="mt-1 text-[10px] leading-snug">{first(himSt.do[0])}</p>
            </Phone>
          </div>
        </div>
      </section>

      {/* DUAS PERSPECTIVAS */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">Dois pontos de vista, os mesmos dados</h2>
        <p className="mt-2 max-w-xl text-muted">Cada um vê o ciclo do seu lado, com textos e orientações escritos para a sua posição.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="card p-6">
            <p className="eyebrow !text-rose">Para ela</p>
            <h3 className="font-display mt-1 text-2xl">Em primeira pessoa</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed">
              {[
                "Entenda o que o seu corpo está fazendo em cada fase, e por quê, com a fisiologia explicada.",
                "Veja o que pode ajudar você e o que vale evitar, dia a dia.",
                "Receba frases prontas para pedir o que precisa, sem ter de explicar tudo.",
                "Faça um check-in rápido e envie sinais como “preciso de espaço”.",
              ].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{t}</span></li>)}
            </ul>
          </article>
          <article className="card p-6">
            <p className="eyebrow !text-accent">Para ele</p>
            <h3 className="font-display mt-1 text-2xl">Com contexto e orientação</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed">
              {[
                "Saiba em que fase ela está e o que costuma acontecer, sem adivinhar nem levar para o lado pessoal.",
                "Receba o que ajuda, o que evitar e como abrir a conversa, no tom certo para o momento.",
                "Veja o que ela marcou no check-in e como responder aos sinais dela.",
                "Entenda quando a fertilidade e a janela de TPM estão mais altas.",
              ].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{t}</span></li>)}
            </ul>
          </article>
        </div>
      </section>

      {/* SINCRONIA DE DADOS */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:p-8">
          <div>
            <p className="eyebrow">Ela registra</p>
            <p className="font-display mt-1 text-2xl">“Menstruação começou hoje.”</p>
            <p className="mt-2 text-sm text-muted">Um toque no app, no celular dela.</p>
          </div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/20 text-accent md:rotate-0" aria-hidden><Icon name="arrow" /></div>
          <div>
            <p className="eyebrow">Ele vê na hora</p>
            <p className="font-display mt-1 text-2xl">Previsão atualizada e aviso por e-mail.</p>
            <p className="mt-2 text-sm text-muted">E o contrário também vale: se ele registrar, ela é avisada. As previsões se recalculam para os dois.</p>
          </div>
        </div>
      </section>

      {/* PRIVACIDADE */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Privacidade</p>
            <h2 className="font-display mt-2 text-3xl leading-tight md:text-4xl">Quem menstrua está no controle</h2>
            <p className="mt-3 text-muted">Os dados do ciclo pertencem a ela. O Sintonia foi desenhado para que o compartilhamento seja uma escolha, e não uma imposição.</p>
          </div>
          <ul className="card space-y-3 p-6 text-[15px] leading-relaxed">
            {[
              ["Ela liga ou pausa o compartilhamento", "a qualquer momento, em Perfil."],
              ["As anotações pessoais", "do check-in nunca são mostradas ao parceiro."],
              ["Os dados dela são dela", "depois que ela entra, só ela edita o perfil do ciclo."],
              ["Ela pode remover o acesso", "do parceiro e apagar os próprios registros."],
            ].map(([b, t]) => (
              <li key={b} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-accent"><Icon name="lock" size={12} /></span><span><b>{b}</b> {t}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* CHECK-IN E SINAIS */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">Quando falar cansa, um toque resolve</h2>
        <p className="mt-2 max-w-xl text-muted">Ela marca como está e envia um sinal. Ele recebe o aviso com uma orientação de como responder.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="card p-6">
            <p className="eyebrow">Check-in dela</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Cansada", "Sensível", "Cólica", "Inchaço", "Sono ruim"].map((t, i) => (
                <span key={t} className={`rounded-full border px-3.5 py-1.5 text-sm ${i < 3 ? "border-accent bg-accent/20" : "border-line bg-white/5 text-muted"}`}>{t}</span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Humor, sintomas, fluxo e desejo. A anotação pessoal fica só com ela.</p>
          </article>
          <article className="rounded-3xl border border-rose/50 bg-rose/10 p-6">
            <p className="eyebrow !text-rose">Aviso na tela dele</p>
            <p className="font-display mt-1 text-2xl">Ana {SIGNALS.SPACE.himTitle}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{SIGNALS.SPACE.guide}</p>
          </article>
        </div>
      </section>

      {/* FASES */}
      <section className="mx-auto max-w-5xl px-5 py-12">
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
              <p className="balance mt-1 text-sm font-medium" style={{ color: p.color }}>{p.tagline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-12">
        <h2 className="font-display text-3xl md:text-4xl">Como funciona para o casal</h2>
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
      <section id="recursos" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-12">
        <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">Tudo o que o Sintonia faz</h2>
        <p className="mt-2 max-w-xl text-muted">Do registro do ciclo à conversa do dia a dia, em um só lugar e com os dois no mesmo ritmo.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><Icon name={f.icon} size={20} /></span>
              <h3 className="font-display mt-3 text-xl">{f.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* UM PASSEIO PELO APP */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="px-5">
          <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">Um app pensado para o celular</h2>
          <p className="mt-2 max-w-xl text-muted">Quatro telas na barra de baixo, botões grandes para usar com uma mão e a opção de adicionar à tela inicial.</p>
        </div>
        <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden" aria-label="Telas do app">
          {TOUR.map((t) => (
            <li key={t.tab} className="card w-[78%] max-w-[300px] shrink-0 snap-center p-5 sm:w-[46%] md:w-auto md:max-w-none">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12 text-ink shadow-[0_0_24px_-4px_#bfb0ff88]"><Icon name={t.icon} size={22} /></span>
                <div><p className="eyebrow">{t.tab}</p><h3 className="font-display text-xl leading-tight">{t.title}</h3></div>
              </div>
              <ul className="mt-4 space-y-2 text-[15px] leading-snug">
                {t.points.map((p) => <li key={p} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Icon name="check" size={12} /></span><span>{p}</span></li>)}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* ONBOARDING GUIADO */}
      <section className="mx-auto max-w-5xl px-5 py-6">
        <div className="card grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="eyebrow">Sem manual</p>
            <h2 className="font-display mt-1 text-3xl leading-tight">O app ensina você a usar</h2>
            <p className="mt-2 max-w-xl text-muted">Na primeira vez, um guia de boas-vindas mostra o essencial. Ao abrir cada tela, um guia curto explica aquele módulo, e você pode pular. O botão <b className="text-ink">?</b> no topo de cada tela reabre o guia quando quiser.</p>
          </div>
          <ol className="flex gap-1.5 md:w-44 md:flex-col" aria-hidden>
            {["Boas-vindas", "Guia por tela", "Botão ? sempre à mão"].map((t, n) => (
              <li key={t} className="flex flex-1 items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-xs text-muted md:flex-none"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">{n + 1}</span><span className="leading-tight">{t}</span></li>
            ))}
          </ol>
        </div>
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
        <h2 className="font-display mt-8 max-w-3xl text-4xl leading-[1.08] md:text-6xl">Entendam o ciclo juntos e respondam melhor a cada dia.</h2>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-up?role=cycle" className="btn px-8 text-lg">Eu menstruo<Icon name="arrow" size={18} /></Link>
          <Link href="/sign-up?role=partner" className="btn btn-ghost px-8 text-lg">Acompanho minha parceira</Link>
        </div>
        <p className="mt-4 text-sm text-muted">Gratuito · Configuração em 1 minuto · Ela decide o que compartilha</p>
      </section>

      <footer className="mx-auto max-w-5xl px-5 pb-[max(env(safe-area-inset-bottom),2rem)] pt-6 text-center text-xs leading-relaxed text-muted">
        <p>Conteúdo informativo, sem finalidade de diagnóstico, tratamento ou contracepção. Em caso de dor intensa, sangramento anormal ou sintomas emocionais graves, procure atendimento médico. A astrologia é uma leitura simbólica, sem base científica.</p>
        <p className="mt-3 flex justify-center opacity-70"><Logo size={22} /></p>
      </footer>
    </div>
  );
}
