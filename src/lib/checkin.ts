/** Opções do check-in diário (só quem menstrua preenche) e orientações por marcação. */

export const MOODS = ["Calma", "Feliz", "Animada", "Cansada", "Ansiosa", "Irritada", "Triste", "Sensível"] as const;
export const SYMPTOMS = ["Cólica", "Dor de cabeça", "Inchaço", "Mamas sensíveis", "Dor lombar", "Sono ruim", "Vontade de doce", "Náusea", "Acne"] as const;
export const FLOWS = ["Manchas", "Leve", "Médio", "Intenso"] as const;
export const LIBIDO = ["Baixo", "Normal", "Alto"] as const; // 1..3

type Tip = { him: string; her: string };

/** O que fazer diante de cada marcação: lado dele (como ajudar) e lado dela (autocuidado). */
export const TAG_TIPS: Record<string, Tip> = {
  "Cólica": { him: "Calor local e analgésico no início da dor ajudam. Ofereça sem insistir e assuma o que puder do dia.", her: "Calor local e analgésico no início da dor costumam aliviar. Se a dor te impede de fazer o dia, vale uma avaliação médica." },
  "Dor de cabeça": { him: "Pouca luz, silêncio, água e algo para comer ajudam. Evite barulho e conversas longas.", her: "Hidratação, uma refeição leve e um ambiente calmo costumam ajudar. Se vier com frequência em todo ciclo, comente com o seu médico." },
  "Inchaço": { him: "Evite qualquer comentário sobre aparência ou peso. Ofereça conforto e algo leve para comer.", her: "O inchaço é temporário e tende a passar com o fluxo. Roupas confortáveis, água e menos sal ajudam." },
  "Mamas sensíveis": { him: "Contato mais delicado e mais cuidado com o toque.", her: "Sutiã confortável e compressa morna podem aliviar. Avise quem convive com você para ajustar o contato." },
  "Dor lombar": { him: "Calor na região ou uma massagem leve ajudam, se ela quiser.", her: "Calor local e alongamento leve costumam aliviar." },
  "Sono ruim": { him: "Deixe a noite calma e sem discussões, e evite acordá-la.", her: "Rotina regular, quarto fresco e menos telas à noite ajudam. A progesterona aquece o corpo e deixa o sono mais leve." },
  "Vontade de doce": { him: "Tenha em casa o que ela gosta, sem comentar.", her: "O apetite maior nesta fase é esperado e faz parte do ciclo. Sem culpa: refeições regulares ajudam a equilibrar." },
  "Náusea": { him: "Ofereça algo leve, água e silêncio. Evite cheiros fortes.", her: "Pequenas refeições, gengibre e ar fresco costumam ajudar." },
  "Acne": { him: "Evite comentários sobre a pele.", her: "A oscilação hormonal aumenta a oleosidade. Uma rotina de limpeza suave ajuda, e passa." },
  "Cansada": { him: "Reduza a carga dela hoje e facilite o que puder.", her: "Escolha uma prioridade e adie o resto. Descansar também é produtivo." },
  "Ansiosa": { him: "Seja objetivo, previsível e calmo. Evite urgências e cobranças.", her: "Respire fundo, reduza estímulos e fale sobre o que te preocupa com alguém de confiança." },
  "Irritada": { him: "Não leve para o lado pessoal e não responda com irritação. Dê espaço e volte depois.", her: "Nomear a irritação e fazer uma pausa antes de reagir ajuda. Avise quem está perto para evitar conflito." },
  "Triste": { him: "Escute sem tentar resolver e fique por perto. Se a tristeza durar ou for intensa, incentive a busca por apoio profissional.", her: "É legítimo sentir. Se a tristeza for intensa ou durar muito, procure apoio profissional." },
  "Sensível": { him: "Tom calmo e gentil, sem ironia. Valide o que ela sente.", her: "Reduza estímulos e fale com alguém de confiança. A sensibilidade costuma baixar com o fluxo." },
  "Intenso": { him: "Fluxo intenso aumenta o cansaço. Atenção à hidratação e ao descanso dela.", her: "Se o absorvente encharca em menos de 2 horas, procure avaliação médica." },
};

export const SIGNALS = {
  SPACE: { her: "Preciso de espaço", himTitle: "pediu espaço", guide: "Respeite sem se ofender. Avise que está por perto (“estou aqui se precisar”) e volte mais tarde, sem cobrar explicação." },
  TALK: { her: "Quero conversar", himTitle: "quer conversar", guide: "Pare o que está fazendo, deixe o celular de lado e escute primeiro. Resolver vem depois de ela se sentir ouvida." },
  HELP: { her: "Preciso de ajuda", himTitle: "pediu ajuda", guide: "Pergunte o que seria mais útil agora e faça sem reclamar. Ajuda prática vale mais do que conselho." },
  HUG: { her: "Preciso de carinho", himTitle: "pediu carinho", guide: "Chegue perto, abrace e fique um tempo, sem pressa e sem esperar que vire conversa." },
  OK: { her: "Estou bem, só aviso", himTitle: "avisou que está bem", guide: "Nada para resolver. Responda com carinho e siga a rotina." },
} as const;
export type SignalKind = keyof typeof SIGNALS;
export const isSignal = (k: string): k is SignalKind => k in SIGNALS;
