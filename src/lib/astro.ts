import * as A from "astronomy-engine";

export const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
] as const;
export type Sign = (typeof SIGNS)[number];

type SignInfo = { element: string; glyph: string; essence: string; moon: string; venus: string; mars: string };

export const SIGN_INFO: Record<Sign, SignInfo> = {
  "Áries": { element: "Fogo", glyph: "♈\uFE0E", essence: "Direta, corajosa e impulsiva.", moon: "Sente rápido e precisa de ação para processar emoções.", venus: "Ama com iniciativa e adora ser conquistada.", mars: "Esquenta rápido e esfria rápido. Seja direto e objetivo." },
  "Touro": { element: "Terra", glyph: "♉\uFE0E", essence: "Estável, sensorial e leal.", moon: "Precisa de segurança, conforto e rotina.", venus: "Ama com presença, toque e gestos concretos.", mars: "Demora a irritar, mas não esquece. Evite pressão." },
  "Gêmeos": { element: "Ar", glyph: "♊\uFE0E", essence: "Curiosa, comunicativa e versátil.", moon: "Processa sentimentos conversando.", venus: "Ama com papo, humor e novidade.", mars: "Discute com palavras. Escute até o fim antes de responder." },
  "Câncer": { element: "Água", glyph: "♋\uFE0E", essence: "Cuidadosa, intuitiva e protetora.", moon: "Emoções profundas. Precisa de acolhimento e de um lar emocional.", venus: "Ama cuidando e lembrando detalhes.", mars: "Fica na defensiva quando magoada. Peça desculpas com carinho." },
  "Leão": { element: "Fogo", glyph: "♌\uFE0E", essence: "Generosa, vaidosa e calorosa.", moon: "Precisa se sentir vista e valorizada.", venus: "Ama com grandeza e adora elogios.", mars: "Orgulho ferido dói. Reconheça antes de discordar." },
  "Virgem": { element: "Terra", glyph: "♍\uFE0E", essence: "Detalhista, prestativa e analítica.", moon: "Ansiedade se acalma com ordem e utilidade.", venus: "Ama servindo e cuidando do dia a dia.", mars: "Crítica quando estressada. Mostre que prestou atenção." },
  "Libra": { element: "Ar", glyph: "♎\uFE0E", essence: "Elegante, diplomática e sociável.", moon: "Precisa de harmonia e de conversa tranquila.", venus: "Ama com romance, estética e parceria.", mars: "Evita conflito até explodir. Convide para falar cedo." },
  "Escorpião": { element: "Água", glyph: "♏\uFE0E", essence: "Intensa, magnética e reservada.", moon: "Sente tudo fundo e confia devagar.", venus: "Ama com entrega total e lealdade.", mars: "Não gosta de superficialidade. Seja honesto e verdadeiro." },
  "Sagitário": { element: "Fogo", glyph: "♐\uFE0E", essence: "Livre, otimista e aventureira.", moon: "Precisa de espaço e de sentido nas coisas.", venus: "Ama com aventura e liberdade.", mars: "Franqueza dura. Não leve para o lado pessoal e mantenha o humor." },
  "Capricórnio": { element: "Terra", glyph: "♑\uFE0E", essence: "Ambiciosa, responsável e firme.", moon: "Guarda emoções e demonstra com ações.", venus: "Ama com compromisso e constância.", mars: "Fecha-se quando cobrada. Dê tempo e reconheça o esforço." },
  "Aquário": { element: "Ar", glyph: "♒\uFE0E", essence: "Original, independente e racional.", moon: "Precisa de espaço mental e de liberdade.", venus: "Ama com amizade, ideias e respeito ao espaço.", mars: "Esfria e se afasta no conflito. Evite drama e vá para a lógica." },
  "Peixes": { element: "Água", glyph: "♓\uFE0E", essence: "Sensível, sonhadora e empática.", moon: "Absorve o ambiente. Precisa de carinho e de tempo sozinha.", venus: "Ama de forma romântica, intuitiva e sem limites.", mars: "Evita o embate e some. Crie um espaço seguro para falar." },
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
  "Áries": { essence: "Direto, corajoso e impulsivo.", moon: "Você sente rápido e precisa de ação para processar emoções.", venus: "Você ama com iniciativa e gosta de conquistar.", mars: "Você esquenta rápido e esfria rápido. Respire antes de responder." },
  "Touro": { essence: "Estável, sensorial e leal.", moon: "Você precisa de segurança, conforto e rotina.", venus: "Você ama com presença, toque e gestos concretos.", mars: "Você demora a irritar, mas não esquece. Cuidado com a teimosia." },
  "Gêmeos": { essence: "Curioso, comunicativo e versátil.", moon: "Você processa sentimentos conversando.", venus: "Você ama com papo, humor e novidade.", mars: "Você discute com palavras. Escute até o fim antes de rebater." },
  "Câncer": { essence: "Cuidadoso, intuitivo e protetor.", moon: "Suas emoções são profundas. Você precisa de acolhimento e de um lar emocional.", venus: "Você ama cuidando e lembrando detalhes.", mars: "Você fica na defensiva quando magoado. Fale o que sente em vez de se fechar." },
  "Leão": { essence: "Generoso, vaidoso e caloroso.", moon: "Você precisa se sentir visto e valorizado.", venus: "Você ama com grandeza e gosta de ser admirado.", mars: "Seu orgulho pesa nas brigas. Reconhecer o erro primeiro desarma." },
  "Virgem": { essence: "Detalhista, prestativo e analítico.", moon: "Sua ansiedade se acalma com ordem e utilidade.", venus: "Você ama servindo e cuidando do dia a dia.", mars: "Você critica quando estressado. Elogie antes de apontar." },
  "Libra": { essence: "Elegante, diplomático e sociável.", moon: "Você precisa de harmonia e de conversa tranquila.", venus: "Você ama com romance, estética e parceria.", mars: "Você evita conflito até explodir. Fale cedo, com calma." },
  "Escorpião": { essence: "Intenso, magnético e reservado.", moon: "Você sente tudo fundo e confia devagar.", venus: "Você ama com entrega total e lealdade.", mars: "Você guarda mágoa. Coloque para fora antes de virar silêncio." },
  "Sagitário": { essence: "Livre, otimista e aventureiro.", moon: "Você precisa de espaço e de sentido nas coisas.", venus: "Você ama com aventura e liberdade.", mars: "Sua franqueza pode ferir. Mantenha o humor e meça as palavras." },
  "Capricórnio": { essence: "Ambicioso, responsável e firme.", moon: "Você guarda emoções e demonstra com ações.", venus: "Você ama com compromisso e constância.", mars: "Você se fecha quando cobrado. Peça tempo em vez de se afastar." },
  "Aquário": { essence: "Original, independente e racional.", moon: "Você precisa de espaço mental e de liberdade.", venus: "Você ama com amizade, ideias e respeito ao espaço.", mars: "Você esfria e se afasta no conflito. Fique e converse." },
  "Peixes": { essence: "Sensível, sonhador e empático.", moon: "Você absorve o ambiente. Precisa de carinho e de tempo sozinho.", venus: "Você ama de forma romântica, intuitiva e sem limites.", mars: "Você evita o embate e some. Diga o que precisa, mesmo desconfortável." },
};

export type Who = "him" | "her";
/** Texto do signo conforme de quem é o mapa (ele em masculino/2ª pessoa, ela como já escrito). */
export function reading(sign: Sign, planet: "essence" | "moon" | "venus" | "mars", who: Who) {
  return who === "him" ? SIGN_SELF[sign][planet] : SIGN_INFO[sign][planet === "essence" ? "essence" : planet];
}
