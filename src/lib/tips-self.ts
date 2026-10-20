import type { PhaseKey } from "./cycle";

/**
 * Versão em 1ª pessoa (para quem menstrua), na mesma ordem e quantidade de STAGES.
 * Mesma base fisiológica de tips.ts; muda o ponto de vista: o que você sente, o que ajuda,
 * o que evitar e o que pedir a quem convive com você.
 */
export type SelfStage = {
  mood: string;
  body: string;
  do: string[];
  avoid: string[];
  /** Frases para dizer ao parceiro (pedir o que precisa). */
  talk: string[];
  tip: string;
  flag?: string;
};

const FLAG_PAIN =
  "Dor que impede a sua rotina, fluxo que encharca um absorvente em menos de 2 horas ou coágulos grandes merecem avaliação ginecológica, pois podem indicar endometriose ou outras condições que têm tratamento. Dor intensa não é algo que você precisa aguentar em silêncio.";
const FLAG_TDPM =
  "Se a TPM vier com tristeza profunda, ansiedade intensa ou desesperança a cada ciclo, pode ser TDPM (transtorno disfórico pré-menstrual), que tem tratamento. Vale conversar com um ginecologista ou psiquiatra. Em crise ou diante de pensamentos de se machucar, o CVV atende 24 horas pelo 188.";

export const SELF_STAGES: Record<PhaseKey, SelfStage[]> = {
  menstrual: [
    {
      mood: "É esperado sentir mais cansaço, mais vontade de ficar quieta e menos paciência com barulho e cobranças. Não é falta de força de vontade: seu corpo está gastando energia com a dor e com a perda de sangue.",
      body: "A cólica e a dor lombar costumam ser mais fortes no primeiro e no segundo dia, com fluxo intenso. O cansaço vem da dor, do sono pior e, às vezes, de uma queda nas reservas de ferro.",
      do: [
        "Reduza a agenda do dia sem culpa. Adiar o que não é urgente poupa a energia de que você precisa para se recuperar, e quase nada que pode esperar vira problema.",
        "Use calor local no abdômen e na lombar e, se você costuma tomar analgésico, tome no início da dor: ele funciona melhor antes de a cólica ficar forte.",
        "Peça ajuda concreta e específica a quem convive com você (o jantar, o mercado, uma tarefa). Pedidos específicos são atendidos com muito mais facilidade do que “me ajuda”.",
      ],
      avoid: [
        "Se cobrar o mesmo rendimento de sempre. Exigir de você o que o seu corpo não está entregando só soma culpa ao cansaço.",
        "Tomar decisões importantes por impulso. Com menos energia e mais sensibilidade, tudo parece mais pesado do que é.",
        "Aguentar dor forte em silêncio. Dor que atrapalha a rotina merece atenção, e você não precisa provar que aguenta.",
      ],
      talk: ["“Hoje estou com muita cólica e pouca energia. Pode assumir o jantar e a casa? Obrigada.”", "“Não é nada com você, só preciso de um dia mais quieto. Fica por perto, sem me cobrar nada?”"],
      tip: "Dizer com clareza o que você precisa poupa os dois de adivinhação. Quem convive com você quer ajudar, mas nem sempre sabe como: um pedido concreto no começo do dia costuma resolver mais do que esperar que percebam.",
      flag: FLAG_PAIN,
    },
    {
      mood: "Você pode continuar mais recolhida, embora muita gente já sinta algum alívio em relação ao primeiro dia. A vontade de conversar costuma ser menor, e isso é só um reflexo do cansaço.",
      body: "O fluxo costuma estar no pico, com cólica ainda presente e sensação de inchaço e de peso no corpo. A disposição para esforço físico e social é menor.",
      do: [
        "Priorize sono e descanso. Dormir bem reduz a percepção de dor e ajuda o humor dos dias seguintes.",
        "Se tiver vontade, faça movimento leve, como alongamento ou uma caminhada curta. A atividade leve libera endorfina e pode aliviar a cólica, mas só se você estiver com vontade.",
        "Mantenha refeições regulares e boa hidratação. Isso ajuda contra tontura e fadiga, principalmente se o fluxo está intenso.",
      ],
      avoid: [
        "Forçar programas sociais por obrigação. Recusar um convite hoje não custa nada, e aceitar sem vontade custa energia.",
        "Comparar o seu ritmo com o de outras pessoas, ou com o seu ritmo de outras semanas. O corpo está em outra fase.",
        "Ignorar sinais de que o fluxo está fora do comum para você, como encharcar o absorvente em menos de 2 horas.",
      ],
      talk: ["“Hoje prefiro ficar em casa. Se você quiser, a gente pede algo e vê um filme.”", "“Obrigada por entender. Só estar junto sem muita conversa já ajuda.”"],
      tip: "Companhia sem exigência é um tipo de cuidado. Se for possível, escolha alguém com quem você possa simplesmente existir ao lado, sem precisar conversar nem explicar nada.",
      flag: FLAG_PAIN,
    },
    {
      mood: "Seu humor tende a melhorar aos poucos e a vontade de conversar volta. A energia ainda não está plena, e é normal alternar bons momentos com cansaço.",
      body: "A dor diminui e o fluxo fica mais leve. O corpo ainda está se recuperando, e a disposição varia entre a manhã e a noite.",
      do: [
        "Aproveite os momentos de melhora para algo leve que te faça bem, como um café, uma caminhada curta ou uma conversa. Sem meta, só pelo prazer.",
        "Retome aos poucos o que ficou parado. Em vez de tudo de uma vez, escolha uma coisa pequena por dia.",
        "Observe como o seu corpo responde ao esforço. Ele costuma avisar quando precisa de pausa.",
      ],
      avoid: [
        "Compensar os dias de recolhimento com um dia superlotado. A recuperação é gradual.",
        "Se cobrar por não estar 100%. O corpo ainda está em recuperação.",
        "Cortar o descanso só porque já se sente melhor. O sono ainda ajuda.",
      ],
      talk: ["“Estou melhorando. Hoje topo algo leve, mas sem muito compromisso.”", "“Obrigada pela paciência esses dias. Foi importante pra mim.”"],
      tip: "A melhora é gradual. Ter planos curtos e flexíveis protege você de se sobrecarregar justamente quando a energia está voltando, e deixa espaço para ajustar o dia conforme você se sente.",
    },
    {
      mood: "O estrogênio sobe e, com ele, costuma vir uma sensação de leveza e de disposição. Muita gente descreve essa etapa como a de começar a se sentir de novo.",
      body: "Para a maioria, a dor já é pouca ou inexistente e o fluxo é leve. O corpo está mais leve, com menos inchaço.",
      do: [
        "Planeje alguma coisa para os próximos dias. Ter algo a esperar ajuda a consolidar a melhora do humor.",
        "Retome as conversas que você adiou durante a menstruação. Com mais energia e menos tensão, elas tendem a render melhor.",
        "Observe o seu desejo sem pressão: ele pode voltar já ou nos próximos dias, e os dois são normais.",
      ],
      avoid: [
        "Se forçar a voltar ao ritmo máximo logo de cara. A energia ainda está subindo.",
        "Aceitar pressão (sua ou de outros) por intimidade antes de sentir vontade.",
        "Deixar assuntos importantes para depois, justamente quando você está mais receptiva a eles.",
      ],
      talk: ["“Estou me sentindo melhor. Que tal a gente combinar algo pro fim de semana?”", "“Quero retomar aquela conversa que ficou pendente, agora que estou mais tranquila.”"],
      tip: "É uma boa hora para reabrir a agenda e as conversas pendentes. Sua disposição para ouvir e argumentar costuma estar maior do que há dois dias, e vale aproveitar.",
    },
    {
      mood: "A disposição está em alta e você tende a estar mais receptiva a planos. Muitas mulheres descrevem esse momento como a volta a si mesma.",
      body: "O fluxo é mínimo ou há só manchas. O corpo está mais leve e a sensação de inchaço diminui.",
      do: [
        "Combine algo para o fim de semana. Fechar a agenda agora aproveita a melhora do humor e evita que os dias bons passem em branco.",
        "Escolha uma atividade de que você gosta, e não só uma tarefa. É um bom momento para recuperar o que te dá prazer.",
        "Cuide do conforto: um banho demorado, roupas de que você gosta, o ambiente arrumado. Pequenos rituais ajudam a marcar a virada.",
      ],
      avoid: [
        "Ficar só em casa se você tem vontade de sair. A energia está voltando e rende melhor em movimento.",
        "Se cobrar compensação pelos dias em que esteve mais retraída.",
        "Adiar o que está na lista por achar que ainda não está 100%. A partir de agora você tende a estar.",
      ],
      talk: ["“Estou bem melhor! Vamos aproveitar o fim de semana pra fazer algo diferente?”", "“Que tal a gente sair? Estou com vontade.”"],
      tip: "A energia sobe a partir de agora. Os próximos dias costumam ser bons, e planejar com antecedência garante que você aproveite o melhor deles.",
    },
  ],

  folicular: [
    {
      mood: "Seu humor tende a ficar mais leve e a curiosidade cresce. É comum sentir mais vontade de fazer coisas novas e menos peso do cansaço dos dias anteriores.",
      body: "Pele, cabelo e disposição costumam melhorar, e a recuperação depois de esforço físico fica mais rápida.",
      do: [
        "Aproveite para começar algo novo ou retomar um projeto. Com o estrogênio subindo, o cérebro responde melhor a estímulos novos.",
        "Experimente um treino ou uma atividade diferente. A recuperação costuma ser mais rápida agora.",
        "Anote as ideias e os planos que surgirem. Você tende a estar mais criativa, e vale registrar antes que passe.",
      ],
      avoid: [
        "Passar os dias na rotina por inércia. Esta fase pede um pouco de novidade.",
        "Duvidar da própria energia. Se você está bem, aproveite sem culpa.",
        "Adiar decisões para as quais você já está pronta.",
      ],
      talk: ["“Estou com vontade de fazer algo diferente. Topa me acompanhar?”", "“Tive uma ideia e queria te contar. Posso?”"],
      tip: "Sua energia e sua curiosidade estão subindo. Usar esse momento para o que você adia nas outras semanas, como uma tarefa chata ou uma conversa difícil, costuma ser mais fácil do que parece.",
    },
    {
      mood: "Você tende a se sentir mais motivada, criativa e comunicativa, e com mais paciência para detalhes. O efeito varia entre mulheres, mas muitas relatam esse pico de disposição.",
      body: "A disposição física é boa e a recuperação após esforço é rápida. Muitas mulheres percebem melhor desempenho em exercícios nesta fase.",
      do: [
        "Agende o que exige foco e energia: reuniões importantes, estudos, treinos mais intensos. Você tende a render mais.",
        "Converse sobre decisões e planos importantes. A receptividade a argumentos costuma ser maior agora.",
        "Marque encontros com amigos. A sociabilidade tende a estar em alta e você aproveita mais.",
      ],
      avoid: [
        "Adiar conversas que você está em boas condições de ter.",
        "Se comprometer com demais achando que sempre vai estar assim: a energia varia ao longo do ciclo.",
        "Ignorar sinais de cansaço só porque está bem. Descanso ainda conta.",
      ],
      talk: ["“Estou disposta! Vamos fazer algo ativo no fim de semana?”", "“Queria conversar sobre os nossos planos. Agora estou com a cabeça boa pra isso.”"],
      tip: "Esta é uma boa janela para decisões e conversas importantes. Mas lembre que a energia vai mudar na fase seguinte, então não prometa mais do que você conseguiria entregar numa semana mais difícil.",
    },
    {
      mood: "Você tende a se sentir mais confiante e sociável, com mais facilidade para se expressar. Percepções negativas sobre si mesma costumam ficar mais leves.",
      body: "Há uma sensação geral de bem-estar e de energia estável, sem os picos e vales de outros momentos do ciclo.",
      do: [
        "Use a confiança para o que costuma te intimidar, como pedir um aumento, propor uma ideia ou dizer o que pensa.",
        "Programe encontros sociais e eventos. A vontade de estar com outras pessoas costuma estar alta.",
        "Registre as suas conquistas recentes. Em dias mais difíceis, vai ajudar lembrar do que você fez bem.",
      ],
      avoid: [
        "Assumir compromissos demais só porque está animada.",
        "Tomar decisões financeiras ou grandes sem reler no dia seguinte.",
        "Subestimar o que você faz bem. Você não precisa esperar a confiança chegar para reconhecer o seu valor.",
      ],
      talk: ["“Quero ver gente nesse fim de semana. Vamos chamar alguém?”", "“Hoje me sinto muito bem. Quero aproveitar com você.”"],
      tip: "Aproveite a confiança em alta para o que exige exposição. Ela é real, mas varia com o ciclo, então use agora o que seria mais difícil em outras semanas.",
    },
    {
      mood: "Estrogênio e testosterona sobem nos dias que antecedem a ovulação, e muitas mulheres percebem mais desejo e mais vontade de proximidade. O desejo não é igual para todas, e não há um padrão que você precise seguir.",
      body: "A energia está alta. O muco cervical fica mais claro e elástico, um sinal natural de fertilidade. A janela fértil já está aberta.",
      do: [
        "Defina agora a contracepção que vocês vão usar. A janela fértil começa cerca de 5 dias antes da ovulação, e a conversa é mais fácil antes do momento.",
        "Observe os seus sinais de fertilidade: o muco mais elástico e transparente costuma indicar que a ovulação se aproxima.",
        "Cuide do desejo no seu tempo. Ele responde a contexto e atenção, e não só ao calendário.",
      ],
      avoid: [
        "Contar só com a estimativa do calendário para evitar gravidez. A ovulação varia de ciclo para ciclo.",
        "Aceitar intimidade sem vontade só porque é um dia de pico.",
        "Deixar a contracepção para a última hora.",
      ],
      talk: ["“Estamos entrando na minha janela fértil. Vamos combinar a proteção?”", "“Queria um tempo só nosso essa semana. Pode ser?”"],
      tip: "Se vocês não planejam gravidez, a conversa sobre contracepção é agora. A responsabilidade é dos dois, e quem convive com você costuma agradecer a clareza.",
    },
    {
      mood: "A confiança está alta e você tende a se mostrar mais expansiva e afetuosa. É comum sentir mais vontade de estar com seu parceiro.",
      body: "A energia é alta e o muco cervical está fértil. A probabilidade de gravidez já é relevante, porque os espermatozoides que entrarem agora ainda estarão vivos quando o óvulo for liberado.",
      do: [
        "Confirme com seu parceiro o método contraceptivo antes de qualquer imprevisto.",
        "Reserve um tempo só de vocês dois, sem distrações. Sua disposição está alta, e vale aproveitá-la.",
        "Acompanhe os seus sinais físicos: temperatura e muco ajudam a confirmar a ovulação.",
      ],
      avoid: [
        "Supor que “já está tudo certo”. Confirmar evita imprevistos.",
        "Aceitar que a contracepção seja só responsabilidade sua.",
        "Planejar o dia sem tempo para o que te interessa.",
      ],
      talk: ["“Reservei a noite de sexta pra gente. Pode ficar com a proteção por sua conta?”", "“Quero ter certeza de que estamos alinhados sobre contracepção essa semana.”"],
      tip: "A contracepção é uma responsabilidade dos dois. Pedir que ele assuma a parte prática, como ter camisinha à mão, divide o peso.",
    },
    {
      mood: "Você tende a estar muito disposta, comunicativa e afetuosa. A sensação de bem-estar costuma ser a maior do ciclo.",
      body: "A energia está no máximo. Algumas mulheres sentem uma leve dor pélvica de um lado, sinal de que o folículo está pronto para romper.",
      do: [
        "Aproveite a disposição para algo de que você gosta muito, a dois ou sozinha.",
        "Tenha a contracepção definida. A chance de gravidez está entre as mais altas do ciclo.",
        "Observe a dor pélvica leve, se houver: ela costuma ser normal e passa em horas.",
      ],
      avoid: [
        "Marcar compromissos que ocupem todo o seu tempo livre.",
        "Subestimar a fertilidade. Estimativas de calendário têm margem de erro.",
        "Deixar a decisão sobre proteção para a última hora.",
      ],
      talk: ["“Hoje estou super disposta. Vamos fazer algo especial?”", "“Podemos conferir se está tudo certo sobre a proteção?”"],
      tip: "A chance de gravidez nos 2 dias antes da ovulação e no dia dela é a maior do ciclo. Se vocês não planejam gravidez, não contem só com o calendário e usem proteção.",
    },
  ],

  ovulatoria: [
    {
      mood: "Você tende a estar comunicativa, afetuosa e confiante. O interesse por proximidade costuma ser alto, e a boa disposição ajuda a sustentar uma agenda cheia.",
      body: "O muco cervical está fértil, a libido tende a ser mais alta e, em algumas mulheres, aparece uma leve dor pélvica.",
      do: [
        "Planeje tempo de qualidade com quem importa para você. A disposição social e afetiva está alta.",
        "Alinhe a contracepção: é o período de maior risco de gravidez, e conversar antes é mais simples.",
        "Aproveite a boa comunicação para conversas que exigem clareza.",
      ],
      avoid: [
        "Passar a janela fértil sem combinar proteção.",
        "Aceitar o que você não deseja só porque é “o dia fértil”.",
        "Supor que o app acerta o dia exato: a ovulação varia.",
      ],
      talk: ["“Quero uma noite só nossa. Pode ser?”", "“Está tudo combinado sobre a proteção?”"],
      tip: "É o início do período de maior fertilidade. Se vocês não planejam gravidez, usem proteção em todas as relações. O app estima a janela, mas a ovulação pode antecipar ou atrasar de um ciclo para outro.",
    },
    {
      mood: "Você costuma estar no auge de energia, sociabilidade e desejo. A comunicação flui com mais facilidade e a vontade de se conectar é alta.",
      body: "Parte das mulheres sente uma dor leve de um lado do abdômen, chamada mittelschmerz, que costuma durar de horas a um dia.",
      do: [
        "Se quiser confirmar a ovulação, o teste de LH vendido em farmácia detecta esse pico com cerca de um dia de antecedência.",
        "Dê ouvidos ao seu corpo e ao que você deseja. O consentimento e o ritmo são seus.",
        "Beba água e descanse se sentir a dor pélvica leve.",
      ],
      avoid: [
        "Ignorar uma dor forte que não passa: nesse caso, procure atendimento.",
        "Deixar a proteção só por conta do outro.",
        "Tratar o dia como qualquer outro, se você tem vontade de aproveitá-lo.",
      ],
      talk: ["“Hoje estou muito bem. Vamos aproveitar sem pressa?”", "“Se algo incomodar, eu te aviso. Combinado?”"],
      tip: "Se quiserem precisão em vez de estimativa, o teste de ovulação (LH) vendido em farmácia detecta esse pico. Ele indica a ovulação com antecedência de cerca de um dia.",
    },
    {
      mood: "Você costuma continuar afetuosa. Algumas mulheres sentem uma leve queda de energia no fim do dia, quando o estrogênio começa a baixar.",
      body: "Pode haver dor leve ou pequenas manchas. A temperatura basal sobe de 0,2 a 0,5 °C nos dias seguintes.",
      do: [
        "Mantenha a proteção, pois ainda é período fértil. A janela termina depois da ovulação, e não antes.",
        "Anote os sinais que você percebeu (dor, muco, temperatura). Eles ajudam a conhecer o seu padrão.",
        "Faça deste um momento de conexão sem pressa, se for o seu desejo.",
      ],
      avoid: [
        "Supor que a fertilidade acabou. Ela só cai no dia seguinte.",
        "Ignorar dor intensa: dor leve é comum, dor forte merece avaliação.",
        "Cobrar de si mesma o mesmo pique do dia anterior.",
      ],
      talk: ["“Hoje quero tempo com você, com calma.”", "“Ainda vamos manter a proteção, tá?”"],
      tip: "Estimativas por calendário têm margem de erro de alguns dias. Para contracepção, não dependa só do app, que mostra o que é provável e não o que está acontecendo no seu corpo.",
    },
    {
      mood: "Você tende a estar afetuosa e mais tranquila, com a energia começando a descer. A sensação é de calma depois do pico.",
      body: "A temperatura corporal sobe levemente e algumas mulheres percebem um inchaço leve.",
      do: [
        "Aproveite a boa disposição que ainda resta para algo importante.",
        "Comece a reduzir o ritmo de programas intensos: o corpo entra em outra fase.",
        "Cuide do sono e da alimentação, que começam a pedir mais atenção.",
      ],
      avoid: [
        "Se cobrar a mesma energia dos dias anteriores.",
        "Assumir compromissos demais para a semana que vem.",
        "Estranhar a mudança de humor que pode vir a seguir: ela é hormonal.",
      ],
      talk: ["“Foram dias muito bons. Agora quero ir mais devagar.”", "“Esse fim de semana prefiro algo tranquilo.”"],
      tip: "A virada hormonal costuma ser suave. Perceber que a energia vai descer ajuda você a planejar a semana com mais leveza e menos cobrança.",
    },
  ],

  lutea: [
    {
      mood: "Ainda sobra energia do pico, mas seu humor já pode começar a oscilar. As mudanças costumam ser sutis nesta etapa, e é fácil não perceber.",
      body: "A temperatura corporal sobe e o apetite pode aumentar. Algumas mulheres sentem mais sono.",
      do: [
        "Use a boa disposição que ainda resta para o que exige mais energia.",
        "Observe como o seu corpo reage nas próximas semanas. Anotar no check-in ajuda a perceber padrões.",
        "Mantenha a rotina previsível, sobretudo o sono e a alimentação.",
      ],
      avoid: [
        "Assumir que o ritmo do pico vai continuar.",
        "Encher a agenda de compromissos.",
        "Se criticar pelo apetite maior: ele faz parte da fase.",
      ],
      talk: ["“Estou entrando numa fase mais calma. Vou precisar de um pouco mais de sossego nos próximos dias.”", "“Pode me ajudar a manter a semana mais leve?”"],
      tip: "Esta é a transição. Ainda há energia, mas é o momento de começar a reduzir imprevistos. Dias previsíveis agora preparam o terreno para uma fase lútea mais tranquila.",
    },
    {
      mood: "Você tende a ficar mais voltada para dentro, com foco, vontade de organizar e menos paciência para bagunça. Pode parecer mais séria sem estar chateada.",
      body: "O sono pode aumentar e o apetite também. A temperatura corporal fica um pouco mais alta.",
      do: [
        "Aproveite o foco para tarefas que pedem concentração e organização.",
        "Priorize programas tranquilos, que te recarregam.",
        "Avise quem convive com você de que o seu “modo sério” não é chateação.",
      ],
      avoid: [
        "Assumir que algo está errado só porque você está mais quieta.",
        "Aceitar programas sociais longos por obrigação.",
        "Forçar um ritmo social que o corpo não pede.",
      ],
      talk: ["“Estou mais focada e reservada. Não é nada com você.”", "“Quero ficar em casa esse fim de semana.”"],
      tip: "A ordem e a previsibilidade ajudam agora. Cumprir combinados e evitar surpresas de última hora vale mais do que gestos grandes: a sua calma depende de poder contar com o que foi combinado.",
    },
    {
      mood: "Você pode sentir calma ou sonolência, e algumas mulheres começam a notar oscilações. O humor costuma estar estável, mas com menos disposição social.",
      body: "É comum haver inchaço leve, retenção de líquidos e sono mais pesado. O intestino pode ficar mais lento.",
      do: [
        "Facilite as noites: ambiente calmo e horário regular de sono.",
        "Beba bastante água e inclua fibras na alimentação, que ajudam contra o inchaço e o intestino mais lento.",
        "Divida as tarefas que exijam esforço físico.",
      ],
      avoid: [
        "Exigir de si mesma a mesma disposição de outras semanas.",
        "Se pesar ou se comparar: a retenção de líquidos é temporária.",
        "Marcar eventos longos.",
      ],
      talk: ["“Hoje estou com o corpo pesado. Pode ficar com as tarefas mais puxadas?”", "“Preciso de uma noite tranquila hoje.”"],
      tip: "O corpo está retendo líquido, e a sensação de inchaço pode afetar a autoimagem. Lembrar que é temporário e passa em poucos dias ajuda a não se julgar com dureza.",
    },
    {
      mood: "Seu humor pode alternar entre leve e irritado, e pequenas coisas incomodam mais. Essas oscilações costumam ser breves e raramente têm a ver com algo que alguém fez.",
      body: "É comum sentir cansaço, apetite maior e sono mais leve.",
      do: [
        "Quando perceber a irritação subir, dê um nome a ela (“estou irritada por causa do ciclo”) e respire antes de reagir. Nomear reduz a intensidade.",
        "Avise quem convive com você de que o humor está oscilando, para que não leve para o lado pessoal.",
        "Priorize o sono e uma alimentação regular, que ajudam a estabilizar o humor.",
      ],
      avoid: [
        "Resolver brigas ou decisões importantes no pico da irritação.",
        "Se culpar pelas oscilações: elas têm base hormonal.",
        "Responder a mensagens ou conflitos no calor do momento.",
      ],
      talk: ["“Estou mais sensível esses dias. Se eu estiver ríspida, não é com você.”", "“Preciso de paciência nos próximos dias. Posso contar com você?”"],
      tip: "Avisar antes é mais eficaz do que explicar depois. Se o outro sabe que você está numa fase mais sensível, ele tende a reagir com menos defesa, e a discussão nem começa.",
    },
    {
      mood: "Você pode estar mais sensível e com maior necessidade de previsibilidade. Assuntos que passariam despercebidos em outros dias podem pesar.",
      body: "Inchaço, sensibilidade nas mamas e vontade de doce são comuns.",
      do: [
        "Diga em voz alta o que você precisa: silêncio, um abraço, uma conversa, espaço. Quem convive com você acerta mais quando sabe.",
        "Reduza estímulos e compromissos que não são essenciais.",
        "Coma com regularidade. A queda de açúcar no sangue piora a irritabilidade.",
      ],
      avoid: [
        "Guardar tudo para você até explodir.",
        "Debater a relação ou tomar decisões grandes agora: adie para depois da menstruação.",
        "Passar muito tempo em redes sociais: elas amplificam a comparação.",
      ],
      talk: ["“Estou mais sensível. Preciso que você me escute sem tentar resolver.”", "“Hoje quero previsibilidade: podemos manter o combinado?”"],
      tip: "Dizer o que você precisa (ser ouvida, ficar em silêncio, receber um abraço) evita que quem convive com você tente adivinhar e erre. Pedir não é fraqueza: é o que dá a ele a chance de acertar.",
    },
    {
      mood: "Irritabilidade, choro fácil, ansiedade ou cansaço são comuns em quem tem TPM. Você pode se sentir mais cobrada ou menos compreendida, mesmo sem motivo claro.",
      body: "Dor de cabeça, inchaço e mamas doloridas costumam aparecer.",
      do: [
        "Reduza a carga: delegue, adie o que puder e simplifique a rotina.",
        "Observe os seus sintomas e anote no check-in. Com o tempo, você enxerga o seu padrão e consegue antecipar.",
        "Faça atividade física leve se tiver vontade: ela costuma aliviar os sintomas de humor.",
      ],
      avoid: [
        "Iniciar discussões importantes agora.",
        "Tomar decisões irreversíveis nesta semana.",
        "Ignorar sintomas intensos achando que “é só TPM”.",
      ],
      talk: ["“Estou entrando na minha semana mais sensível. Preciso que a gente adie assuntos pesados.”", "“Pode me ajudar a manter tudo mais tranquilo?”"],
      tip: "Adie discussões importantes para depois da menstruação. Não é fugir do assunto: é escolher o momento em que a conversa rende, com menos carga emocional e mais chance de acordo.",
    },
    {
      mood: "Você pode estar mais irritável, ansiosa ou triste, e pequenas coisas pesam mais. Isso costuma passar quando o fluxo começa ou logo depois.",
      body: "Cansaço, inchaço, dores de cabeça e sensibilidade nas mamas são comuns.",
      do: [
        "Lembre a si mesma de que isso é transitório e hormonal. Em poucos dias a intensidade cai.",
        "Cuide do básico: sono, comida regular, hidratação e pausas ao longo do dia.",
        "Se estiver muito difícil, peça apoio a alguém de confiança.",
      ],
      avoid: [
        "Tomar como verdade absoluta os pensamentos muito negativos que aparecem nesta fase.",
        "Se isolar por completo se você sente que precisa de apoio.",
        "Descontar nos outros e depois se culpar: avise antes que está difícil.",
      ],
      talk: ["“Hoje está difícil. Só preciso que você fique do meu lado.”", "“Se eu estiver difícil, pode me dar um tempo e voltar depois?”"],
      tip: "Se a intensidade dos sintomas atrapalha a sua vida a cada ciclo, vale conversar com um ginecologista. Existem tratamentos eficazes, e você não precisa suportar isso em silêncio.",
      flag: FLAG_TDPM,
    },
    {
      mood: "Você pode estar mais frágil, cansada ou irritada. É uma etapa curta, e costuma haver alívio nos primeiros dias do fluxo.",
      body: "Dor de cabeça, inchaço, cólica leve e cansaço são frequentes.",
      do: [
        "Deixe a noite tranquila e previsível, com sono cedo se possível.",
        "Tenha à mão o que costuma ajudar na menstruação: absorventes, analgésico, bolsa térmica.",
        "Diga ao seu parceiro de que forma ele pode ajudar amanhã.",
      ],
      avoid: [
        "Qualquer discussão séria. A carga emocional está no máximo.",
        "Compromissos longos amanhã, se for possível evitar.",
        "Se culpar pelo humor: ele tem causa física.",
      ],
      talk: ["“Amanhã a menstruação deve chegar. Pode deixar o dia mais leve pra mim?”", "“Estou aqui, mas preciso de calma hoje.”"],
      tip: "Em poucos dias a fase mais difícil passa: o fluxo costuma trazer alívio dos sintomas pré-menstruais. Atravessar essa reta final com calma e previsibilidade é o que mais vale agora.",
      flag: FLAG_TDPM,
    },
  ],
};
