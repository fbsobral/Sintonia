import type { PhaseKey } from "./cycle";
import { SELF_STAGES } from "./tips-self";

/*
 * Base de conteúdo. Referências gerais: fisiologia do ciclo (ACOG), janela fértil (Wilcox et al., NEJM 1995)
 * e critérios de TPM/TDPM (ACOG, DSM-5). São TENDÊNCIAS médias: a variação entre mulheres, e entre ciclos
 * da mesma mulher, é grande. O texto deve orientar a observação e a conversa, nunca substituí-las.
 *
 * Voz: explicativa e adulta. Cada orientação traz a razão (o "porquê"), e não só a ação.
 */

export type PhaseInfo = { key: PhaseKey; name: string; tagline: string; color: string; soft: string; blurb: string; highlight: string };

export const PHASES: Record<PhaseKey, PhaseInfo> = {
  menstrual: {
    key: "menstrual", name: "Menstruação", tagline: "Hormônios no piso, corpo em recuperação",
    color: "#E0566B", soft: "#3A1F2B",
    blurb: "Estrogênio e progesterona estão no nível mais baixo do ciclo. Dor, cansaço e menor tolerância a esforço são comuns, e o corpo prioriza recuperação.",
    highlight: "Retire carga dela em vez de perguntar se ela precisa de ajuda.",
  },
  folicular: {
    key: "folicular", name: "Folicular", tagline: "Estrogênio subindo, energia em alta",
    color: "#3FB58A", soft: "#16322B",
    blurb: "O estrogênio sobe de forma gradual e age em áreas do cérebro ligadas a humor e motivação. Muitas mulheres relatam mais energia, foco e disposição social.",
    highlight: "Boa janela para decisões, planos e programas novos.",
  },
  ovulatoria: {
    key: "ovulatoria", name: "Ovulatória", tagline: "Pico hormonal e fertilidade máxima",
    color: "#F2B134", soft: "#3B2D10",
    blurb: "Pico de estrogênio e de LH, ovulação e a maior fertilidade do ciclo. O desejo costuma ser mais alto e a comunicação, mais fluida.",
    highlight: "Combine a contracepção antes: é o período de maior risco de gravidez.",
  },
  lutea: {
    key: "lutea", name: "Lútea", tagline: "Progesterona domina, sensibilidade oscila",
    color: "#8B6FE0", soft: "#251F44",
    blurb: "A progesterona sobe e depois cai junto com o estrogênio. Em quem é sensível a essa queda, surgem os sintomas pré-menstruais, sobretudo na última semana.",
    highlight: "Reduza atrito e imprevistos, sobretudo na última semana.",
  },
};

export type Stage = {
  name: string;
  /** Mecanismo fisiológico, em linguagem simples. */
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
  "Dor que impede a rotina, fluxo que encharca um absorvente em menos de 2 horas ou coágulos grandes merecem avaliação ginecológica, pois podem indicar endometriose ou outras condições que têm tratamento. Incentive a consulta sem pressionar.";
const FLAG_TDPM =
  "Se a TPM vier com tristeza profunda, ansiedade intensa ou desesperança a cada ciclo, pode ser TDPM (transtorno disfórico pré-menstrual), que tem tratamento. Incentive o acompanhamento médico. Em crise ou diante de pensamentos de se machucar, o CVV atende 24 horas pelo 188.";

export const STAGES: Record<PhaseKey, Stage[]> = {
  menstrual: [
    {
      name: "Dia 1 · Início do fluxo",
      why: "Quando não há gravidez, o corpo lúteo deixa de funcionar e a progesterona e o estrogênio caem ao mínimo. Essa queda faz o endométrio descamar e o útero liberar prostaglandinas, substâncias que o fazem contrair. São essas contrações que causam a cólica, e quanto mais prostaglandina, mais forte a dor.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "É comum que ela esteja cansada, mais quieta e com menos paciência para barulho, cobranças e imprevistos. Isso costuma não ser sobre você nem sobre a relação: o corpo está gastando energia para lidar com a dor e com a perda de sangue.",
      body: "A cólica e a dor lombar tendem a ser mais fortes no primeiro e no segundo dia, e o fluxo costuma estar intenso. A fadiga vem da dor, do sono pior e, em alguns casos, de uma queda temporária nas reservas de ferro.",
      energy: 1, sensitivity: 4, desire: 2,
      do: [
        "Tire tarefas das costas dela sem perguntar: jantar, mercado, compromissos do dia. Perguntar “precisa de ajuda?” devolve a ela o trabalho de pensar no que delegar, e é justamente isso que cansa.",
        "Ofereça duas opções concretas (“prefere que eu peça comida ou cozinho algo simples?”). Escolher entre duas opções exige pouca energia; responder a uma pergunta aberta exige bem mais.",
        "Calor local no abdômen e na lombar alivia a cólica, e o analgésico de costume funciona melhor se for tomado no início da dor. Deixar isso à mão evita que ela precise pedir.",
      ],
      avoid: [
        "Cobrar disposição, sexo ou um programa animado. O corpo está priorizando a recuperação, e a cobrança é lida como falta de percepção, mesmo quando a intenção é boa.",
        "Chamar a dor de exagero ou de “frescura”. A cólica menstrual é real e, em muitas mulheres, intensa; minimizar faz com que ela passe a se calar sobre o que sente.",
        "Abrir discussões ou decisões pesadas hoje. Com menos energia e menor tolerância, qualquer conversa difícil tende a render pior do que renderia em outro dia.",
      ],
      talk: ["“Hoje eu assumo o jantar e o resto da casa. Se quiser mais alguma coisa, é só me dizer.”", "“Sei que hoje costuma ser um dia difícil. Vou deixar tudo tranquilo e estou por aqui se você precisar.”"],
      tip: "O primeiro dia costuma ser o mais difícil, e o que mais ajuda é antecipar. Resolva a logística antes de ela precisar pedir e deixe claro que não há expectativa de nada. Para muita gente, ser poupada de decidir já alivia metade do peso.",
      flag: FLAG_PAIN,
    },
    {
      name: "Dia 2 · Fluxo no auge",
      why: "O endométrio continua descamando e as prostaglandinas seguem altas, por isso a cólica ainda pode incomodar. Ao mesmo tempo, a perda de sangue vai somando à fadiga, e em algumas mulheres a ferritina (a reserva de ferro) cai, o que aumenta o cansaço.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Ela pode continuar mais recolhida, embora muita gente já sinta algum alívio em relação ao primeiro dia. A vontade de conversar costuma ser menor, e o silêncio dela não precisa ser lido como distância.",
      body: "O fluxo costuma estar no pico, com cólica ainda presente e inchaço. A sensação é de corpo pesado, com menos disposição para esforço físico e social.",
      energy: 1, sensitivity: 4, desire: 2,
      do: [
        "Mantenha a casa funcionando sem exigir a participação dela. Ver o ambiente em ordem sem precisar comentar reduz a sensação de estar devendo algo, o que pesa muito quando a energia está baixa.",
        "Proponha algo de baixo esforço, como um filme, uma série ou um jantar em casa. Estar junto sem exigir conversa nem performance costuma ser o tipo de companhia que mais cabe agora.",
        "Deixe claro que não há expectativa de nada além de estar junto. Dizer isso em voz alta tira dela a necessidade de justificar por que não quer sair ou conversar.",
      ],
      avoid: [
        "Insistir em sair se ela prefere ficar. Aceitar o não sem se ofender mostra que você entende o momento, e isso costuma ser retribuído nos dias seguintes.",
        "Comentar o humor ou o corpo dela. Mesmo em tom de brincadeira, comentários sobre aparência ou reação soam como julgamento quando a autoimagem está mais sensível.",
        "Fazer piada com a menstruação. O humor só funciona quando vem dela; vindo de fora, pode parecer deboche de algo que dói.",
      ],
      talk: ["“Sem pressão nenhuma hoje: ficar em casa já está ótimo pra mim.”", "“Quer companhia ou prefere ficar sozinha um pouco? Qualquer resposta é tranquila.”"],
      tip: "Presença sem demanda é o gesto mais eficaz deste dia. Ficar perto, sem exigir conversa nem resposta, comunica cuidado de um jeito que nenhuma frase elaborada consegue. Se ela quiser falar, o espaço já está aberto.",
      flag: FLAG_PAIN,
    },
    {
      name: "Dia 3 · Fluxo diminuindo",
      why: "A maior parte do endométrio já descamou, as prostaglandinas caem e a cólica tende a aliviar. Em paralelo, novos folículos começam a crescer nos ovários e o estrogênio volta a subir devagar, o que costuma melhorar o humor.",
      hormones: "Estrogênio começa a subir · Progesterona baixa",
      mood: "O humor melhora aos poucos e ela costuma voltar a conversar mais. A energia ainda não está plena, e é comum alternar bons momentos com cansaço ao longo do dia.",
      body: "A dor diminui e o fluxo fica mais leve. O corpo ainda está se recuperando, então a disposição varia bastante entre manhã e noite.",
      energy: 2, sensitivity: 3, desire: 3,
      do: [
        "Convide para algo curto e leve, como um café ou uma caminhada, deixando claro que ela pode recusar. Um convite com saída fácil não vira obrigação e, por isso, costuma ser aceito.",
        "Faça elogios específicos e sinceros. A autoimagem pode estar mais frágil, e um elogio que cita algo real (uma decisão, uma atitude) pesa mais que um elogio genérico.",
        "Retome o contato com conversa leve, sem cobrar o que ficou pendente nos dias anteriores. A ideia é reabrir a porta, e não prestar contas.",
      ],
      avoid: [
        "Cobrar o ritmo de antes. Ela está melhorando, mas ainda recuperando energia, e a cobrança estraga justamente essa melhora.",
        "Planejar um dia cheio. Programas longos podem cansar e acabar em frustração para os dois.",
        "Tratar a melhora como sinal de que já está 100%. A recuperação é gradual, e supor o contrário pode soar como pressa.",
      ],
      talk: ["“Se estiver com vontade, dou uma volta com você. Se não, tudo bem.”", "“Senti falta de conversar com você. Como foi seu dia?”"],
      tip: "A energia está voltando, mas devagar. Convites curtos e com saída fácil funcionam melhor que programas longos, porque respeitam um corpo que ainda se recupera sem transformar isso em assunto.",
    },
    {
      name: "Dia 4 · Fim do fluxo",
      why: "O estrogênio sobe com mais consistência a partir daqui, e ele atua em áreas do cérebro ligadas a humor, motivação e energia. É por isso que muitas mulheres se sentem visivelmente melhores nesta etapa, mesmo com o fluxo ainda presente.",
      hormones: "Estrogênio ↑ · Progesterona baixa",
      mood: "Ela tende a estar mais leve e disposta, com interesse crescente em sair e conversar. É uma boa hora para retomar o ritmo de vocês sem pressa.",
      body: "Para a maioria, a dor já é pouca ou inexistente, e o fluxo é leve. O corpo está mais leve, com menos inchaço.",
      energy: 3, sensitivity: 3, desire: 3,
      do: [
        "Planeje algo para os próximos dias e convide com antecedência. Ter um horizonte de programação dá a ela algo para esperar, o que ajuda a consolidar a melhora do humor.",
        "Retome conversas que ficaram em espera. Com mais energia e menos tensão, ela tende a lidar melhor com assuntos que foram adiados durante a menstruação.",
        "Deixe que ela escolha o ritmo da retomada, inclusive o da intimidade. Algumas mulheres sentem desejo logo, outras só dias depois, e nenhum dos dois é um sinal sobre a relação.",
      ],
      avoid: [
        "Empolgar-se demais e atropelar o ritmo dela. Ela está melhorando, mas ainda não está no pico, e o excesso de entusiasmo pode cansar.",
        "Pressionar por intimidade se ela não demonstrar vontade. A pressão tende a tirar o desejo que poderia surgir naturalmente nos dias seguintes.",
        "Cobrar compensação pelos dias em que ela esteve mais retraída. O recolhimento foi físico e não afetivo.",
      ],
      talk: ["“Quando você estiver mais disposta, queria te levar num lugar. Posso reservar?”", "“Você parece mais leve hoje. Como está se sentindo?”"],
      tip: "É um bom dia para reabrir a agenda de vocês. Um convite simples, sem expectativa de resposta imediata, funciona melhor do que um grande plano: ela escolhe quando entrar no ritmo, e você mostra que estava esperando por ela.",
    },
    {
      name: "Último dia · Transição",
      why: "Com o fim do sangramento, o estrogênio já sobe mais rápido e prepara a fase folicular. É a transição entre o período de recolhimento do corpo e o de maior disposição.",
      hormones: "Estrogênio ↑",
      mood: "A disposição está em alta e ela costuma estar receptiva a planos. Muitas mulheres descrevem essa etapa como a de “voltar a si”.",
      body: "O fluxo é mínimo, ou há apenas manchas. O corpo está mais leve e a sensação de inchaço diminui.",
      energy: 3, sensitivity: 2, desire: 3,
      do: [
        "Combine algo para o fim de semana. Fechar a agenda agora aproveita a melhora do humor e evita que os dias bons passem sem planos.",
        "Sugira uma atividade que vocês gostam de fazer juntos. O que já é familiar e prazeroso reativa a conexão sem exigir esforço.",
        "Demonstre afeto de forma natural, sem cobrar retribuição. A ideia é facilitar a reaproximação, e não medir se ela já voltou ao normal.",
      ],
      avoid: [
        "Ficar só em casa se ela quer sair. A energia está voltando, e passar esses dias parado pode desperdiçar a melhor fase para programas.",
        "Deixar para depois a conversa que ficou pendente. Ela tende a estar mais receptiva agora do que estava nos dias anteriores.",
        "Tratar o retorno da disposição como obrigação de compensar o período anterior. Isso transforma alívio em cobrança.",
      ],
      talk: ["“O que você estava com vontade de fazer nesse fim de semana?”", "“Vamos aproveitar que você está melhor e fazer algo diferente?”"],
      tip: "A energia sobe a partir de agora, e fechar a agenda dos próximos dias já resolve metade do clima. Os dias seguintes costumam ser bons, então vale usar essa janela para o que exige disposição dos dois.",
    },
  ],

  folicular: [
    {
      name: "Estrogênio subindo",
      why: "O hormônio folículo-estimulante (FSH) faz alguns folículos crescerem nos ovários, e eles produzem estrogênio. Esse aumento é gradual e vai alterando humor, energia e disposição ao longo dos dias, sem um momento exato de virada.",
      hormones: "FSH ↑ · Estrogênio ↑ (gradual)",
      mood: "O humor fica mais leve e a curiosidade cresce. Ela tende a estar mais aberta a novidades e menos presa ao cansaço dos dias anteriores.",
      body: "Pele, cabelo e disposição costumam melhorar nesta fase, e a recuperação depois de esforço físico fica mais rápida.",
      energy: 3, sensitivity: 2, desire: 3,
      do: [
        "Proponha algo novo: um lugar, uma atividade, uma receita. Com o estrogênio em alta, o cérebro responde melhor a estímulos novos, e o que é diferente tende a ser mais prazeroso.",
        "Interesse-se de verdade pelas ideias dela e faça perguntas, em vez de só concordar. Perguntar mostra que você está acompanhando o raciocínio, e isso a estimula a falar mais.",
        "Retome planos que ficaram parados. O que foi adiado durante a menstruação ganha viabilidade agora.",
      ],
      avoid: [
        "Cair na rotina e deixar os dias passarem iguais. Nesta fase, a falta de novidade costuma incomodar mais do que em outros momentos.",
        "Descartar as ideias dela de primeira. Ela está mais criativa e mais exposta ao ouvir, e uma resposta seca pesa mais do que o esperado.",
        "Frear a retomada da vida social sem perceber. Ela tende a querer sair, e a falta de iniciativa sua pode soar como desinteresse.",
      ],
      talk: ["“Pensei num programa diferente pra gente. Topa ouvir a ideia?”", "“Se pudesse fazer qualquer coisa nos próximos meses, o que seria?”"],
      tip: "Novidade rende bem nesta fase. Escolha algo que vocês nunca fizeram, mesmo que simples: um restaurante diferente, uma trilha curta, um curso de um dia. O objetivo é criar uma lembrança nova, e não gastar muito.",
    },
    {
      name: "Disposição em alta",
      why: "Com o estrogênio mais alto, muitas mulheres relatam mais energia, motivação e bom humor, embora o efeito varie bastante de uma pessoa para outra. O estrogênio também favorece a produção de serotonina e dopamina, neurotransmissores ligados a bem-estar e motivação.",
      hormones: "Estrogênio ↑",
      mood: "Ela costuma estar mais motivada, criativa e comunicativa. É comum ter mais paciência para detalhes e mais abertura para conversar sobre assuntos sérios.",
      body: "A disposição física é boa e a recuperação após esforço é rápida. Muitas mulheres percebem melhor desempenho em exercícios nesta fase.",
      energy: 4, sensitivity: 2, desire: 3,
      do: [
        "Aproveite para conversas de planejamento, como viagem, dinheiro ou mudanças. A receptividade a decisões tende a ser maior agora, e conversas assim rendem mais do que nos dias de baixa energia.",
        "Proponha atividade física a dois, como dança, corrida leve ou trilha. A disposição está alta, e fazer algo juntos fortalece a conexão sem exigir muita conversa.",
        "Marquem com amigos ou outros casais. A sociabilidade costuma estar em alta, e ela tende a aproveitar mais do que em outros momentos.",
      ],
      avoid: [
        "Adiar conversas importantes quando ela está receptiva. Esperar um dia ruim para falar do assunto só dificulta.",
        "Ficar o tempo todo no modo sofá. Ela tem energia, e se a rotina não a acompanha, pode sentir falta de iniciativa sua.",
        "Deixar a agenda social só por conta dela. Sugerir você mesmo mostra interesse e divide o trabalho de organizar.",
      ],
      talk: ["“Queria te ouvir sobre os planos pro próximo semestre. O que está te animando?”", "“Vamos fazer algo ativo no fim de semana?”"],
      tip: "A receptividade a conversas de planejamento tende a ser maior agora. Se há um assunto adiado, esta é uma boa janela: ela está com mais energia para ouvir, argumentar e decidir, e a conversa costuma render com menos desgaste.",
    },
    {
      name: "Confiança e sociabilidade",
      why: "O estrogênio atua em circuitos cerebrais de motivação e de recompensa, o que pode aumentar a vontade de socializar, de assumir desafios e de se expor. Esse efeito costuma ser mais visível quando o hormônio está alto e estável, como nesta etapa.",
      hormones: "Estrogênio ↑",
      mood: "Ela tende a estar mais confiante e sociável, com mais facilidade para se expressar. Percepções negativas sobre si mesma costumam ficar mais leves.",
      body: "Há uma sensação geral de bem-estar e energia estável, sem os picos e vales dos outros momentos do ciclo.",
      energy: 4, sensitivity: 2, desire: 3,
      do: [
        "Faça elogios específicos a algo que ela fez, e não elogios genéricos. Citar uma ação concreta mostra que você prestou atenção, e isso fortalece uma confiança que já está em alta.",
        "Convide para um jantar com amigos ou um evento. A disposição social está alta, e ela tende a aproveitar mais do que em outros momentos.",
        "Experimentem um restaurante ou lugar novo. Combinar novidade com boa disposição costuma gerar boas lembranças.",
      ],
      avoid: [
        "Cobrar o que ficou por fazer. Ela está de bom humor, e a cobrança tira a leveza que poderia aproveitar.",
        "Decidir os planos sozinho. Ela tem energia para participar das escolhas e tende a gostar mais do que foi construído em conjunto.",
        "Minimizar uma conquista dela. Em fases de confiança alta, o reconhecimento tem muito peso, e a indiferença também.",
      ],
      talk: ["“Gostei de como você lidou com aquilo no trabalho. Foi muito bem pensado.”", "“Quer chamar o pessoal pra um jantar aqui?”"],
      tip: "Elogio específico (o que ela fez, e por que importou) é mais convincente que elogio genérico. Em um momento de confiança alta, ele reforça a percepção de que você a enxerga, e não apenas a admira.",
    },
    {
      name: "Desejo começando a subir",
      why: "O estrogênio e a testosterona sobem nos dias que antecedem a ovulação, e muitas mulheres percebem mais interesse por intimidade nesse período. A janela fértil já está aberta, porque os espermatozoides sobrevivem até 5 dias no trato feminino.",
      hormones: "Estrogênio ↑ · Testosterona ↑ (leve)",
      mood: "Ela costuma demonstrar mais flerte e mais vontade de proximidade. O desejo não é uniforme entre mulheres, então observe o que ela sinaliza em vez de presumir.",
      body: "A energia está alta. O muco cervical fica mais claro e elástico, um sinal natural de fertilidade.",
      energy: 4, sensitivity: 2, desire: 4,
      do: [
        "Invista em clima antes de intimidade: um encontro, atenção e uma mensagem criativa durante o dia. Para muitas mulheres, o desejo responde ao contexto, e não só ao impulso.",
        "Combinem a contracepção agora: a janela fértil começa cerca de 5 dias antes da ovulação, então o risco de gravidez já existe mesmo antes do dia da ovulação.",
        "Deixe que ela conduza o ritmo. O desejo aumentado não significa disponibilidade constante, e perguntar o que ela quer evita desencontros.",
      ],
      avoid: [
        "Presumir que o desejo dela acompanha o seu. As variações de libido entre pessoas e entre ciclos são grandes.",
        "Deixar a contracepção para o último momento. A conversa fica mais fácil e menos tensa quando é feita com antecedência.",
        "Passar os dias sem tempo de qualidade. O clima favorável só rende se vocês realmente se encontrarem.",
      ],
      talk: ["“Me deu vontade de te ver. Jantamos só nós dois hoje?”", "“Vamos combinar a proteção dos próximos dias com calma?”"],
      tip: "Se não planejam gravidez, a conversa sobre contracepção é agora. Os espermatozoides sobrevivem até 5 dias, então a janela fértil começa antes da ovulação. Abordar isso cedo, sem constrangimento, evita improvisos e tira o peso das costas dela.",
    },
    {
      name: "Janela fértil aberta",
      why: "O folículo dominante amadurece e o estrogênio chega perto do pico. A probabilidade de gravidez já é relevante, porque os espermatozoides que entrarem agora ainda estarão viáveis quando o óvulo for liberado.",
      hormones: "Estrogênio ↑↑ (perto do pico)",
      mood: "A confiança está alta, e ela tende a se mostrar mais expansiva e afetuosa. É comum que sinta mais vontade de estar com você.",
      body: "A energia é alta e o muco cervical fica fértil. Algumas mulheres percebem a pele mais sensível ou uma leve mudança na temperatura corporal.",
      energy: 5, sensitivity: 2, desire: 4,
      do: [
        "Reserve um encontro só de vocês, sem celular na mesa. A atenção sem distração é o que melhor aproveita a boa disposição dela.",
        "Confirme a contracepção antes de qualquer imprevisto. Ter o assunto resolvido de antemão deixa o resto da noite mais tranquilo.",
        "Dê atenção total e escute com curiosidade. Quando o estrogênio está alto, ela costuma estar mais comunicativa, e é uma boa hora para ouvir.",
      ],
      avoid: [
        "Marcar compromissos que roubam o tempo de vocês. Os dias de maior conexão rendem pouco se ficam espremidos entre obrigações.",
        "Tratar o assunto da proteção como algo só dela. A responsabilidade é dos dois, e carregá-la sozinha cansa.",
        "Supor que “já está tudo certo”. Pergunte e confirme, em vez de presumir.",
      ],
      talk: ["“Reservei a sexta pra gente. E já deixo a proteção por minha conta, ok?”", "“Está tudo certo com a gente sobre contracepção essa semana?”"],
      tip: "A responsabilidade pela contracepção é dos dois. Assumir a parte prática, como deixar a camisinha à mão, tira um peso das costas dela e mostra que você leva a conversa a sério.",
    },
    {
      name: "Véspera do pico",
      why: "O estrogênio atinge o ponto mais alto cerca de 1 dia antes do pico de LH, o hormônio luteinizante, que dispara a ovulação. É o momento em que muitos efeitos do estrogênio aparecem com mais intensidade.",
      hormones: "Estrogênio no pico · LH começando a subir",
      mood: "Ela costuma estar muito disposta, comunicativa e afetuosa. A sensação de bem-estar tende a ser a maior do ciclo.",
      body: "A energia está no máximo. Alguns percebem uma leve dor pélvica de um lado, sinal de que o folículo está pronto para romper.",
      energy: 5, sensitivity: 2, desire: 5,
      do: [
        "Faça deste dia um encontro marcante: um jantar, um passeio, algo a dois. Quando a disposição e a vontade de conexão estão altas, vale usar bem esse tempo.",
        "Demonstre desejo com respeito e atenção ao que ela quer. A abertura maior não dispensa o consentimento atento.",
        "Tenha a proteção já definida. A chance de gravidez está entre as mais altas do ciclo.",
      ],
      avoid: [
        "Passar o dia no piloto automático. A janela de maior conexão é curta e rende mais quando é planejada.",
        "Pressionar: o interesse alto não significa disponibilidade para tudo. Perguntar e observar continua sendo o melhor caminho.",
        "Deixar a proteção para a última hora. Resolver antes evita tensão no momento em que mais importa.",
      ],
      talk: ["“Você está radiante. Estou muito feliz de passar esse tempo com você.”", "“O que você gostaria de fazer hoje à noite?”"],
      tip: "A chance de gravidez nos 2 dias antes da ovulação e no dia dela é a maior do ciclo. Se não planejam gravidez, não conte com a estimativa do calendário: use proteção em todas as relações nesses dias.",
    },
  ],

  ovulatoria: [
    {
      name: "2 dias antes da ovulação",
      why: "A probabilidade de gravidez é maior nos 2 dias antes da ovulação e no dia dela, porque os espermatozoides sobrevivem até 5 dias e o óvulo, apenas 12 a 24 horas. É por isso que a janela fértil termina logo após a ovulação, mas começa bem antes.",
      hormones: "Estrogênio no pico · LH começando a subir",
      mood: "Ela tende a estar comunicativa, afetuosa e confiante. O interesse por proximidade costuma ser alto, e a boa disposição ajuda a sustentar uma agenda cheia.",
      body: "O muco cervical está fértil, a libido tende a ser mais alta e, em algumas mulheres, aparece uma leve dor pélvica.",
      energy: 5, sensitivity: 2, desire: 5,
      do: [
        "Planeje o tempo de vocês com antecedência. Os dias de maior conexão rendem mais quando não são improvisados.",
        "Alinhe a contracepção: é o período de maior risco de gravidez, e a conversa é mais fácil quando feita antes.",
        "Elogie e demonstre desejo com respeito. Ela tende a estar mais receptiva, e a atenção sincera potencializa isso.",
      ],
      avoid: [
        "Passar a janela fértil sem combinar proteção. O custo de uma gravidez não planejada é alto para os dois.",
        "Deixar o encontro de lado por cansaço seu. Os melhores dias para a conexão são poucos.",
        "Presumir que a estimativa do app é exata. A ovulação varia de ciclo para ciclo.",
      ],
      talk: ["“Quero uma noite só nossa. Pode ser?”", "“Está tudo combinado sobre a proteção?”"],
      tip: "É o início do período de maior fertilidade. Se não planejam gravidez, use proteção em todas as relações. O app estima a janela, mas a ovulação pode antecipar ou atrasar de um ciclo para outro.",
    },
    {
      name: "Pico de LH",
      why: "O pico de estrogênio dispara o surto de LH, que acontece 24 a 36 horas antes da ovulação e é o sinal que libera o óvulo. É esse surto que os testes de ovulação de farmácia detectam.",
      hormones: "LH ↑↑ (surto) · Estrogênio no pico",
      mood: "Ela costuma estar no auge de energia, sociabilidade e desejo. A comunicação flui com mais facilidade e a vontade de se conectar é alta.",
      body: "Parte das mulheres sente uma dor leve de um lado do abdômen, chamada mittelschmerz, que costuma durar de horas a um dia.",
      energy: 5, sensitivity: 2, desire: 5,
      do: [
        "Dê atenção total, sem distrações. Quando a conexão é possível, ela rende mais se o ambiente não compete por atenção.",
        "Deixe claro que pode parar ou desacelerar a qualquer momento. Mesmo em fase de desejo maior, o consentimento é contínuo.",
        "Cuide da contracepção sem depender de lembrete dela. Ter tudo pronto evita pausas e tensão.",
      ],
      avoid: [
        "Tratar o dia como qualquer outro. Ele é um dos mais favoráveis à conexão do ciclo.",
        "Ignorar um desconforto leve que ela mencione. Uma dor de lado pode ser a ovulação, e atenção a isso mostra cuidado.",
        "Deixar a decisão sobre proteção só para ela. É uma responsabilidade dividida.",
      ],
      talk: ["“Hoje o foco é você e a gente. Sem pressa.”", "“Se algo incomodar, me avisa e eu mudo.”"],
      tip: "Se quiserem precisão em vez de estimativa, o teste de ovulação (LH) vendido em farmácia detecta esse pico. Ele indica a ovulação com antecedência de cerca de um dia.",
    },
    {
      name: "Dia da ovulação",
      why: "O folículo rompe e libera o óvulo. A janela de fertilidade termina cerca de 1 dia depois, porque o óvulo sobrevive de 12 a 24 horas. Logo após a ovulação, a progesterona começa a subir.",
      hormones: "LH no pico · Progesterona começando a subir",
      mood: "Ela costuma continuar afetuosa. Algumas mulheres sentem uma leve queda de energia no fim do dia, quando o estrogênio começa a baixar.",
      body: "Pode haver dor leve ou pequenas manchas. A temperatura basal sobe de 0,2 a 0,5 °C nos dias seguintes.",
      energy: 5, sensitivity: 2, desire: 5,
      do: [
        "Faça deste um momento de conexão sem pressa. O dia da ovulação costuma combinar bem-estar e disposição.",
        "Mantenha a proteção, pois ainda é período fértil. A janela termina depois da ovulação, e não antes.",
        "Pergunte como ela está se sentindo fisicamente. Se houver dor ou manchas, atenção e cuidado são bem-vindos.",
      ],
      avoid: [
        "Assumir que a fertilidade acabou. Ela só cai no dia seguinte.",
        "Marcar compromissos que tiram o tempo de vocês. É um dos poucos dias de pico do ciclo.",
        "Minimizar um desconforto pélvico leve que ela relate. Ele costuma ser normal, mas merece atenção.",
      ],
      talk: ["“Estou aqui por você hoje. Não temos pressa.”", "“Como está seu corpo hoje? Tudo bem?”"],
      tip: "Estimativas por calendário têm margem de erro de alguns dias. Para contracepção, não dependa só do app, que mostra o que é provável e não o que está acontecendo no corpo dela.",
    },
    {
      name: "Logo após a ovulação",
      why: "O óvulo sobrevive de 12 a 24 horas, então a fertilidade cai rapidamente. A progesterona, produzida pelo corpo lúteo, sobe e inicia a fase lútea, que prepara o útero para uma possível gravidez.",
      hormones: "Progesterona ↑ · Estrogênio ↓",
      mood: "Ela tende a estar afetuosa e mais tranquila, com a energia começando a descer. A sensação é de calma depois do pico.",
      body: "A temperatura corporal sobe levemente e algumas mulheres percebem um inchaço leve.",
      energy: 4, sensitivity: 2, desire: 4,
      do: [
        "Encerre a fase com um gesto de atenção. Fechar bem os dias de maior conexão deixa uma boa lembrança para a semana seguinte.",
        "Aproveite a boa disposição para conversar sobre assuntos importantes. A receptividade ainda é alta.",
        "Comece a reduzir o ritmo de programas intensos. O corpo está entrando em outra fase.",
      ],
      avoid: [
        "Cobrar a mesma energia dos dias anteriores. A queda é esperada e não é desinteresse.",
        "Ignorar sinais de cansaço. Eles aparecem aos poucos e são um aviso de que o ritmo precisa mudar.",
        "Supor que a mudança de humor que vem a seguir tenha a ver com você. Ela costuma ter origem hormonal.",
      ],
      talk: ["“Foram dias muito bons. Obrigado por isso.”", "“Quer deixar o fim de semana mais tranquilo?”"],
      tip: "A virada hormonal costuma ser suave. Notar sem comentar é a melhor postura: ela percebe a mudança no próprio corpo, e comentários tendem a soar como cobrança.",
    },
  ],

  lutea: [
    {
      name: "Início da lútea",
      why: "Depois da ovulação, o corpo lúteo (o que sobra do folículo) passa a produzir progesterona e um pouco de estrogênio. Essa mudança hormonal prepara o útero e começa a alterar temperatura, apetite e humor.",
      hormones: "Progesterona ↑ · Estrogênio ↓ e ↑",
      mood: "Ainda sobra energia do pico, mas o humor já pode começar a oscilar. As mudanças costumam ser sutis nesta etapa, e é fácil não perceber.",
      body: "A temperatura corporal sobe e o apetite pode aumentar. Algumas mulheres sentem mais sono.",
      energy: 4, sensitivity: 2, desire: 3,
      do: [
        "Aproveite a boa disposição para programas a dois. Esta é uma das últimas janelas de energia mais alta do ciclo.",
        "Observe sem comentar. As primeiras mudanças de humor são sutis, e apontá-las pode soar como julgamento.",
        "Mantenha a rotina previsível. A estabilidade ajuda o corpo a se adaptar à nova fase.",
      ],
      avoid: [
        "Assumir que o ritmo do pico vai continuar. A queda gradual de energia é esperada e não é desinteresse.",
        "Encher a agenda de compromissos. Os próximos dias tendem a pedir mais calma.",
        "Comentar mudanças de apetite ou de sono. Elas fazem parte da fase e comentários geram culpa.",
      ],
      talk: ["“Como está sua semana? Quer que a gente deixe algo mais leve?”", "“Quer que eu cuide de alguma coisa essa semana?”"],
      tip: "Esta é a transição. Ainda há energia, mas é o momento de começar a reduzir imprevistos. Dias previsíveis agora preparam o terreno para uma fase lútea mais tranquila.",
    },
    {
      name: "Calma e foco",
      why: "A progesterona tem efeito calmante: seus metabólitos agem nos receptores GABA do cérebro, os mesmos alvos de alguns calmantes. Isso pode dar mais calma e foco e, em algumas mulheres, sonolência.",
      hormones: "Progesterona ↑",
      mood: "Ela tende a ficar mais voltada para dentro, com foco, vontade de organizar e menos paciência para bagunça. Pode parecer mais séria sem estar chateada.",
      body: "O sono pode aumentar e o apetite também. A temperatura corporal fica um pouco mais alta.",
      energy: 4, sensitivity: 2, desire: 3,
      do: [
        "Resolva pendências da casa e da vida a dois. O foco dela está alto, e ela tende a valorizar quando as coisas ficam resolvidas.",
        "Prefira programas tranquilos e previsíveis. A energia social começa a diminuir.",
        "Reconheça de forma específica o que ela entrega no dia a dia. A valorização concreta pesa mais que elogio geral.",
      ],
      avoid: [
        "Cobrar sociabilidade o tempo todo. A vontade de ficar mais reservada é normal nesta fase.",
        "Mudar planos em cima da hora. A previsibilidade é muito valorizada agora.",
        "Interpretar a seriedade como chateação. Se houver um problema, ela costuma falar.",
      ],
      talk: ["“Podemos organizar essa semana juntos? Assim fica leve pra nós dois.”", "“Quer deixar o fim de semana em casa?”"],
      tip: "A ordem e a previsibilidade ajudam agora. Cumprir combinados e evitar surpresas de última hora vale mais do que gestos grandes: a calma dela depende de poder contar com o que foi combinado.",
    },
    {
      name: "Pico da progesterona",
      why: "Cerca de 7 dias após a ovulação, a progesterona atinge o máximo, e o estrogênio tem um segundo pico menor. É o ponto de maior influência da progesterona no corpo, com efeitos sobre sono, retenção de líquidos e digestão.",
      hormones: "Progesterona no pico · Estrogênio (2º pico)",
      mood: "Pode haver calma ou sonolência, e algumas mulheres começam a notar oscilações. O humor costuma estar estável, mas com menos disposição social.",
      body: "É comum haver inchaço leve, retenção de líquidos e sono mais pesado. O intestino pode ficar mais lento.",
      energy: 3, sensitivity: 3, desire: 3,
      do: [
        "Facilite as noites: ambiente calmo e horário regular. O sono é um dos maiores aliados do humor nesta fase.",
        "Tenha em casa o que ela costuma querer comer, sem comentar. O apetite aumenta, e comentar tende a gerar culpa.",
        "Divida tarefas que exijam esforço físico. A disposição é menor, e ajudar sem ser pedido alivia.",
      ],
      avoid: [
        "Comentar inchaço ou peso. A autoimagem costuma estar mais sensível.",
        "Marcar eventos longos. Eles cansam e rendem pouco quando a energia social está menor.",
        "Insistir em manter o ritmo dos dias anteriores. O corpo está pedindo algo diferente.",
      ],
      talk: ["“Hoje parece um dia pra descansar. Fico com você ou prefere sossego?”", "“Quer que eu cuide do jantar?”"],
      tip: "O corpo está retendo líquido, e a sensação de inchaço pode afetar a autoimagem. Evitar comentários sobre aparência e oferecer ajuda prática é o que mais conta.",
    },
    {
      name: "Humor começando a oscilar",
      why: "Os níveis hormonais ainda estão altos, mas a sensibilidade a eles varia entre mulheres. Em quem é mais sensível, serotonina e GABA respondem de forma diferente a essas variações, o que explica por que o humor muda mais em umas do que em outras.",
      hormones: "Progesterona ↑ · Estrogênio ↑",
      mood: "O humor pode alternar entre leve e irritado, e pequenas coisas incomodam mais. Essas oscilações costumam ser breves e raramente têm a ver com algo que você fez.",
      body: "É comum sentir cansaço, apetite maior e sono mais leve.",
      energy: 3, sensitivity: 3, desire: 3,
      do: [
        "Seja flexível: um dia ela pode estar leve e no outro mais sensível. Ajustar sua postura ao dia evita que o humor dela vire conflito.",
        "Pergunte como ela está, sem pressionar nem insistir. Uma única pergunta aberta deixa o espaço sem obrigar.",
        "Tenha o que ela costuma querer em casa. Resolver o pequeno desconforto antes de virar irritação poupa a conversa.",
      ],
      avoid: [
        "Levar as oscilações para o lado pessoal. Responder defensivamente transforma uma irritação passageira em discussão.",
        "Tentar corrigir ou explicar o humor dela. Isso tende a invalidar o que ela sente.",
        "Fazer perguntas em série. Uma só, no tom certo, basta.",
      ],
      talk: ["“Percebi que o dia foi puxado. Quer me contar ou prefere deixar quieto?”", "“Se eu fizer algo que incomode, pode me falar na hora.”"],
      tip: "Oscilações de humor não são sobre você. Responder com calma e sem se defender evita que vire discussão, e quando o momento passa, ela costuma reconhecer o gesto.",
    },
    {
      name: "Sensibilidade crescendo",
      why: "Se o óvulo não foi fecundado, estrogênio e progesterona começam a cair. É a queda, mais do que o nível absoluto dos hormônios, que se associa aos sintomas pré-menstruais, e por isso o humor costuma piorar à medida que o fluxo se aproxima.",
      hormones: "Estrogênio ↓ · Progesterona ↓ (início da queda)",
      mood: "Ela pode estar mais sensível e com maior necessidade de previsibilidade. Assuntos que passariam despercebidos em outros dias podem pesar.",
      body: "Inchaço, sensibilidade nas mamas e vontade de doce são comuns.",
      energy: 3, sensitivity: 4, desire: 2,
      do: [
        "Ouça mais e proponha menos. Nesta etapa, ser ouvida costuma ajudar mais do que receber soluções.",
        "Ofereça ajuda concreta antes de ela pedir. Pedir ajuda tem um custo emocional que ela talvez não queira pagar.",
        "Facilite a noite: ambiente calmo e sem discussão antes de dormir. O sono é um dos primeiros afetados e piora o humor do dia seguinte.",
      ],
      avoid: [
        "Mudanças de última hora. A previsibilidade é um alívio nesta fase.",
        "Comentar o corpo ou o humor dela. Qualquer comentário tende a soar como crítica.",
        "Debater a relação. Esse tipo de conversa rende mais em outro momento.",
      ],
      talk: ["“Pode me falar se algo estiver pesando. Prometo só escutar.”", "“Quer que eu resolva isso por você?”"],
      tip: "Ouvir sem tentar resolver é, nesta fase, a ajuda mais eficaz. A maioria das pessoas quer ser entendida antes de ser aconselhada, e isso vale ainda mais quando a sensibilidade está alta.",
    },
    {
      name: "Pré-TPM",
      why: "A janela dos sintomas pré-menstruais costuma começar cerca de 5 a 7 dias antes da menstruação e terminar até 4 dias depois do início do fluxo, segundo o critério da ACOG. Nem toda mulher tem TPM, e a intensidade varia muito entre ciclos.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Irritabilidade, choro fácil, ansiedade ou cansaço são comuns em quem tem TPM. Ela pode se sentir mais cobrada ou menos compreendida, mesmo sem motivo claro.",
      body: "Dor de cabeça, inchaço e mamas doloridas costumam aparecer.",
      energy: 3, sensitivity: 4, desire: 2,
      do: [
        "Reduza a carga dela: menos tarefas e menos decisões. A tolerância ao estresse está menor, e qualquer redução ajuda.",
        "Seja direto e gentil, sem ironia nem sarcasmo. O tom é percebido com mais intensidade agora.",
        "Mantenha a rotina e cumpra o que combinou. A confiança no que é previsível tem efeito calmante.",
      ],
      avoid: [
        "Críticas e cobranças. Elas tendem a ser recebidas de forma mais dura do que foram ditas.",
        "Discussões sobre a relação. Adiar não é fugir: é escolher o momento em que a conversa rende.",
        "Programas que exigem muita energia. O corpo está pedindo descanso, e forçar costuma terminar em conflito.",
      ],
      talk: ["“Hoje eu cuido do que for preciso. Se quiser mais alguma coisa, é só me dizer.”", "“Posso deixar esse assunto pra depois que você estiver melhor?”"],
      tip: "Adie discussões importantes para depois da menstruação. Não é fugir do assunto: é escolher o momento em que a conversa rende, com menos carga emocional e mais chance de acordo.",
    },
    {
      name: "TPM · Maior sensibilidade",
      why: "A queda hormonal afeta neurotransmissores como serotonina e GABA, e o efeito é mais forte em quem tem maior sensibilidade a essas variações. É uma resposta do cérebro à mudança hormonal, e não uma reação ao que acontece ao redor.",
      hormones: "Estrogênio ↓ · Progesterona ↓",
      mood: "Ela pode estar mais irritável, ansiosa ou triste, e pequenas coisas pesam mais. Isso costuma passar quando o fluxo começa ou logo depois.",
      body: "Cansaço, inchaço, dores de cabeça e sensibilidade nas mamas são comuns.",
      energy: 2, sensitivity: 5, desire: 2,
      do: [
        "Mantenha o tom calmo, mesmo se ela estiver irritada. A calma é contagiosa, e a sua pode reduzir a intensidade da dela.",
        "Ouça por inteiro antes de responder. Ser interrompida aumenta a frustração.",
        "Assuma tarefas sem esperar que ela peça. O custo de pedir fica alto quando a energia emocional está baixa.",
      ],
      avoid: [
        "Reagir à irritação com irritação. É o caminho mais curto para uma discussão que ninguém quer.",
        "Dizer “é a TPM falando”. Isso invalida o que ela sente e costuma piorar a situação.",
        "Levar para o pessoal o que é do momento. Quase tudo o que é dito nesta fase perde o peso em poucos dias.",
      ],
      talk: ["“Entendo que está difícil. Estou do seu lado.”", "“Quer conversar agora ou prefere depois?”"],
      tip: "Evite explicar o humor pelo ciclo na frente dela. Reconheça a emoção e deixe a explicação para depois, quando ela estiver bem: nesse momento, o que mais ajuda é sentir que foi levada a sério.",
      flag: FLAG_TDPM,
    },
    {
      name: "Véspera da menstruação",
      why: "Os hormônios estão no ponto mais baixo antes do fluxo, e é comum que ela se sinta no limite. É a fase em que a queda hormonal é mais abrupta, e a expectativa é de alívio quando a menstruação começar.",
      hormones: "Estrogênio ↓↓ · Progesterona ↓↓",
      mood: "Ela pode estar mais frágil, cansada ou irritada. É uma etapa curta, e costuma haver alívio nos primeiros dias do fluxo.",
      body: "Dor de cabeça, inchaço, cólica leve e cansaço são frequentes.",
      energy: 2, sensitivity: 5, desire: 2,
      do: [
        "Deixe a noite tranquila e previsível. A estabilidade ajuda o sono, e o sono ajuda o humor.",
        "Tenha à mão o que ela costuma pedir na menstruação. Antecipar mostra atenção.",
        "Mostre disponibilidade sem impor nada. Ela sabe que você está por perto, e isso basta.",
      ],
      avoid: [
        "Qualquer discussão séria. A carga emocional está no máximo.",
        "Comentários sobre humor ou comida. Eles tendem a soar como crítica.",
        "Cobrar compromissos. Libere o que for possível.",
      ],
      talk: ["“Amanhã a menstruação deve chegar. Deixei tudo organizado pra você descansar.”", "“Estou aqui. Fala quando quiser.”"],
      tip: "Em poucos dias a fase mais difícil passa: o fluxo costuma trazer alívio dos sintomas pré-menstruais. Atravessar essa reta final com calma e previsibilidade é o que mais vale agora.",
      flag: FLAG_TDPM,
    },
  ],
};

export function stageIndex(phase: PhaseKey, phaseDay: number, phaseLength: number): number {
  const n = STAGES[phase].length;
  const raw = phaseLength > 0 ? Math.floor(((phaseDay - 1) / phaseLength) * n) : 0;
  return Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), n - 1);
}

/** Visão dele (padrão): orientações sobre ela. */
export function stageFor(phase: PhaseKey, phaseDay: number, phaseLength: number): Stage {
  return STAGES[phase][stageIndex(phase, phaseDay, phaseLength)];
}

/** Visão de quem menstrua: mesma fisiologia, em 1ª pessoa (o que sente, o que ajuda, o que pedir). */
export function stageForViewer(phase: PhaseKey, phaseDay: number, phaseLength: number, viewer: "her" | "him"): Stage {
  const i = stageIndex(phase, phaseDay, phaseLength);
  const base = STAGES[phase][i];
  if (viewer === "him") return base;
  const self = SELF_STAGES[phase][i];
  return { ...base, ...self, flag: self.flag };
}

export function pick<T>(arr: T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}
