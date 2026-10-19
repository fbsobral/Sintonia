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

export type Stage = { name: string; mood: string; body: string; energy: number; do: string[]; avoid: string[] };

/** Cada fase se divide em momentos; o conteúdo muda ao longo dos dias, não só entre fases. */
export const STAGES: Record<PhaseKey, Stage[]> = {
  menstrual: [
    {
      name: "Fluxo mais intenso",
      mood: "Cansaço e introspecção no auge. Ela precisa de colo e de pouca exigência.",
      body: "Cólica e dor lombar costumam ser mais fortes, com fluxo mais intenso.",
      energy: 1,
      do: ["Pergunte do que ela precisa e resolva sem ser pedido: comida, remédio, casa", "Bolsa térmica, chá quente e um ambiente quieto", "Simplifique ou cancele compromissos que dão trabalho"],
      avoid: ["Cobrar disposição ou planos animados", "Puxar assuntos pesados", "Minimizar a dor com “é normal”"],
    },
    {
      name: "Fluxo diminuindo",
      mood: "Ainda recolhida, mas o humor começa a melhorar.",
      body: "As cólicas aliviam e o fluxo reduz, embora o cansaço persista.",
      energy: 2,
      do: ["Convide para algo tranquilo, como um filme ou jantar em casa", "Elogie de forma sincera: a autoestima está sensível", "Divida as tarefas da casa sem ela pedir"],
      avoid: ["Forçar programa cheio de gente", "Cobrar o ritmo de sempre", "Fazer piada com o humor dela"],
    },
    {
      name: "Fim da menstruação",
      mood: "A energia volta e o humor melhora. Ela tende a querer se reconectar.",
      body: "O corpo fica mais leve, com menos dor e menos inchaço.",
      energy: 3,
      do: ["Sugira uma caminhada ou uma saída leve", "Planeje algo especial para os próximos dias", "Retome conversas que ficaram em espera"],
      avoid: ["Atropelar o ritmo dela com empolgação demais", "Pressionar por intimidade se ela não demonstrar vontade"],
    },
  ],
  folicular: [
    {
      name: "Energia subindo",
      mood: "O humor fica leve e a vontade de fazer coisas novas começa a aparecer.",
      body: "O estrogênio sobe: mais disposição e pele melhor.",
      energy: 3,
      do: ["Proponha algo novo: restaurante, passeio ou um curso a dois", "Apoie as ideias dela com entusiasmo", "Retome planos que ficaram parados"],
      avoid: ["Cair na rotina e deixar os dias passarem sem novidade", "Descartar as ideias dela de primeira"],
    },
    {
      name: "Fase de brilho",
      mood: "Criativa, sociável e confiante. A cabeça está aberta para planos e decisões.",
      body: "A disposição é alta e a libido começa a crescer.",
      energy: 4,
      do: ["Converse sobre planos, viagens e decisões importantes", "Marquem com amigos ou com outros casais", "Atividade física a dois: dança, corrida leve ou trilha"],
      avoid: ["Adiar conversas sérias que ela está aberta para ter", "Ficar só no sofá em casa"],
    },
    {
      name: "Perto da ovulação",
      mood: "Confiança em alta e mais flerte. O clima de conexão está chegando.",
      body: "O estrogênio está perto do pico, com energia e libido altas.",
      energy: 5,
      do: ["Invista no flerte: mensagem criativa, elogio e atenção", "Reserve a agenda para um encontro de verdade", "Alinhem a proteção, porque a janela fértil está perto"],
      avoid: ["Passar os dias sem tempo de qualidade", "Deixar a contracepção para a última hora"],
    },
  ],
  ovulatoria: [
    {
      name: "Janela fértil começando",
      mood: "Comunicativa, afetuosa e mais confiante.",
      body: "Pico de estrogênio e início da fase fértil.",
      energy: 5,
      do: ["Faça um encontro de verdade: jantar ou saída a dois, celular longe da mesa", "Elogie e demonstre desejo com carinho e respeito", "Se não planejam gravidez, combinem a proteção"],
      avoid: ["Passar a janela fértil sem alinhar a contracepção", "Deixar o encontro de lado por cansaço seu"],
    },
    {
      name: "Pico do ciclo",
      mood: "Auge de energia, sociabilidade e desejo.",
      body: "Dia da ovulação: a libido costuma estar no máximo.",
      energy: 5,
      do: ["Faça deste dia um momento marcante a dois", "Dê atenção total e escute com curiosidade", "Reforce a proteção se não querem gravidez"],
      avoid: ["Marcar compromissos que roubam o tempo de vocês", "Tratar o dia como qualquer outro"],
    },
    {
      name: "Fim do pico",
      mood: "Ainda afetuosa, com a energia começando a baixar.",
      body: "Os hormônios mudam de direção e o corpo começa a desacelerar.",
      energy: 4,
      do: ["Termine a fase com um gesto de carinho", "Aproveite para conversar de coração aberto", "Comece a diminuir o ritmo dos programas"],
      avoid: ["Cobrar a mesma energia dos dias anteriores", "Ignorar sinais de cansaço"],
    },
  ],
  lutea: [
    {
      name: "Começo estável",
      mood: "Humor estável e foco. Boa fase para rotina, tarefas e planos práticos.",
      body: "A progesterona sobe: mais calma, mas o corpo já pede conforto.",
      energy: 4,
      do: ["Resolva pendências da casa e da vida a dois", "Mantenha a rotina previsível", "Programe algo tranquilo para os próximos dias"],
      avoid: ["Encher a agenda de compromissos", "Adiar conversas importantes para os últimos dias do ciclo"],
    },
    {
      name: "Sensibilidade crescendo",
      mood: "A sensibilidade aumenta, assim como a necessidade de conforto e de previsibilidade.",
      body: "Podem surgir inchaço, vontade de comer doce e sono ruim.",
      energy: 3,
      do: ["Ouça mais e proponha menos", "Tenha em casa o que ela gosta, sem comentar", "Facilite a noite: ambiente calmo e sem discussão antes de dormir"],
      avoid: ["Mudanças de última hora", "Comentar o corpo ou o humor dela", "Debater a relação"],
    },
    {
      name: "Reta final (TPM)",
      mood: "Mais irritável e sensível. Pequenas coisas pesam mais.",
      body: "Com a queda hormonal, aparecem sensibilidade nas mamas, cansaço e humor instável.",
      energy: 2,
      do: ["Seja o ponto de calma: tom baixo, paciência e bom humor", "Ouça sem tentar resolver tudo", "Gestos pequenos: um café, um bilhete, flores"],
      avoid: ["Debater a relação ou fazer críticas", "Reagir à irritação com mais irritação", "Dizer “você está assim por causa da TPM”"],
    },
  ],
};

export function stageFor(phase: PhaseKey, phaseDay: number, phaseLength: number, pms: boolean): Stage {
  const st = STAGES[phase];
  if (pms && phase === "lutea") return st[st.length - 1];
  const raw = phaseLength > 0 ? Math.floor(((phaseDay - 1) / phaseLength) * st.length) : 0;
  return st[Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), st.length - 1)];
}
