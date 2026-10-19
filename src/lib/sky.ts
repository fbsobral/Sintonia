import type { Sign } from "./astro";
import { aspectBetween } from "./synastry";
import type { PhaseKey } from "./cycle";

const PHASE_TEXT: Record<string, string> = {
  "Lua nova": "Fase de começos e de recolhimento. O clima pede calma e intenções simples, e não grandes decisões.",
  "Crescente": "A energia vai subindo. Bom momento para planejar e começar coisas novas juntos.",
  "Quarto crescente": "Hora de agir e resolver pendências. Pode surgir tensão por decisões que estavam adiadas.",
  "Gibosa crescente": "Fase de ajustes e expectativa. Pode haver ansiedade antes do pico, então ajude a manter a calma.",
  "Lua cheia": "Emoções no auge: tudo fica mais intenso, para o bem e para o mal. Sensibilidade, romance e também irritação sobem.",
  "Gibosa minguante": "Clima de gratidão e de compartilhar. Bom momento para conversas sinceras e carinhosas.",
  "Quarto minguante": "Hora de revisar e soltar o que pesa. Boa janela para ajustar combinados da relação.",
  "Minguante": "A energia desacelera. O dia pede descanso, casa e programas tranquilos.",
};

const SIGN_DAY: Record<Sign, { mood: string; tip: string }> = {
  "Áries": { mood: "Dia de impulso e pressa: tudo fica mais direto e explosivo.", tip: "Não discuta no calor do momento. Espere esfriar." },
  "Touro": { mood: "Dia de conforto, prazer e ritmo lento.", tip: "Uma boa refeição, toque e um ambiente gostoso resolvem muito." },
  "Gêmeos": { mood: "Dia de papo, mensagens e curiosidade.", tip: "Mande uma mensagem leve e divertida. Conversa funciona mais que presente." },
  "Câncer": { mood: "Dia emotivo, caseiro e protetor.", tip: "Ofereça acolhimento e uma noite em casa." },
  "Leão": { mood: "Dia de brilho e de querer ser notada.", tip: "Elogie de forma sincera e valorize o que ela fez." },
  "Virgem": { mood: "Dia prático, de organizar e cuidar de detalhes.", tip: "Ajude em tarefas concretas e evite críticas." },
  "Libra": { mood: "Dia de harmonia, beleza e parceria.", tip: "Um programa a dois, bonito e tranquilo, cai bem." },
  "Escorpião": { mood: "Dia intenso e profundo: emoções guardadas podem vir à tona.", tip: "Seja sincero e evite jogos. Ela percebe tudo." },
  "Sagitário": { mood: "Dia de otimismo, liberdade e vontade de sair.", tip: "Proponha algo diferente ou ao ar livre." },
  "Capricórnio": { mood: "Dia sério, focado em responsabilidade e metas.", tip: "Respeite o foco dela e reconheça o esforço." },
  "Aquário": { mood: "Dia de independência, ideias e vontade de espaço.", tip: "Dê espaço sem se ofender e convide para algo original." },
  "Peixes": { mood: "Dia sensível, sonhador e empático.", tip: "Carinho e silêncio confortável valem mais que explicações." },
};

const VS_HER: Record<ReturnType<typeof aspectBetween>, string> = {
  conj: "A Lua de hoje está no mesmo signo da Lua dela: o dia ressoa com o jeito dela de sentir. Emoções em evidência, então escute mais.",
  trig: "O clima do dia combina com o jeito dela de sentir. Ótimo momento para carinho e conversas importantes.",
  sext: "O dia favorece o jeito dela de sentir. Aproveite para se aproximar.",
  quad: "O ritmo do dia contraria o que a Lua dela pede. Mais paciência e menos cobrança.",
  opos: "O dia puxa para o lado oposto ao que ela precisa: ela pode querer o contrário do que o clima pede. Pergunte antes de supor.",
  dist: "O dia não conversa muito com o jeito dela de sentir. Mantenha tudo simples e sem expectativa.",
};

const CYCLE_NOTE: Record<PhaseKey, string> = {
  menstrual: "Com a energia baixa da menstruação, priorize conforto e leveza.",
  folicular: "Com a energia subindo na fase folicular, ela tende a aproveitar bem o clima do dia.",
  ovulatoria: "No pico da ovulatória, ela está mais comunicativa e receptiva.",
  lutea: "Na fase lútea ela está mais sensível, então esse clima pesa um pouco mais.",
};

export function skyReading(moonPhase: string, moonSign: Sign, herMoon: Sign, cycle: PhaseKey, pms: boolean) {
  const aspect = aspectBetween(moonSign, herMoon);
  const intense = moonPhase === "Lua cheia" || moonPhase === "Lua nova";
  return {
    phase: PHASE_TEXT[moonPhase] ?? "",
    sign: SIGN_DAY[moonSign],
    vsHer: VS_HER[aspect],
    cross: CYCLE_NOTE[cycle] + (pms && intense ? " Com a TPM por perto e a Lua intensa, a sensibilidade pode vir em dobro." : ""),
  };
}
