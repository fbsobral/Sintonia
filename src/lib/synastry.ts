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
  trig: "Fluem juntos", sext: "Se complementam", conj: "Muito parecidos", opos: "Opostos que se atraem", quad: "Tensão que move", dist: "Mundos diferentes",
};

type Kind = "sol" | "lua" | "desejo" | "cuidado";
const TEXT: Record<Kind, Record<Aspect, string>> = {
  sol: {
    conj: "Mesma essência: vocês se reconhecem rápido, e também repetem os mesmos pontos cegos. Combinem de ouvir o outro antes de reagir.",
    sext: "Estilos diferentes que se ajudam. Um empurra o outro para fora da zona de conforto sem peso.",
    quad: "Jeitos de agir que se chocam. É aí que nasce a atrito, e também o crescimento, se houver paciência.",
    trig: "Convivência natural. Vocês concordam no essencial sem esforço, então invistam em novidade para não cair na rotina.",
    opos: "Um completa o que falta no outro. Funciona quando cada um respeita o ritmo do outro em vez de tentar mudá-lo.",
    dist: "Vocês pensam por caminhos diferentes. Perguntar “como você vê isso?” evita muito ruído.",
  },
  lua: {
    conj: "Sentem do mesmo jeito. Ela tende a se sentir muito compreendida por você.",
    sext: "As necessidades emocionais se encaixam. É fácil acolher e ser acolhido.",
    quad: "O que acalma um pode agitar o outro. Pergunte o que ela precisa em vez de assumir.",
    trig: "Emoções em harmonia. O lar de vocês tende a ser um lugar seguro.",
    opos: "Um precisa de proximidade quando o outro precisa de espaço. Combinem sinais claros para pedir cada um.",
    dist: "Vocês processam sentimentos de formas bem distintas. Paciência e palavras simples ajudam.",
  },
  desejo: {
    conj: "Atração direta e intensa. Cuidado para a paixão não esquentar a discussão também.",
    sext: "Química leve e divertida. O flerte funciona quando há brincadeira.",
    quad: "Faísca forte, mas com pavio curto. Toque e carinho desarmam mais que argumento.",
    trig: "Desejo e afeto andam juntos. É a combinação de quem se entende no olhar.",
    opos: "Polaridade magnética: o que é diferente atrai. Mantenham o mistério vivo.",
    dist: "A atração pede mais tradução: falem do que gostam em vez de esperar que o outro adivinhe.",
  },
  cuidado: {
    conj: "Você entende bem o que ela sente. Use isso para antecipar, não para presumir.",
    sext: "Seu jeito de cuidar chega até ela de forma natural. Pequenos gestos valem muito.",
    quad: "Sua forma de cuidar nem sempre é a que ela precisa. Pergunte antes de resolver.",
    trig: "Seu jeito acolhe o dela. Ela tende a se sentir segura ao seu lado.",
    opos: "Você mostra o que ela busca fora. Seja constante para ela confiar.",
    dist: "Você cuida do seu jeito, ela sente de outro. Escute o que faz diferença para ela.",
  },
};

export type Pair = { kind: Kind; title: string; sub: string; a: Sign; b: Sign; aspect: Aspect; label: string; text: string; score: number };
export type Couple = { score: number; headline: string; pairs: Pair[]; elementNote: string };

export function compatibility(him: Chart, her: Chart): Couple {
  const mk = (kind: Kind, title: string, sub: string, a: Sign, b: Sign): Pair => {
    const aspect = aspectBetween(a, b);
    return { kind, title, sub, a, b, aspect, label: ASPECT_LABEL[aspect], text: TEXT[kind][aspect], score: SCORE[aspect] };
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
    score >= 82 ? "Uma sintonia que flui naturalmente" :
    score >= 72 ? "Química forte, com pontos para cuidar" :
    "Diferentes, e é isso que torna interessante";
  const e1 = SIGN_INFO[him.sun.sign].element, e2 = SIGN_INFO[her.sun.sign].element;
  const elementNote = e1 === e2
    ? `Vocês são do elemento ${e1}: pensam e reagem de forma parecida. Seu ponto mais forte é ${best.title.toLowerCase()}.`
    : `Você é ${e1} e ela é ${e2}: elementos diferentes trazem equilíbrio quando há escuta. Seu ponto mais forte é ${best.title.toLowerCase()}.`;
  return { score, headline, pairs, elementNote };
}
