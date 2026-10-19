import type { PhaseKey } from "./cycle";

/*
 * Base de conteúdo. Referências gerais: fisiologia do ciclo (ACOG), janela fértil (Wilcox et al., NEJM 1995)
 * e critérios de TPM/TDPM (ACOG, DSM-5). São TENDÊNCIAS médias: a variação entre mulheres, e entre ciclos
 * da mesma mulher, é grande. O texto deve orientar a observação e a conversa, nunca substituí-las.
 */

export type PhaseInfo = { key: PhaseKey; name: string; tagline: string; color: string; soft: string; blurb: string; highlight: string };

export const PHASES: Record<PhaseKey, PhaseInfo> = {
  menstrual: {
    key: "menstrual", name: "Menstruação", tagline: "Hormônios no piso, corpo em recuperação",
    color: "#E0566B", soft: "#3A1F2B",
    blurb: "Estrogênio e progesterona no nível mais baixo do ciclo. Dor, cansaço e menor tolerância a esforço são comuns.",
    highlight: "Retire carga dela em vez de perguntar se ela precisa de ajuda.",
  },
  folicular: {
    key: "folicular", name: "Folicular", tagline: "Estrogênio subindo, energia em alta",
    color: "#3FB58A", soft: "#16322B",
    blurb: "O estrogênio sobe de forma gradual. Muitas mulheres relatam mais energia, foco e disposição social.",
    highlight: "Boa janela para decisões, planos e programas novos.",
  },
  ovulatoria: {
    key: "ovulatoria", name: "Ovulatória", tagline: "Pico hormonal e fertilidade máxima",
    color: "#F2B134", soft: "#3B2D10",
    blurb: "Pico de estrogênio e de LH, ovulação e a maior fertilidade do ciclo. O desejo costuma ser mais alto.",
    highlight: "Combine a contracepção antes: é o período de maior risco de gravidez.",
  },
  lutea: {
    key: "lutea", name: "Lútea", tagline: "Progesterona domina, sensibilidade oscila",
    color: "#8B6FE0", soft: "#251F44",
    blurb: "A progesterona sobe e depois cai junto com o estrogênio. Em quem é sensível a essa queda, surgem os sintomas pré-menstruais.",
    highlight: "Reduza atrito e imprevistos, sobretudo na última semana.",
  },
};

export type Stage = {
  name: string;
  /** Mecanismo fisiológico em uma frase. */
  why: string;
  hormones: string;
  mood: string;
  body: string;
  /** Tendências de 1 a 5. */
  energy: number;
  sensitivity: number;
  desire: number;
  do: string[];
  avoid: string[];
  talk: string[];
  tip: string;
  /** Aviso de saúde quando faz sentido. */
  flag?: string;
};

const FLAG_PAIN =
  "Dor que impede a rotina, fluxo que encharca um absorvente em menos de 2 horas ou coágulos grandes merecem avaliação ginecológica (podem indicar endometriose ou outras condições tratáveis).";
const FLAG_TDPM =
  "Se a TPM vier com tristeza profunda, ansiedade intensa ou desesperança a cada ciclo, pode ser TDPM (transtorno disfórico pré-menstrual), que tem tratamento. Incentive acompanhamento médico. Em crise ou pensamentos de se machucar, o CVV atende 24h pelo 188.";

export const STAGES: Record<PhaseKey, Stage[]> = {
  menstrual: [
    {
      name: "Dia 1 · Início do fluxo",
      why: "Sem gravidez, a progesterona e o estrogênio caem ao mínimo e o útero libera prostaglandinas, substâncias que o fazem contrair e causam a cólica.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Costuma estar mais cansada e retraída, com menos tolerância a barulho, cobrança e imprevistos.",
      body: "Cólica e dor lombar tendem a ser mais fortes no 1º e no 2º dia, com fluxo intenso e fadiga.",
      energy: 1, sensitivity: 4, desire: 2,
      do: [
        "Tire tarefas das costas dela sem perguntar: jantar, mercado, compromissos. Perguntar “precisa de ajuda?” devolve a ela o trabalho de decidir",
        "Ofereça duas opções concretas (“prefere que eu peça comida ou cozinho algo simples?”). Escolher entre duas exige pouca energia",
        "Calor local no abdômen e no lombar alivia a cólica, e o analgésico de costume funciona melhor se tomado cedo",
      ],
      avoid: ["Cobrar disposição, sexo ou programa animado", "Chamar a dor de exagero ou “frescura”", "Abrir discussões ou decisões pesadas hoje"],
      talk: ["“Hoje eu assumo o jantar e o resto da casa. Se quiser mais alguma coisa, me fala.”", "“Dia difícil, né? Vou deixar você tranquila e estou por aqui se precisar.”"],
      tip: "O primeiro dia costuma ser o mais difícil. Antecipe-se: resolva a logística do dia antes que ela precise pedir.",
      flag: FLAG_PAIN,
    },
    {
      name: "Dia 2 · Fluxo no auge",
      why: "O endométrio continua descamando e as prostaglandinas seguem altas. A perda de sangue soma-se à fadiga, e a ferritina (reserva de ferro) pode cair.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Ainda recolhida, embora muita gente já sinta alívio em relação ao primeiro dia.",
      body: "Cólica ainda presente, fluxo no pico, inchaço e cansaço mais marcantes.",
      energy: 1, sensitivity: 4, desire: 2,
      do: ["Mantenha a casa funcionando sem exigir a participação dela", "Proponha algo de baixo esforço: filme, série, jantar em casa", "Deixe claro que não há expectativa de nada além de estar junto"],
      avoid: ["Insistir em sair se ela prefere ficar", "Comentar o humor ou o corpo dela", "Fazer piada com a menstruação"],
      talk: ["“Sem pressão nenhuma hoje: ficar em casa já está ótimo pra mim.”", "“Quer companhia ou prefere ficar sozinha um pouco? Qualquer resposta é tranquila.”"],
      tip: "Presença sem demanda: ficar perto, sem exigir conversa nem resposta, costuma valer mais que qualquer gesto elaborado.",
      flag: FLAG_PAIN,
    },
    {
      name: "Dia 3 · Fluxo diminuindo",
      why: "O endométrio já descamou em grande parte, a dor tende a cair e o estrogênio começa a subir de novo.",
      hormones: "Estrogênio começa a subir · Progesterona baixa",
      mood: "O humor melhora aos poucos e ela costuma voltar a conversar mais.",
      body: "Cólicas aliviam e o fluxo diminui. O cansaço ainda pode persistir.",
      energy: 2, sensitivity: 3, desire: 3,
      do: ["Convide para algo curto e leve, como um café ou uma caminhada, deixando claro que pode recusar", "Faça elogios específicos e sinceros: a autoimagem pode estar mais frágil", "Retome o contato com conversa leve, sem cobrar o que ficou pendente"],
      avoid: ["Cobrar o ritmo de antes", "Planejar um dia cheio", "Tratar a melhora como sinal de que já está 100%"],
      talk: ["“Se estiver com vontade, dou uma volta com você. Se não, tudo bem.”", "“Senti falta de conversar com você. Como foi seu dia?”"],
      tip: "A energia volta, mas devagar. Convites curtos e com saída fácil funcionam melhor que programas longos.",
    },
    {
      name: "Dia 4 · Fim do fluxo",
      why: "O estrogênio sobe com mais consistência, o que melhora disposição e humor em grande parte das mulheres.",
      hormones: "Estrogênio ↑ · Progesterona baixa",
      mood: "Mais leve e disposta. O interesse em sair e conversar costuma voltar.",
      body: "Para a maioria, pouca ou nenhuma dor, com fluxo leve.",
      energy: 3, sensitivity: 3, desire: 3,
      do: ["Planeje algo para os próximos dias e convide com antecedência", "Retome conversas que ficaram em espera", "Dê espaço para ela escolher o ritmo da retomada, inclusive o da intimidade"],
      avoid: ["Empolgar-se demais e atropelar o ritmo dela", "Pressionar por intimidade se ela não demonstrar vontade"],
      talk: ["“Quando você estiver mais disposta, queria te levar num lugar. Posso reservar?”", "“Você parece mais leve hoje. Como está se sentindo?”"],
      tip: "É um bom dia para reabrir a agenda de vocês: um convite simples, sem expectativa de resposta imediata.",
    },
    {
      name: "Último dia · Transição",
      why: "Com o fim do sangramento, o estrogênio já sobe mais rápido e prepara a fase folicular.",
      hormones: "Estrogênio ↑",
      mood: "Disposição em alta e boa receptividade a planos.",
      body: "Fluxo mínimo ou apenas manchas. Corpo mais leve.",
      energy: 3, sensitivity: 2, desire: 3,
      do: ["Combine algo para o fim de semana", "Sugira uma atividade que vocês gostam de fazer juntos", "Demonstre afeto de forma natural, sem cobrar retribuição"],
      avoid: ["Ficar só em casa se ela quer sair", "Deixar para depois a conversa que ficou pendente"],
      talk: ["“O que você estava com vontade de fazer nesse fim de semana?”", "“Vamos aproveitar que você está melhor e fazer algo diferente?”"],
      tip: "A energia sobe a partir de agora. Fechar a agenda dos próximos dias já resolve metade do clima.",
    },
  ],

  folicular: [
    {
      name: "Estrogênio subindo",
      why: "O FSH estimula o crescimento de folículos nos ovários, e eles produzem estrogênio de forma gradual.",
      hormones: "FSH ↑ · Estrogênio ↑ (gradual)",
      mood: "Humor mais leve e curiosidade crescendo.",
      body: "Pele, cabelo e disposição costumam melhorar.",
      energy: 3, sensitivity: 2, desire: 3,
      do: ["Proponha algo novo: um lugar, uma atividade, uma receita", "Interesse-se pelas ideias dela e faça perguntas, em vez de só concordar", "Retome planos que ficaram parados"],
      avoid: ["Cair na rotina e deixar os dias passarem iguais", "Descartar as ideias dela de primeira"],
      talk: ["“Pensei num programa diferente pra gente. Topa ouvir a ideia?”", "“Se pudesse fazer qualquer coisa nos próximos meses, o que seria?”"],
      tip: "Novidade rende bem nesta fase: o cérebro responde mais a estímulos novos quando o estrogênio está em alta.",
    },
    {
      name: "Disposição em alta",
      why: "Com o estrogênio mais alto, muitas mulheres relatam mais energia, motivação e bom humor, embora o efeito varie bastante entre pessoas.",
      hormones: "Estrogênio ↑",
      mood: "Mais motivada, criativa e comunicativa.",
      body: "Boa disposição física e recuperação rápida após esforço.",
      energy: 4, sensitivity: 2, desire: 3,
      do: ["Aproveite para conversas de planejamento: viagem, dinheiro, mudanças", "Proponha atividade física a dois: dança, corrida leve, trilha", "Marquem com amigos ou outros casais"],
      avoid: ["Adiar conversas importantes quando ela está receptiva", "Ficar o tempo todo no modo sofá"],
      talk: ["“Queria te ouvir sobre os planos pro próximo semestre. O que está te animando?”", "“Vamos fazer algo ativo no fim de semana?”"],
      tip: "A receptividade a conversas de planejamento tende a ser maior agora. Se há um assunto adiado, esta é uma boa janela.",
    },
    {
      name: "Confiança e sociabilidade",
      why: "O estrogênio atua em circuitos de motivação e recompensa, o que pode aumentar a vontade de socializar e de assumir desafios.",
      hormones: "Estrogênio ↑",
      mood: "Mais confiante e sociável.",
      body: "Sensação geral de bem-estar e energia estável.",
      energy: 4, sensitivity: 2, desire: 3,
      do: ["Faça elogios específicos a algo que ela fez, e não elogios genéricos", "Convide para um jantar com amigos ou um evento", "Experimentem um restaurante ou lugar novo"],
      avoid: ["Cobrar o que ficou por fazer", "Decidir os planos sozinho"],
      talk: ["“Gostei de como você lidou com aquilo no trabalho. Foi muito bem pensado.”", "“Quer chamar o pessoal pra um jantar aqui?”"],
      tip: "Elogio específico (o que ela fez, e por que importou) é mais convincente do que elogio genérico.",
    },
    {
      name: "Desejo começando a subir",
      why: "Estrogênio e testosterona sobem nos dias que antecedem a ovulação, e muitas mulheres percebem mais interesse por intimidade. A janela fértil já está aberta.",
      hormones: "Estrogênio ↑ · Testosterona ↑ (leve)",
      mood: "Mais flerte e mais vontade de proximidade.",
      body: "Energia alta. O muco cervical fica mais claro e elástico, sinal de fertilidade.",
      energy: 4, sensitivity: 2, desire: 4,
      do: ["Invista em clima antes de intimidade: encontro, atenção, mensagem criativa durante o dia", "Combinem a contracepção agora: a janela fértil começa cerca de 5 dias antes da ovulação", "Deixe que ela conduza o ritmo"],
      avoid: ["Presumir que o desejo dela acompanha o seu", "Deixar a contracepção para o último momento"],
      talk: ["“Me deu vontade de te ver. Jantamos só nós dois hoje?”", "“Vamos combinar a proteção dos próximos dias com calma?”"],
      tip: "Os espermatozoides sobrevivem até 5 dias no trato feminino, então a janela fértil começa antes da ovulação. Se não planejam gravidez, a conversa sobre contracepção é agora.",
    },
    {
      name: "Janela fértil aberta",
      why: "O folículo dominante amadurece e o estrogênio chega perto do pico. A chance de gravidez já é relevante.",
      hormones: "Estrogênio ↑↑ (perto do pico)",
      mood: "Confiança alta, mais expansiva e afetuosa.",
      body: "Energia alta e muco fértil.",
      energy: 5, sensitivity: 2, desire: 4,
      do: ["Reserve um encontro só de vocês, sem celular na mesa", "Confirme a contracepção antes de qualquer imprevisto", "Dê atenção total e escute com curiosidade"],
      avoid: ["Marcar compromissos que roubam o tempo de vocês", "Tratar o assunto da proteção como algo só dela"],
      talk: ["“Reservei a sexta pra gente. E já deixo a proteção por minha conta, ok?”", "“Está tudo certo com a gente sobre contracepção essa semana?”"],
      tip: "A responsabilidade pela contracepção é dos dois. Assumir a parte prática, como camisinha à mão, tira o peso das costas dela.",
    },
    {
      name: "Véspera do pico",
      why: "O estrogênio atinge o ponto mais alto cerca de 1 dia antes do pico de LH, que dispara a ovulação.",
      hormones: "Estrogênio no pico · LH começando a subir",
      mood: "Muito disposta, comunicativa e afetuosa.",
      body: "Energia máxima. Alguns percebem leve dor pélvica.",
      energy: 5, sensitivity: 2, desire: 5,
      do: ["Faça deste dia um encontro marcante: jantar, passeio, algo a dois", "Demonstre desejo com respeito e atenção ao que ela quer", "Tenha a proteção já definida"],
      avoid: ["Passar o dia no piloto automático", "Pressionar: o interesse alto não significa disponibilidade para tudo"],
      talk: ["“Você está radiante. Estou muito feliz de passar esse tempo com você.”", "“O que você gostaria de fazer hoje à noite?”"],
      tip: "A chance de gravidez nos 2 dias antes da ovulação e no dia dela é a maior do ciclo.",
    },
  ],

  ovulatoria: [
    {
      name: "2 dias antes da ovulação",
      why: "A probabilidade de gravidez é maior nos 2 dias antes e no dia da ovulação, pois os espermatozoides sobrevivem até 5 dias e o óvulo, 12 a 24 horas.",
      hormones: "Estrogênio no pico · LH começando a subir",
      mood: "Comunicativa, afetuosa e confiante.",
      body: "Muco fértil, libido tendendo a ser mais alta e, para algumas, leve dor pélvica.",
      energy: 5, sensitivity: 2, desire: 5,
      do: ["Planeje o tempo de vocês com antecedência", "Alinhe a contracepção: é o período de maior risco de gravidez", "Elogie e demonstre desejo com respeito"],
      avoid: ["Passar a janela fértil sem combinar proteção", "Deixar o encontro de lado por cansaço seu"],
      talk: ["“Quero uma noite só nossa. Pode ser?”", "“Está tudo combinado sobre a proteção?”"],
      tip: "É o início do período de maior fertilidade. Se não planejam gravidez, use proteção em todas as relações.",
    },
    {
      name: "Pico de LH",
      why: "O pico de estrogênio dispara o surto de LH, 24 a 36 horas antes da ovulação. É o sinal que libera o óvulo.",
      hormones: "LH ↑↑ (surto) · Estrogênio no pico",
      mood: "Auge de energia, sociabilidade e desejo.",
      body: "Parte das mulheres sente dor leve de um lado do abdômen (mittelschmerz).",
      energy: 5, sensitivity: 2, desire: 5,
      do: ["Dê atenção total, sem distrações", "Deixe claro que pode parar ou desacelerar a qualquer momento", "Cuide da contracepção sem depender de lembrete dela"],
      avoid: ["Tratar o dia como qualquer outro", "Ignorar desconforto leve que ela mencione"],
      talk: ["“Hoje o foco é você e a gente. Sem pressa.”", "“Se algo incomodar, me avisa e eu mudo.”"],
      tip: "O teste de ovulação (LH) em farmácia confirma esse pico, caso queiram precisão em vez de estimativa.",
    },
    {
      name: "Dia da ovulação",
      why: "O folículo libera o óvulo. A janela de fertilidade termina cerca de 1 dia depois.",
      hormones: "LH no pico · Progesterona começando a subir",
      mood: "Afetuosa. Algumas sentem leve queda de energia no fim do dia.",
      body: "Possível dor leve ou manchas. A temperatura basal sobe 0,2 a 0,5 °C nos dias seguintes.",
      energy: 5, sensitivity: 2, desire: 5,
      do: ["Faça deste um momento de conexão sem pressa", "Mantenha a proteção, pois ainda é período fértil", "Pergunte como ela está se sentindo fisicamente"],
      avoid: ["Assumir que a fertilidade acabou", "Marcar compromissos que tiram o tempo de vocês"],
      talk: ["“Estou aqui por você hoje. Não temos pressa.”", "“Como está seu corpo hoje? Tudo bem?”"],
      tip: "Estimativas por calendário têm margem de erro de alguns dias. Para contracepção, não dependa só do app.",
    },
    {
      name: "Logo após a ovulação",
      why: "O óvulo sobrevive de 12 a 24 horas, então a fertilidade cai rápido. A progesterona sobe e inicia a fase lútea.",
      hormones: "Progesterona ↑ · Estrogênio ↓",
      mood: "Afetuosa e mais tranquila, com a energia começando a cair.",
      body: "Temperatura corporal sobe. Algumas percebem leve inchaço.",
      energy: 4, sensitivity: 2, desire: 4,
      do: ["Encerre a fase com um gesto de atenção", "Aproveite a boa disposição para conversar sobre assuntos importantes", "Comece a reduzir o ritmo de programas intensos"],
      avoid: ["Cobrar a mesma energia dos dias anteriores", "Ignorar sinais de cansaço"],
      talk: ["“Foram dias muito bons. Obrigado por isso.”", "“Quer deixar o fim de semana mais tranquilo?”"],
      tip: "A virada hormonal costuma ser suave. Notar sem comentar é a melhor postura.",
    },
  ],

  lutea: [
    {
      name: "Início da lútea",
      why: "Após a ovulação, o corpo lúteo (o que sobra do folículo) passa a produzir progesterona e estrogênio.",
      hormones: "Progesterona ↑ · Estrogênio ↓ e ↑",
      mood: "Ainda sobra energia do pico, mas o humor já pode começar a oscilar.",
      body: "A temperatura corporal sobe e o apetite pode aumentar.",
      energy: 4, sensitivity: 2, desire: 3,
      do: ["Aproveite a boa disposição para programas a dois", "Observe sem comentar: as primeiras mudanças de humor são sutis", "Mantenha a rotina previsível"],
      avoid: ["Assumir que o ritmo do pico vai continuar", "Encher a agenda de compromissos"],
      talk: ["“Como está sua semana? Quer que a gente deixe algo mais leve?”", "“Quer que eu cuide de alguma coisa essa semana?”"],
      tip: "Esta é a transição. Ainda há energia, mas é o momento de começar a reduzir imprevistos.",
    },
    {
      name: "Calma e foco",
      why: "A progesterona tem efeito calmante (seus metabólitos agem nos receptores GABA), o que pode dar mais calma e, em algumas mulheres, sonolência.",
      hormones: "Progesterona ↑",
      mood: "Mais voltada para dentro, com foco, vontade de organizar e menos paciência para bagunça.",
      body: "Mais sono e apetite, temperatura corporal um pouco mais alta.",
      energy: 4, sensitivity: 2, desire: 3,
      do: ["Resolva pendências da casa e da vida a dois", "Prefira programas tranquilos e previsíveis", "Reconheça de forma específica o que ela entrega no dia a dia"],
      avoid: ["Cobrar sociabilidade o tempo todo", "Mudar planos em cima da hora"],
      talk: ["“Podemos organizar essa semana juntos? Assim fica leve pra nós dois.”", "“Quer deixar o fim de semana em casa?”"],
      tip: "A ordem e a previsibilidade ajudam agora. Cumprir combinados vale mais que surpresas.",
    },
    {
      name: "Pico da progesterona",
      why: "Cerca de 7 dias após a ovulação a progesterona atinge o máximo, e o estrogênio tem um segundo pico menor.",
      hormones: "Progesterona no pico · Estrogênio (2º pico)",
      mood: "Calma ou sonolência. Algumas começam a notar oscilações.",
      body: "Inchaço leve, retenção de líquidos e sono mais pesado.",
      energy: 3, sensitivity: 3, desire: 3,
      do: ["Facilite as noites: ambiente calmo e horário regular", "Tenha em casa o que ela costuma querer comer, sem comentar", "Divida tarefas que exijam esforço físico"],
      avoid: ["Comentar inchaço ou peso", "Marcar eventos longos"],
      talk: ["“Hoje parece um dia pra descansar. Fico com você ou prefere sossego?”", "“Quer que eu cuide do jantar?”"],
      tip: "O corpo está retendo líquido. Evitar comentários sobre aparência é essencial nesta fase.",
    },
    {
      name: "Humor começando a oscilar",
      why: "Os níveis hormonais ainda estão altos, mas a sensibilidade a eles varia. Em quem é mais sensível, serotonina e GABA respondem de forma diferente, o que explica por que o humor muda mais em umas do que em outras.",
      hormones: "Progesterona ↑ · Estrogênio ↑",
      mood: "O humor pode alternar entre leve e irritado. Pequenas coisas incomodam mais.",
      body: "Cansaço, apetite maior e sono mais leve.",
      energy: 3, sensitivity: 3, desire: 3,
      do: ["Seja flexível: um dia pode estar leve e no outro mais sensível", "Pergunte como ela está, sem pressionar nem insistir", "Tenha o que ela costuma querer em casa"],
      avoid: ["Levar as oscilações para o lado pessoal", "Tentar corrigir ou explicar o humor dela"],
      talk: ["“Percebi que o dia foi puxado. Quer me contar ou prefere deixar quieto?”", "“Se eu fizer algo que incomode, pode me falar na hora.”"],
      tip: "Oscilações de humor não são sobre você. Responder com calma e sem se defender evita que vire discussão.",
    },
    {
      name: "Sensibilidade crescendo",
      why: "Se o óvulo não foi fecundado, estrogênio e progesterona começam a cair. É a queda, mais que o nível absoluto, que se associa aos sintomas pré-menstruais.",
      hormones: "Estrogênio ↓ · Progesterona ↓ (início da queda)",
      mood: "Mais sensível, com necessidade de previsibilidade.",
      body: "Inchaço, sensibilidade nas mamas e vontade de doce.",
      energy: 3, sensitivity: 4, desire: 2,
      do: ["Ouça mais e proponha menos", "Ofereça ajuda concreta antes de ela pedir", "Facilite a noite: ambiente calmo e sem discussão antes de dormir"],
      avoid: ["Mudanças de última hora", "Comentar o corpo ou o humor dela", "Debater a relação"],
      talk: ["“Pode me falar se algo estiver pesando. Prometo só escutar.”", "“Quer que eu resolva isso por você?”"],
      tip: "Ouvir sem tentar resolver é, nesta fase, a ajuda mais eficaz. A maioria das pessoas quer ser entendida antes de ser aconselhada.",
    },
    {
      name: "Pré-TPM",
      why: "A janela dos sintomas pré-menstruais costuma começar cerca de 5 a 7 dias antes da menstruação e terminar até 4 dias depois do início do fluxo (critério ACOG). Nem toda mulher tem TPM.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Irritabilidade, choro fácil, ansiedade ou cansaço em quem tem TPM.",
      body: "Dor de cabeça, inchaço e mamas doloridas.",
      energy: 3, sensitivity: 4, desire: 2,
      do: ["Reduza a carga dela: menos tarefas e menos decisões", "Seja direto e gentil, sem ironia nem sarcasmo", "Mantenha a rotina e cumpra o que combinou"],
      avoid: ["Críticas e cobranças", "Discussões sobre a relação", "Programas que exigem muita energia"],
      talk: ["“Hoje eu cuido do que for preciso. Você só avisa o que ajudar.”", "“Posso deixar esse assunto pra depois que você estiver melhor?”"],
      tip: "Adie discussões importantes para depois da menstruação. Não é fugir do assunto: é escolher o momento em que a conversa rende.",
    },
    {
      name: "TPM · Maior sensibilidade",
      why: "A queda hormonal afeta neurotransmissores como serotonina, e o efeito é mais forte em quem tem maior sensibilidade a essas variações.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Mais irritável, ansiosa ou triste. Pequenas coisas pesam mais.",
      body: "Cansaço, inchaço, dores de cabeça e sensibilidade nas mamas.",
      energy: 2, sensitivity: 5, desire: 2,
      do: ["Mantenha o tom calmo, mesmo se ela estiver irritada", "Ouça por inteiro antes de responder", "Assuma tarefas sem esperar que ela peça"],
      avoid: ["Reagir à irritação com irritação", "Dizer “é a TPM falando”: invalida o que ela sente", "Levar para o pessoal o que é do momento"],
      talk: ["“Entendo que está difícil. Estou do seu lado.”", "“Quer conversar agora ou prefere depois?”"],
      tip: "Evite explicar o humor pelo ciclo na frente dela. Reconheça a emoção e deixe a explicação para depois.",
      flag: FLAG_TDPM,
    },
    {
      name: "Véspera da menstruação",
      why: "Os hormônios estão no ponto mais baixo antes do fluxo, e é comum que ela se sinta no limite.",
      hormones: "Estrogênio ↓↓ · Progesterona ↓↓",
      mood: "Mais frágil, cansada ou irritada.",
      body: "Dor de cabeça, inchaço, cólica leve e cansaço.",
      energy: 2, sensitivity: 5, desire: 2,
      do: ["Deixe a noite tranquila e previsível", "Tenha à mão o que ela costuma pedir na menstruação", "Mostre disponibilidade sem impor nada"],
      avoid: ["Qualquer discussão séria", "Comentários sobre humor ou comida", "Cobrar compromissos"],
      talk: ["“Amanhã a menstruação deve chegar. Deixei tudo organizado pra você descansar.”", "“Estou aqui. Fala quando quiser.”"],
      tip: "Em poucos dias a fase mais difícil passa, porque o fluxo costuma trazer alívio dos sintomas pré-menstruais.",
      flag: FLAG_TDPM,
    },
  ],
};

export function stageFor(phase: PhaseKey, phaseDay: number, phaseLength: number): Stage {
  const st = STAGES[phase];
  const raw = phaseLength > 0 ? Math.floor(((phaseDay - 1) / phaseLength) * st.length) : 0;
  return st[Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), st.length - 1)];
}

export function pick<T>(arr: T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}
