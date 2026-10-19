export const fmt = (s: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Intl.DateTimeFormat("pt-BR", { ...o, timeZone: "UTC" }).format(new Date(`${s}T00:00:00Z`));

export const inDays = (n: number) => (n <= 0 ? "hoje" : n === 1 ? "amanhã" : `em ${n} dias`);

/** "23 out" (sem "de" nem ponto), para espaços curtos. */
export const short = (s: string) => fmt(s).replace(" de ", " ").replace(".", "");
/** "23 out – 2 nov" */
export const shortRange = (a: string, b: string) => `${short(a)} – ${short(b)}`;
