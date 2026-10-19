import type { PhaseKey } from "./cycle";

export type PhaseInfo = {
  key: PhaseKey;
  name: string;
  tagline: string;
  color: string; // hex
  soft: string; // fundo suave
  energy: number; // 1-5
  mood: string;
  body: string;
  do: string[];
  avoid: string[];
  talk: string[];
  days: string[]; // dica do dia, rotaciona pelo dia da fase
};

export const PHASES: Record<PhaseKey, PhaseInfo> = {
  menstrual: {
    key: "menstrual",
    name: "Menstruação",
    tagline: "Hora de desacelerar e cuidar",
    color: "#E0566B",
    soft: "#3A1F2B",
    energy: 2,
    mood: "Energia baixa, mais introspecção e necessidade de acolhimento.",
    body: "Cólica, cansaço, inchaço e dor nas costas são comuns, e a intensidade varia muito de dia para dia.",
    do: [
      "Ofereça ajuda concreta: pedir comida, cuidar da casa, deixar o dia mais leve",
      "Pergunte se ela quer companhia ou espaço, e aceite a resposta sem se ofender",
      "Cuidados simples: bolsa térmica, chá, chocolate, o filme favorito dela",
    ],
    avoid: [
      "Marcar programas cansativos ou cheios de gente sem combinar antes",
      "Minimizar com frases como “isso é só a TPM”",
      "Insistir em discutir assuntos pesados",
    ],
    talk: [
      "“Como você está hoje, de 0 a 10? Quer que eu resolva alguma coisa por você?”",
      "“Hoje o jantar é por minha conta. Prefere algo quentinho em casa?”",
      "“Não precisa fazer nada hoje. Estou aqui se quiser colo ou silêncio.”",
    ],
    days: [
      "Dia 1 costuma ser o mais pesado. Mande uma mensagem carinhosa cedo e pergunte do que ela precisa.",
      "Assuma uma tarefa da casa sem ela pedir. Atitude vale mais que promessa.",
      "Se ela estiver mais calada, não é com você. Seja presença leve e disponível.",
      "Convide para algo tranquilo: um filme, uma série ou uma massagem nos pés.",
      "A energia começa a voltar. Sugira uma caminhada curta, sem pressão.",
      "Elogie de forma sincera. A autoestima costuma estar mais frágil agora.",
      "Quase no fim: planeje algo especial para o próximo momento, quando ela estiver mais disposta.",
    ],
  },
  folicular: {
    key: "folicular",
    name: "Folicular",
    tagline: "Energia subindo, tudo flui",
    color: "#3FB58A",
    soft: "#16322B",
    energy: 4,
    mood: "Humor leve, criatividade, motivação e vontade de fazer coisas novas.",
    body: "O estrogênio sobe: mais disposição, pele melhor e a libido começa a crescer.",
    do: [
      "Proponha programas novos: restaurante, trilha, viagem curta, um curso a dois",
      "Converse sobre planos, projetos e decisões importantes, pois a cabeça está aberta",
      "Apoie as ideias dela com entusiasmo e faça perguntas",
    ],
    avoid: [
      "Cair na rotina e deixar os dias passarem sem nenhuma novidade",
      "Deixar para depois o que exige conversa séria",
    ],
    talk: [
      "“Estava pensando em um programa diferente pra gente nesse fim de semana. Topa?”",
      "“Me conta o que você tem vontade de fazer nos próximos meses.”",
      "“Quero ouvir suas ideias. Qual projeto está te animando agora?”",
    ],
    days: [
      "A energia está voltando. É um ótimo momento para convidar para algo novo.",
      "Faça uma pergunta de curiosidade genuína sobre o dia dela e escute até o fim.",
      "Boa janela para falar de planos a dois: viagem, mudança, metas.",
      "Surpreenda com um programa que vocês nunca fizeram.",
      "Ela tende a estar sociável. Que tal marcar com amigos ou casais?",
      "Atividade física a dois rende bem agora: dança, corrida leve, trilha.",
      "O flerte funciona melhor. Mande uma mensagem criativa no meio do dia.",
      "A libido vem subindo. Invista no clima, na conversa e no cuidado antes.",
      "Aproveite para resolver pendências do casal com leveza.",
      "Reta final da fase: reserve a agenda, porque a ovulação está chegando.",
    ],
  },
  ovulatoria: {
    key: "ovulatoria",
    name: "Ovulatória",
    tagline: "Pico de energia e conexão",
    color: "#F2B134",
    soft: "#3B2D10",
    energy: 5,
    mood: "Confiança em alta, comunicativa, sociável e mais afetuosa.",
    body: "Pico de estrogênio e fase fértil. Libido costuma estar mais alta e a disposição é máxima.",
    do: [
      "Invista em encontro de verdade: jantar, saída a dois, atenção total sem celular",
      "Elogie, flerte e demonstre desejo com carinho e respeito",
      "Se não planejam gravidez, combine proteção: é a janela fértil",
    ],
    avoid: [
      "Passar a janela fértil sem alinhar a contracepção",
      "Deixar o encontro de lado por cansaço seu",
    ],
    talk: [
      "“Reservei a noite pra gente. Só nós dois, sem pressa.”",
      "“Você está radiante hoje. Estou muito feliz com a gente.”",
      "“Vamos combinar direitinho a proteção nesses dias?”",
    ],
    days: [
      "A janela fértil começa. Alinhem a proteção e capriche no clima.",
      "Pico de conexão. Marque um jantar especial, com celular longe da mesa.",
      "Último dia do pico. Termine a fase com um gesto marcante de carinho.",
    ],
  },
  lutea: {
    key: "lutea",
    name: "Lútea",
    tagline: "Mais sensível, precisa de calma",
    color: "#8B6FE0",
    soft: "#251F44",
    energy: 3,
    mood: "Começa estável, depois a sensibilidade aumenta, assim como a irritabilidade e a necessidade de conforto.",
    body: "A progesterona sobe e cai. Podem surgir inchaço, vontade de comer doce, sono ruim e sensibilidade nas mamas.",
    do: [
      "Seja o ponto de calma: tom de voz baixo, paciência e bom humor",
      "Ouça sem tentar resolver tudo. Muitas vezes ela só quer ser ouvida",
      "Mantenha a casa tranquila, a rotina previsível e o jantar resolvido",
    ],
    avoid: [
      "Debater a relação, críticas ou assuntos tensos nos últimos dias",
      "Reagir à irritação com mais irritação. O pavio está curto para os dois",
      "Dizer “você está assim por causa da TPM”",
    ],
    talk: [
      "“Percebi que o dia foi puxado. Quer me contar ou prefere que eu só fique perto?”",
      "“Se eu fizer algo que te incomode, pode falar na hora. Prometo ouvir.”",
      "“Quer que eu prepare algo gostoso pra gente hoje?”",
    ],
    days: [
      "Começo estável: ótimo para tarefas, rotina organizada e planos práticos.",
      "Energia mais constante. Boa fase para ficar em casa com conforto.",
      "Mantenha a rotina previsível. Mudanças de última hora pesam mais.",
      "Doces e carboidratos pedem passagem. Tenha o que ela gosta em casa, sem comentar.",
      "A sensibilidade sobe. Escute mais e proponha menos.",
      "Ofereça um elogio sincero. A autocrítica costuma crescer.",
      "O sono pode piorar. Facilite a noite: ambiente calmo, sem discussões antes de dormir.",
      "Se rolar atrito, respire e adie o assunto: “Podemos conversar sobre isso amanhã?”",
      "Uma atitude pequena vale muito: flores, um bilhete, um café feito por você.",
      "Segure o ego. Quase tudo que parece ataque agora é cansaço e hormônio.",
      "Evite tomar decisões grandes. Deixe para depois da menstruação.",
    ],
  },
};

export const PMS_TIPS = [
  "Janela provável de TPM. Dobre a paciência, dê espaço quando pedir e demonstre carinho sem cobrar.",
  "Reduza a carga de coisas a resolver, deixe a casa mais leve e evite críticas.",
  "Se houver tensão, diga: “Estou do seu lado. Quer conversar agora ou depois?”",
  "Prepare o terreno: chocolate, chá e um dia sem compromissos pesados fazem diferença.",
];

/** A dica acompanha a POSIÇÃO na fase (início → fim), então se a fase encurta ou alonga, a narrativa se ajusta. */
export function dayTip(phase: PhaseKey, phaseDay: number, pms: boolean, phaseLength: number) {
  if (pms) return PMS_TIPS[phaseDay % PMS_TIPS.length];
  const t = PHASES[phase].days;
  const raw = phaseLength > 1 ? Math.round(((phaseDay - 1) * (t.length - 1)) / (phaseLength - 1)) : 0;
  const i = Number.isFinite(raw) ? raw : 0;
  return t[Math.min(Math.max(i, 0), t.length - 1)];
}

export function pick<T>(arr: T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}
