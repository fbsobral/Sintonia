import { SIGNS, SIGN_INFO, type Chart, type Sign } from "./astro";

type Aspect = "conj" | "sext" | "quad" | "trig" | "opos" | "dist";
const idx = (s: Sign) => SIGNS.indexOf(s);

export function aspectBetween(a: Sign, b: Sign): Aspect {
  const d = Math.abs(idx(a) - idx(b));
  const n = Math.min(d, 12 - d);
  return ({ 0: "conj", 1: "dist", 2: "sext", 3: "quad", 4: "trig", 5: "dist", 6: "opos" } as const)[n as 0 | 1 | 2 | 3 | 4 | 5 | 6];
}

const SCORE: Record<Aspect, number> = { trig: 92, sext: 84, conj: 78, opos: 70, dist: 58, quad: 60 };
export const ASPECT_LABEL: Record<Aspect, string> = {
  trig: "Fluxo natural", sext: "Se complementam", conj: "Muito semelhantes", opos: "Opostos complementares", quad: "Atrito produtivo", dist: "Estilos distintos",
};

type Kind = "sol" | "lua" | "desejo" | "cuidado";
const TEXT: Record<Kind, Record<Aspect, string>> = {
  sol: {
    conj: "Vocês têm a mesma essência: se reconhecem rápido e tendem a pensar parecido. O risco é compartilhar os mesmos pontos cegos, então vale ouvir uma opinião de fora em decisões importantes.",
    sext: "Estilos diferentes, mas compatíveis. Cada um traz o que falta ao outro sem grande esforço, desde que haja iniciativa para trocar.",
    quad: "Formas de agir que se chocam. É onde costuma haver atrito, mas também crescimento, se vocês negociarem o jeito de decidir em vez de disputar quem está certo.",
    trig: "Convivência fluida: vocês concordam no essencial sem esforço. O cuidado é não cair na rotina, então vale planejar novidade de propósito.",
    opos: "Vocês se complementam por contraste. Funciona quando cada um respeita o ritmo do outro em vez de tentar convertê-lo.",
    dist: "Vocês chegam às conclusões por caminhos diferentes. Perguntar “como você vê isso?” antes de opinar evita muito ruído.",
  },
  lua: {
    conj: "Vocês sentem de forma parecida, então ela tende a se sentir compreendida por você sem precisar explicar muito.",
    sext: "As necessidades emocionais de vocês se encaixam: é relativamente fácil acolher e ser acolhido.",
    quad: "O que acalma um pode agitar o outro. Pergunte o que ela precisa em vez de oferecer o que você precisaria.",
    trig: "Emoções em harmonia. A casa de vocês tende a ser um lugar de descanso emocional.",
    opos: "Um precisa de proximidade quando o outro precisa de espaço. Combinar sinais claros para pedir cada coisa evita mal-entendidos.",
    dist: "Vocês processam sentimentos de formas bem distintas. Frases simples e diretas funcionam melhor que subentendidos.",
  },
  desejo: {
    conj: "Atração direta e intensa. A mesma intensidade pode transformar discussões em conflitos grandes, então combinem pausas.",
    sext: "Química leve e divertida. O flerte e a brincadeira funcionam melhor que a seriedade.",
    quad: "Faísca forte, mas de pavio curto. Contato físico e carinho costumam desarmar mais que argumento.",
    trig: "Desejo e afeto andam juntos. É a combinação de quem se entende no olhar.",
    opos: "Polaridade magnética: o que é diferente atrai. Manter algum mistério e iniciativa alimenta a atração.",
    dist: "A atração pede tradução: falem do que gostam em vez de esperar que o outro adivinhe.",
  },
  cuidado: {
    conj: "Você entende bem o que ela sente. Use isso para antecipar necessidades, sem presumir.",
    sext: "Seu jeito de cuidar chega a ela com naturalidade. Pequenos gestos consistentes têm muito efeito.",
    quad: "Sua forma de cuidar nem sempre é a que ela precisa. Pergunte antes de resolver.",
    trig: "Seu jeito acolhe o dela, e ela tende a se sentir segura ao seu lado.",
    opos: "Você oferece o que ela busca fora de si. Constância é o que sustenta a confiança.",
    dist: "Você cuida do seu jeito e ela recebe de outro. Descubra o que faz diferença para ela, e não o que faria para você.",
  },
};

/** Trechos que mudam quando quem lê é ela (os demais são neutros). */
const TEXT_HER: Partial<Record<Kind, Partial<Record<Aspect, string>>>> = {
  lua: {
    conj: "Vocês sentem de forma parecida, então você tende a se sentir compreendida por ele sem precisar explicar muito.",
    quad: "O que acalma um pode agitar o outro. Diga a ele o que realmente te acalma, em vez de esperar que ele adivinhe.",
  },
  cuidado: {
    conj: "Ele entende bem o que você sente. Isso ajuda, e ainda vale dizer o que você precisa, para ele não presumir.",
    sext: "O jeito de cuidar dele chega até você com naturalidade. Gestos pequenos e constantes têm muito efeito.",
    quad: "A forma de cuidar dele nem sempre é a que você precisa. Diga o que ajuda você, em vez de esperar que ele acerte sozinho.",
    trig: "O jeito dele acolhe o seu, e você tende a se sentir segura ao lado dele.",
    opos: "Ele oferece o que você busca fora de si. Constância é o que sustenta a confiança.",
    dist: "Ele cuida do jeito dele e você recebe de outro. Mostre a ele o que faz diferença para você.",
  },
};

const SUB: Record<"him" | "her", Record<Kind, string>> = {
  him: { sol: "Seu Sol · Sol dela", lua: "Sua Lua · Lua dela", desejo: "Seu Marte · Vênus dela", cuidado: "Seu Sol · Lua dela" },
  her: { sol: "Sol dele · Seu Sol", lua: "Lua dele · Sua Lua", desejo: "Marte dele · Sua Vênus", cuidado: "Sol dele · Sua Lua" },
};

export type Pair = { kind: Kind; title: string; sub: string; a: Sign; b: Sign; aspect: Aspect; label: string; text: string; score: number };
export type Couple = { score: number; headline: string; pairs: Pair[]; elementNote: string };

export function compatibility(him: Chart, her: Chart, viewer: "him" | "her" = "him"): Couple {
  const mk = (kind: Kind, title: string, sub: string, a: Sign, b: Sign): Pair => {
    const aspect = aspectBetween(a, b);
    const text = (viewer === "her" && TEXT_HER[kind]?.[aspect]) || TEXT[kind][aspect];
    return { kind, title, sub: SUB[viewer][kind], a, b, aspect, label: ASPECT_LABEL[aspect], text, score: SCORE[aspect] };
  };
  const pairs = [
    mk("sol", "Essência", "Seu Sol · Sol dela", him.sun.sign, her.sun.sign),
    mk("lua", "Emoções", "Sua Lua · Lua dela", him.moon.sign, her.moon.sign),
    mk("desejo", "Atração", "Seu Marte · Vênus dela", him.mars.sign, her.venus.sign),
    mk("cuidado", "Acolhimento", "Seu Sol · Lua dela", him.sun.sign, her.moon.sign),
  ];
  const sameEl = SIGN_INFO[him.sun.sign].element === SIGN_INFO[her.sun.sign].element;
  const bonus = sameEl ? 3 : 0;
  const score = Math.min(97, Math.round(pairs.reduce((a, p) => a + p.score, 0) / pairs.length) + bonus);
  const best = [...pairs].sort((a, b) => b.score - a.score)[0];
  const headline =
    score >= 82 ? "Combinação que flui com naturalidade" :
    score >= 72 ? "Química forte, com pontos que pedem atenção" :
    "Estilos diferentes: pedem mais conversa, mas têm potencial";
  const e1 = SIGN_INFO[him.sun.sign].element, e2 = SIGN_INFO[her.sun.sign].element;
  const elementNote = e1 === e2
    ? `Vocês são do elemento ${e1}: pensam e reagem de forma parecida. O ponto mais forte da combinação é ${best.title.toLowerCase()}.`
    : viewer === "her"
      ? `Ele é ${e1} e você é ${e2}: elementos diferentes se equilibram quando há escuta. O ponto mais forte da combinação é ${best.title.toLowerCase()}.`
      : `Você é ${e1} e ela é ${e2}: elementos diferentes se equilibram quando há escuta. O ponto mais forte da combinação é ${best.title.toLowerCase()}.`;
  return { score, headline, pairs, elementNote };
}
