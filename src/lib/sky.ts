import type { Sign } from "./astro";
import { aspectBetween } from "./synastry";
import type { PhaseKey } from "./cycle";

const PHASE_TEXT: Record<string, string> = {
  "Lua nova": "Fase de recolhimento e recomeço. O clima favorece intenções simples e conversas calmas, mais que grandes decisões.",
  "Crescente": "A energia coletiva vai subindo. É um bom momento para planejar e começar algo novo juntos.",
  "Quarto crescente": "Fase de ação e de resolver pendências. Decisões adiadas tendem a pedir resposta, o que pode gerar tensão.",
  "Gibosa crescente": "Fase de ajustes e expectativa. A ansiedade antes do pico é comum, então ajude a manter o ritmo calmo.",
  "Lua cheia": "Auge da luminosidade. Tradicionalmente associada a emoções mais intensas, para o bem (romance) e para o mal (irritação).",
  "Gibosa minguante": "Fase de partilha e gratidão. Favorece conversas sinceras e reconhecer o que deu certo.",
  "Quarto minguante": "Fase de revisão e de soltar o que pesa. Boa janela para ajustar combinados da relação.",
  "Minguante": "A energia desacelera. O dia pede descanso, casa e programas tranquilos.",
};

const SIGN_DAY: Record<Sign, { mood: string; tip: string }> = {
  "Áries": { mood: "Clima de impulso e pressa: as reações tendem a ser rápidas e diretas.", tip: "Se surgir atrito, adie a discussão por uma hora. A raiva do dia costuma passar rápido." },
  "Touro": { mood: "Clima de conforto, prazer e ritmo lento. Corpo e rotina pesam mais que ideias.", tip: "Uma refeição bem feita e um ambiente agradável resolvem mais do que uma conversa longa." },
  "Gêmeos": { mood: "Clima de conversa, mensagens e curiosidade. A cabeça está mais ativa que o corpo.", tip: "Uma mensagem leve durante o dia funciona melhor que um presente." },
  "Câncer": { mood: "Clima emotivo e doméstico, com mais necessidade de segurança e de vínculo.", tip: "Proponha ficar em casa. Atenção ao que ela diz importa mais que o programa." },
  "Leão": { mood: "Clima de expressão e de querer ser notada.", tip: "Reconheça algo específico que ela fez. Reconhecimento genérico pesa menos." },
  "Virgem": { mood: "Clima prático, de organizar o cotidiano e perceber detalhes.", tip: "Ajude com uma tarefa concreta e evite críticas sobre ordem ou eficiência." },
  "Libra": { mood: "Clima de harmonia, estética e parceria. Conflitos tendem a incomodar mais.", tip: "Um programa a dois, simples e bonito, cai bem. Evite assuntos tensos." },
  "Escorpião": { mood: "Clima intenso e introspectivo, em que emoções guardadas podem vir à tona.", tip: "Seja direto e verdadeiro. Percebe-se facilmente quando algo é evasivo." },
  "Sagitário": { mood: "Clima de otimismo, liberdade e vontade de sair da rotina.", tip: "Proponha algo diferente ou ao ar livre, sem muito planejamento." },
  "Capricórnio": { mood: "Clima sério, focado em responsabilidades e metas.", tip: "Respeite o foco dela e reconheça o esforço em vez de pedir atenção." },
  "Aquário": { mood: "Clima de independência, ideias e vontade de espaço.", tip: "Dê espaço sem se ofender e convide para algo fora do comum, sem insistir." },
  "Peixes": { mood: "Clima sensível, sonhador e empático, em que o ambiente emocional pesa mais.", tip: "Presença tranquila vale mais que explicações. Fale pouco e escute." },
};

const VS_HER: Record<ReturnType<typeof aspectBetween>, string> = {
  conj: "A Lua de hoje está no mesmo signo da Lua dela: o dia ressoa com o jeito dela de sentir. Emoções em evidência, então escute mais.",
  trig: "O clima do dia combina com o jeito dela de sentir. Ótimo momento para carinho e conversas importantes.",
  sext: "O dia favorece o jeito dela de sentir. Aproveite para se aproximar.",
  quad: "O ritmo do dia contraria o que a Lua dela pede. Mais paciência e menos cobrança.",
  opos: "O clima do dia puxa para o lado oposto ao que a Lua dela pede, então ela pode querer o contrário do que o ambiente sugere. Pergunte antes de supor.",
  dist: "O clima do dia tem pouca relação com o jeito dela de sentir. Mantenha o dia simples e sem grandes expectativas.",
};

const SIGN_DAY_TIP_SELF: Record<Sign, string> = {
  "Áries": "Se surgir atrito, adie a discussão por uma hora. A raiva do dia costuma passar rápido.",
  "Touro": "Uma refeição bem feita e um ambiente agradável resolvem mais do que uma conversa longa.",
  "Gêmeos": "Mande uma mensagem leve a alguém de quem você gosta. Conversar solta a cabeça.",
  "Câncer": "Fique em casa se puder. Ambiente seguro e pessoas de confiança fazem diferença hoje.",
  "Leão": "Reconheça algo que você fez bem hoje. Você merece esse registro.",
  "Virgem": "Organize uma coisa pequena, como uma gaveta ou uma lista. Ordem acalma a ansiedade, sem exigir perfeição.",
  "Libra": "Escolha um programa tranquilo e bonito. Evite assuntos tensos hoje.",
  "Escorpião": "Seja direta consigo mesma sobre o que sente. Evite guardar para depois.",
  "Sagitário": "Faça algo diferente ou ao ar livre, sem muito planejamento.",
  "Capricórnio": "Reconheça o seu esforço em vez de se cobrar mais. Descanso também é produtividade.",
  "Aquário": "Reserve um tempo só seu e faça algo fora do comum, sem pressa.",
  "Peixes": "Presença tranquila vale mais que explicações. Fale pouco e descanse.",
};

const VS_SELF: Record<ReturnType<typeof aspectBetween>, string> = {
  conj: "A Lua de hoje está no mesmo signo da sua Lua: o dia ressoa com o seu jeito de sentir. Emoções em evidência, então vale reservar um tempo para escutar o que você sente.",
  trig: "O clima do dia combina com o seu jeito de sentir. É um ótimo momento para carinho e conversas importantes.",
  sext: "O dia favorece o seu jeito de sentir. Aproveite para se aproximar de quem importa.",
  quad: "O ritmo do dia contraria o que a sua Lua pede. Mais paciência com você mesma e menos cobrança.",
  opos: "O clima do dia puxa para o lado oposto ao que a sua Lua pede, então você pode querer o contrário do que o ambiente sugere. Dê ouvido ao que você precisa.",
  dist: "O clima do dia tem pouca relação com o seu jeito de sentir. Mantenha o dia simples e sem grandes expectativas.",
};

const CYCLE_NOTE_SELF: Record<PhaseKey, string> = {
  menstrual: "Com a energia baixa da menstruação, priorize conforto e leveza.",
  folicular: "Com a energia subindo na fase folicular, você tende a aproveitar bem o clima do dia.",
  ovulatoria: "No pico da ovulatória, você está mais comunicativa e receptiva.",
  lutea: "Na fase lútea você está mais sensível, então esse clima pesa um pouco mais.",
};

const CYCLE_NOTE: Record<PhaseKey, string> = {
  menstrual: "Com a energia baixa da menstruação, priorize conforto e leveza.",
  folicular: "Com a energia subindo na fase folicular, ela tende a aproveitar bem o clima do dia.",
  ovulatoria: "No pico da ovulatória, ela está mais comunicativa e receptiva.",
  lutea: "Na fase lútea ela está mais sensível, então esse clima pesa um pouco mais.",
};

export function skyReading(moonPhase: string, moonSign: Sign, herMoon: Sign, cycle: PhaseKey, pms: boolean, viewer: "him" | "her" = "him") {
  const aspect = aspectBetween(moonSign, herMoon);
  const intense = moonPhase === "Lua cheia" || moonPhase === "Lua nova";
  const self = viewer === "her";
  const base = self ? CYCLE_NOTE_SELF[cycle] : CYCLE_NOTE[cycle];
  const pmsNote = pms && intense ? " Com a TPM por perto e a Lua intensa, a sensibilidade pode somar." : "";
  return {
    phase: PHASE_TEXT[moonPhase] ?? "",
    sign: self ? { mood: SIGN_DAY[moonSign].mood, tip: SIGN_DAY_TIP_SELF[moonSign] } : SIGN_DAY[moonSign],
    vsHer: self ? VS_SELF[aspect] : VS_HER[aspect],
    cross: base + pmsNote,
  };
}
