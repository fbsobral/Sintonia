import * as A from "astronomy-engine";

export const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
] as const;
export type Sign = (typeof SIGNS)[number];

type SignInfo = { element: string; glyph: string; essence: string; moon: string; venus: string; mars: string };

export const SIGN_INFO: Record<Sign, SignInfo> = {
  "Áries": { element: "Fogo", glyph: "♈\uFE0E", essence: "Direta e de iniciativa. Fala o que pensa e tem pouca paciência com rodeios.", moon: "Sente rápido e precisa agir para processar as emoções. Reage no calor do momento e costuma se acalmar com a mesma rapidez.", venus: "Demonstra afeto com iniciativa e valoriza ser desejada e escolhida. Prefere conquista ativa a passividade.", mars: "Esquenta rápido e esfria rápido. Seja objetivo, evite rodeios e não prolongue a discussão depois que ela passa." },
  "Touro": { element: "Terra", glyph: "♉\uFE0E", essence: "Estável, sensorial e leal. Valoriza segurança, constância e conforto.", moon: "Precisa de estabilidade e de uma rotina que dê sensação de segurança. Mudanças bruscas desorganizam o humor.", venus: "Expressa afeto por presença física, toque e atos concretos, mais do que por palavras.", mars: "Demora a se irritar, mas, quando se irrita, mantém a posição. Pressionar só aumenta a resistência: dê tempo." },
  "Gêmeos": { element: "Ar", glyph: "♊\uFE0E", essence: "Curiosa, comunicativa e versátil. Precisa de estímulo mental e de variedade.", moon: "Processa o que sente falando. Conversar sobre o assunto reduz a intensidade emocional.", venus: "Se aproxima por conversa, humor e novidade. A rotina silenciosa pesa mais do que parece.", mars: "Discute com argumentos e pode mudar de posição durante a conversa. Escute até o fim antes de rebater." },
  "Câncer": { element: "Água", glyph: "♋\uFE0E", essence: "Cuidadosa, intuitiva e protetora. Constrói vínculos profundos e guarda memória afetiva.", moon: "Tem emoções profundas e ligadas à sensação de segurança no vínculo. Precisa se sentir acolhida para se abrir.", venus: "Ama cuidando e lembrando detalhes. Valoriza gestos que mostram atenção.", mars: "Fica na defensiva quando se sente magoada e pode se fechar. Nomear o que aconteceu e pedir desculpa de forma clara reabre o diálogo." },
  "Leão": { element: "Fogo", glyph: "♌\uFE0E", essence: "Generosa, expressiva e orgulhosa. Precisa sentir que o esforço dela é visto.", moon: "Precisa de reconhecimento e de se sentir importante para você. A indiferença machuca mais que a discordância.", venus: "Ama com generosidade e gestos grandes, e valoriza elogio sincero e atenção.", mars: "O orgulho pesa nas discussões. Reconheça o ponto dela antes de discordar." },
  "Virgem": { element: "Terra", glyph: "♍\uFE0E", essence: "Analítica, detalhista e prestativa. Percebe o que precisa melhorar.", moon: "A ansiedade diminui com ordem, planejamento e utilidade. Bagunça e imprevistos aumentam a tensão.", venus: "Demonstra afeto servindo e cuidando do cotidiano. Valoriza que você perceba esses gestos.", mars: "Quando estressada, tende a criticar. Mostrar que você notou o esforço dela antes de pedir mudanças evita a defensiva." },
  "Libra": { element: "Ar", glyph: "♎\uFE0E", essence: "Diplomática, sociável e sensível à estética e à justiça.", moon: "Precisa de harmonia e de conversas tranquilas. Tensão prolongada a desgasta.", venus: "Ama com romance, atenção ao ambiente e parceria. Valoriza reciprocidade.", mars: "Evita conflito até o limite e pode explodir depois. Convide para falar cedo, antes de acumular." },
  "Escorpião": { element: "Água", glyph: "♏\uFE0E", essence: "Intensa, reservada e perceptiva. Confia devagar e se entrega por inteiro.", moon: "Sente tudo com profundidade e raramente demonstra de imediato. Precisa de confiança para se abrir.", venus: "Ama com intensidade e lealdade. Valoriza honestidade e não tolera superficialidade.", mars: "Guarda mágoa em silêncio. Seja direto e verdadeiro: jogos e meias-verdades pioram." },
  "Sagitário": { element: "Fogo", glyph: "♐\uFE0E", essence: "Otimista, franca e independente. Precisa de liberdade e de sentido.", moon: "Precisa de espaço e de perspectiva para lidar com emoções. Sentir-se cobrada ou presa piora.", venus: "Ama com aventura e liberdade, e valoriza companheirismo leve.", mars: "É franca e pode ferir sem intenção. Não leve para o lado pessoal e mantenha o humor." },
  "Capricórnio": { element: "Terra", glyph: "♑\uFE0E", essence: "Ambiciosa, responsável e disciplinada. Leva compromissos a sério.", moon: "Guarda as emoções e as demonstra com ações. Pode parecer fria quando está sobrecarregada.", venus: "Ama com compromisso, constância e projetos de longo prazo.", mars: "Fecha-se quando se sente cobrada. Reconheça o esforço e dê tempo, em vez de pressionar." },
  "Aquário": { element: "Ar", glyph: "♒\uFE0E", essence: "Independente, original e racional. Valoriza liberdade e autonomia intelectual.", moon: "Precisa de espaço mental para processar emoções. Cobrança por proximidade imediata a afasta.", venus: "Ama com amizade, ideias e respeito ao espaço individual.", mars: "No conflito tende a se distanciar e racionalizar. Fique no assunto com calma e evite o drama." },
  "Peixes": { element: "Água", glyph: "♓\uFE0E", essence: "Sensível, empática e imaginativa. Absorve o clima emocional ao redor.", moon: "Absorve o ambiente e as emoções dos outros, e precisa de pausas sozinha para se reorganizar.", venus: "Ama de forma romântica e entregue, e valoriza delicadeza e sensibilidade.", mars: "Evita o confronto e pode se afastar sem explicar. Crie um ambiente seguro para ela dizer o que sente." },
};

const signOf = (lon: number): Sign => SIGNS[Math.floor((((lon % 360) + 360) % 360) / 30)];
const degIn = (lon: number) => Math.floor((((lon % 360) + 360) % 360) % 30);

function eclipticLon(body: A.Body, t: A.AstroTime) {
  return A.Ecliptic(A.GeoVector(body, t, true)).elon;
}

export type Placement = { sign: Sign; deg: number };
export type Chart = {
  sun: Placement;
  moon: Placement;
  venus: Placement;
  mars: Placement;
  approx: boolean; // sem hora de nascimento: Lua/Vênus podem variar
  elements: Record<string, number>;
};

/** Horário de Brasília (UTC−3) quando a hora é informada; senão meio-dia. */
export function chartFor(birthDate: string, birthTime?: string | null): Chart {
  const time = birthTime || "12:00";
  const date = new Date(`${birthDate}T${time}:00-03:00`);
  const t = A.MakeTime(date);
  const p = (lon: number): Placement => ({ sign: signOf(lon), deg: degIn(lon) });
  const sun = p(A.SunPosition(t).elon);
  const moon = p(A.EclipticGeoMoon(t).lon);
  const venus = p(eclipticLon(A.Body.Venus, t));
  const mars = p(eclipticLon(A.Body.Mars, t));
  const elements: Record<string, number> = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
  [sun, moon, venus, mars].forEach((x) => elements[SIGN_INFO[x.sign].element]++);
  return { sun, moon, venus, mars, approx: !birthTime, elements };
}

const MOON_NAMES = ["Lua nova", "Crescente", "Quarto crescente", "Gibosa crescente", "Lua cheia", "Gibosa minguante", "Quarto minguante", "Minguante"];

export function skyToday(now = new Date()) {
  const t = A.MakeTime(now);
  const ph = A.MoonPhase(t);
  return {
    moonSign: signOf(A.EclipticGeoMoon(t).lon),
    moonPhase: MOON_NAMES[Math.floor(((ph + 22.5) % 360) / 45)],
    illumination: Math.round(A.Illumination(A.Body.Moon, t).phase_fraction * 100),
  };
}

export function daysToBirthday(birthDate: string, today: string) {
  const [, m, d] = birthDate.split("-").map(Number);
  const [y] = today.split("-").map(Number);
  const mk = (yy: number) => Date.UTC(yy, m - 1, d);
  const now = Date.parse(`${today}T00:00:00Z`);
  let target = mk(y);
  if (target < now) target = mk(y + 1);
  return Math.round((target - now) / 86_400_000);
}

type SelfText = { essence: string; moon: string; venus: string; mars: string };

/** Leitura do mapa DELE: masculino e em segunda pessoa. */
export const SIGN_SELF: Record<Sign, SelfText> = {
  "Áries": { essence: "Direto, corajoso e de iniciativa. Tem pouca paciência com demora e rodeios.", moon: "Você sente rápido e precisa agir para processar emoções. Reprimir só aumenta a pressão.", venus: "Você demonstra afeto com iniciativa e gosta de conquistar e de ser escolhido.", mars: "Você esquenta rápido e esfria rápido. Em discussões, respire antes de responder para não dizer o que não pensa." },
  "Touro": { essence: "Estável, sensorial e leal. Valoriza segurança, conforto e constância.", moon: "Você precisa de estabilidade e rotina para se sentir seguro. Mudanças bruscas desorganizam seu humor.", venus: "Você expressa afeto por presença, toque e atos concretos, mais do que por palavras.", mars: "Você demora a se irritar, mas mantém a posição quando se irrita. Cuidado para a teimosia não prolongar o conflito." },
  "Gêmeos": { essence: "Curioso, comunicativo e versátil. Precisa de estímulo mental e de variedade.", moon: "Você processa o que sente falando. Conversar sobre o assunto reduz a intensidade emocional.", venus: "Você se aproxima por conversa, humor e novidade.", mars: "Você discute com argumentos e pode mudar de posição no meio da conversa. Escute até o fim antes de rebater." },
  "Câncer": { essence: "Cuidadoso, intuitivo e protetor. Cria vínculos profundos e guarda memória afetiva.", moon: "Suas emoções são profundas e ligadas à sensação de segurança no vínculo. Você se abre quando se sente acolhido.", venus: "Você ama cuidando e lembrando detalhes.", mars: "Quando magoado, você tende a se defender e se fechar. Diga o que sentiu em vez de se recolher." },
  "Leão": { essence: "Generoso, expressivo e orgulhoso. Precisa sentir que o esforço é visto.", moon: "Você precisa de reconhecimento. A indiferença machuca mais que a discordância.", venus: "Você ama com generosidade e gestos grandes, e gosta de ser admirado.", mars: "O orgulho pesa nas discussões. Reconhecer o erro primeiro costuma desarmar a briga." },
  "Virgem": { essence: "Analítico, detalhista e prestativo. Percebe o que precisa melhorar.", moon: "Sua ansiedade diminui com ordem, planejamento e utilidade.", venus: "Você demonstra afeto servindo e cuidando do dia a dia.", mars: "Sob estresse, você tende a criticar. Reconheça o que está bom antes de apontar o que falta." },
  "Libra": { essence: "Diplomático, sociável e sensível à estética e à justiça.", moon: "Você precisa de harmonia e de conversas tranquilas. Tensão prolongada o desgasta.", venus: "Você ama com romance, atenção ao ambiente e parceria.", mars: "Você evita conflito até o limite e pode explodir depois. Fale cedo, com calma." },
  "Escorpião": { essence: "Intenso, reservado e perceptivo. Confia devagar e se entrega por inteiro.", moon: "Você sente tudo com profundidade e raramente demonstra de imediato.", venus: "Você ama com intensidade e lealdade e não tolera superficialidade.", mars: "Você guarda mágoa em silêncio. Coloque o assunto na mesa antes que vire distância." },
  "Sagitário": { essence: "Otimista, franco e independente. Precisa de liberdade e de sentido.", moon: "Você precisa de espaço e de perspectiva para lidar com emoções. Sentir-se preso piora.", venus: "Você ama com aventura e liberdade.", mars: "Sua franqueza pode ferir sem intenção. Meça as palavras quando o assunto for sensível." },
  "Capricórnio": { essence: "Ambicioso, responsável e disciplinado. Leva compromissos a sério.", moon: "Você guarda as emoções e as demonstra com ações. Pode parecer frio quando está sobrecarregado.", venus: "Você ama com compromisso, constância e projetos de longo prazo.", mars: "Você se fecha quando cobrado. Peça tempo em vez de se afastar sem explicar." },
  "Aquário": { essence: "Independente, original e racional. Valoriza liberdade e autonomia.", moon: "Você precisa de espaço mental para processar emoções.", venus: "Você ama com amizade, ideias e respeito ao espaço individual.", mars: "No conflito, você tende a se distanciar e racionalizar. Fique na conversa, mesmo desconfortável." },
  "Peixes": { essence: "Sensível, empático e imaginativo. Absorve o clima emocional ao redor.", moon: "Você absorve o ambiente e as emoções dos outros e precisa de pausas sozinho para se reorganizar.", venus: "Você ama de forma romântica e entregue.", mars: "Você evita o confronto e tende a sumir. Diga o que precisa, mesmo quando for desconfortável." },
};

export const SIGN_SELF_HER: Record<Sign, SelfText> = {
  "Áries": { essence: "Direta, corajosa e de iniciativa. Você tem pouca paciência com rodeios.", moon: "Você sente rápido e precisa agir para processar as emoções. Reage no calor do momento e costuma se acalmar com a mesma rapidez.", venus: "Você demonstra afeto com iniciativa e gosta de ser desejada e escolhida. Prefere conquista ativa a passividade.", mars: "Você esquenta rápido e esfria rápido. Em discussões, vale pedir objetividade e não prolongar o assunto depois que ele passa." },
  "Touro": { essence: "Estável, sensorial e leal. Você valoriza segurança, constância e conforto.", moon: "Você precisa de estabilidade e de uma rotina que dê sensação de segurança. Mudanças bruscas desorganizam o seu humor.", venus: "Você expressa afeto por presença física, toque e atos concretos, mais do que por palavras.", mars: "Você demora a se irritar, mas mantém a posição quando se irrita. Pressão só aumenta a sua resistência: peça tempo." },
  "Gêmeos": { essence: "Curiosa, comunicativa e versátil. Você precisa de estímulo mental e de variedade.", moon: "Você processa o que sente falando. Conversar sobre o assunto reduz a intensidade emocional.", venus: "Você se aproxima por conversa, humor e novidade. A rotina silenciosa pesa mais do que parece.", mars: "Você discute com argumentos e pode mudar de posição durante a conversa. Peça para ser ouvida até o fim." },
  "Câncer": { essence: "Cuidadosa, intuitiva e protetora. Você constrói vínculos profundos e guarda memória afetiva.", moon: "Suas emoções são profundas e ligadas à sensação de segurança no vínculo. Você precisa se sentir acolhida para se abrir.", venus: "Você ama cuidando e lembrando detalhes, e valoriza gestos que mostram atenção.", mars: "Você fica na defensiva quando se sente magoada e pode se fechar. Nomear o que aconteceu ajuda a reabrir o diálogo." },
  "Leão": { essence: "Generosa, expressiva e orgulhosa. Você precisa sentir que o seu esforço é visto.", moon: "Você precisa de reconhecimento e de se sentir importante para quem ama. A indiferença machuca mais que a discordância.", venus: "Você ama com generosidade e gestos grandes, e valoriza elogio sincero e atenção.", mars: "O orgulho pesa nas suas discussões. Dizer o que te machucou, em vez de se fechar, destrava a conversa." },
  "Virgem": { essence: "Analítica, detalhista e prestativa. Você percebe o que precisa melhorar.", moon: "Sua ansiedade diminui com ordem, planejamento e utilidade. Bagunça e imprevistos aumentam a tensão.", venus: "Você demonstra afeto servindo e cuidando do cotidiano, e valoriza que percebam esses gestos.", mars: "Quando estressada, você tende a criticar. Perceber isso antes ajuda a não descontar em quem está perto." },
  "Libra": { essence: "Diplomática, sociável e sensível à estética e à justiça.", moon: "Você precisa de harmonia e de conversas tranquilas. Tensão prolongada te desgasta.", venus: "Você ama com romance, atenção ao ambiente e parceria, e valoriza reciprocidade.", mars: "Você evita conflito até o limite e pode explodir depois. Falar cedo, com calma, evita o acúmulo." },
  "Escorpião": { essence: "Intensa, reservada e perceptiva. Você confia devagar e se entrega por inteiro.", moon: "Você sente tudo com profundidade e raramente demonstra de imediato. Precisa de confiança para se abrir.", venus: "Você ama com intensidade e lealdade, e não tolera superficialidade.", mars: "Você guarda mágoa em silêncio. Colocar o assunto na mesa antes que vire distância costuma ser o caminho." },
  "Sagitário": { essence: "Otimista, franca e independente. Você precisa de liberdade e de sentido.", moon: "Você precisa de espaço e de perspectiva para lidar com emoções. Sentir-se cobrada ou presa piora.", venus: "Você ama com aventura e liberdade, e valoriza companheirismo leve.", mars: "Você é franca e pode ferir sem intenção. Medir as palavras quando o assunto é sensível ajuda." },
  "Capricórnio": { essence: "Ambiciosa, responsável e disciplinada. Você leva compromissos a sério.", moon: "Você guarda as emoções e as demonstra com ações. Pode parecer fria quando está sobrecarregada.", venus: "Você ama com compromisso, constância e projetos de longo prazo.", mars: "Você se fecha quando se sente cobrada. Pedir tempo é melhor do que se afastar sem explicar." },
  "Aquário": { essence: "Independente, original e racional. Você valoriza liberdade e autonomia intelectual.", moon: "Você precisa de espaço mental para processar emoções. Cobrança por proximidade imediata te afasta.", venus: "Você ama com amizade, ideias e respeito ao espaço individual.", mars: "No conflito, você tende a se distanciar e racionalizar. Ficar na conversa, mesmo desconfortável, ajuda." },
  "Peixes": { essence: "Sensível, empática e imaginativa. Você absorve o clima emocional ao redor.", moon: "Você absorve o ambiente e as emoções dos outros, e precisa de pausas sozinha para se reorganizar.", venus: "Você ama de forma romântica e entregue, e valoriza delicadeza e sensibilidade.", mars: "Você evita o confronto e pode se afastar sem explicar. Dizer o que precisa, mesmo desconfortável, protege a relação." },
};

export const SIGN_HIM_3P: Record<Sign, SelfText> = {
  "Áries": { essence: "Direto, corajoso e de iniciativa. Tem pouca paciência com demora e rodeios.", moon: "Ele sente rápido e precisa agir para processar emoções. Reprimir só aumenta a pressão.", venus: "Ele demonstra afeto com iniciativa e gosta de conquistar e de ser escolhido.", mars: "Ele esquenta rápido e esfria rápido. Em discussões, vale dar um momento para ele respirar antes de responder." },
  "Touro": { essence: "Estável, sensorial e leal. Valoriza segurança, conforto e constância.", moon: "Ele precisa de estabilidade e rotina para se sentir seguro. Mudanças bruscas desorganizam o humor dele.", venus: "Ele expressa afeto por presença, toque e atos concretos, mais do que por palavras.", mars: "Ele demora a se irritar, mas mantém a posição quando se irrita. Cuidado para a teimosia não prolongar o conflito." },
  "Gêmeos": { essence: "Curioso, comunicativo e versátil. Precisa de estímulo mental e de variedade.", moon: "Ele processa o que sente falando. Conversar sobre o assunto reduz a intensidade emocional.", venus: "Ele se aproxima por conversa, humor e novidade.", mars: "Ele discute com argumentos e pode mudar de posição no meio da conversa. Vale ouvir até o fim antes de rebater." },
  "Câncer": { essence: "Cuidadoso, intuitivo e protetor. Cria vínculos profundos e guarda memória afetiva.", moon: "As emoções dele são profundas e ligadas à sensação de segurança no vínculo. Ele se abre quando se sente acolhido.", venus: "Ele ama cuidando e lembrando detalhes.", mars: "Quando magoado, tende a se defender e se fechar. Perguntar com calma o que ele sentiu ajuda a reabrir a conversa." },
  "Leão": { essence: "Generoso, expressivo e orgulhoso. Precisa sentir que o esforço é visto.", moon: "Ele precisa de reconhecimento. A indiferença machuca mais que a discordância.", venus: "Ele ama com generosidade e gestos grandes, e gosta de ser admirado.", mars: "O orgulho pesa nas discussões dele. Reconhecer o que ele fez bem antes de discordar costuma desarmar a briga." },
  "Virgem": { essence: "Analítico, detalhista e prestativo. Percebe o que precisa melhorar.", moon: "A ansiedade dele diminui com ordem, planejamento e utilidade.", venus: "Ele demonstra afeto servindo e cuidando do dia a dia.", mars: "Sob estresse, ele tende a criticar. Mostrar que você percebeu o esforço dele antes de pedir mudanças evita a defensiva." },
  "Libra": { essence: "Diplomático, sociável e sensível à estética e à justiça.", moon: "Ele precisa de harmonia e de conversas tranquilas. Tensão prolongada o desgasta.", venus: "Ele ama com romance, atenção ao ambiente e parceria.", mars: "Ele evita conflito até o limite e pode explodir depois. Abrir a conversa cedo, com calma, ajuda." },
  "Escorpião": { essence: "Intenso, reservado e perceptivo. Confia devagar e se entrega por inteiro.", moon: "Ele sente tudo com profundidade e raramente demonstra de imediato.", venus: "Ele ama com intensidade e lealdade e não tolera superficialidade.", mars: "Ele guarda mágoa em silêncio. Colocar o assunto na mesa antes que vire distância costuma ser o caminho." },
  "Sagitário": { essence: "Otimista, franco e independente. Precisa de liberdade e de sentido.", moon: "Ele precisa de espaço e de perspectiva para lidar com emoções. Sentir-se preso piora.", venus: "Ele ama com aventura e liberdade.", mars: "A franqueza dele pode ferir sem intenção. Vale lembrar que, em geral, não há maldade." },
  "Capricórnio": { essence: "Ambicioso, responsável e disciplinado. Leva compromissos a sério.", moon: "Ele guarda as emoções e as demonstra com ações; pode parecer frio quando está sobrecarregado.", venus: "Ele ama com compromisso, constância e projetos de longo prazo.", mars: "Ele se fecha quando cobrado. Dar tempo costuma funcionar melhor do que pressionar." },
  "Aquário": { essence: "Independente, original e racional. Valoriza liberdade e autonomia.", moon: "Ele precisa de espaço mental para processar emoções.", venus: "Ele ama com amizade, ideias e respeito ao espaço individual.", mars: "No conflito, tende a se distanciar e racionalizar. Convidar para continuar a conversa, com calma, ajuda." },
  "Peixes": { essence: "Sensível, empático e imaginativo. Absorve o clima emocional ao redor.", moon: "Ele absorve o ambiente e as emoções dos outros e precisa de pausas sozinho para se reorganizar.", venus: "Ele ama de forma romântica e entregue.", mars: "Ele evita o confronto e tende a sumir. Criar um ambiente seguro para ele dizer o que precisa ajuda." },
};

export type Who = "him" | "her";
/**
 * Texto do signo conforme de quem é o mapa (`who`) e de quem está olhando (`viewer`):
 * o próprio mapa vem em 2ª pessoa (masculino ou feminino); o do outro, em 3ª pessoa.
 */
export function reading(sign: Sign, planet: "essence" | "moon" | "venus" | "mars", who: Who, viewer: Who = "him") {
  if (who === "him") return (viewer === "him" ? SIGN_SELF : SIGN_HIM_3P)[sign][planet];
  return viewer === "her" ? SIGN_SELF_HER[sign][planet] : SIGN_INFO[sign][planet];
}
