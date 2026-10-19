export const fmt = (s: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Intl.DateTimeFormat("pt-BR", { ...o, timeZone: "UTC" }).format(new Date(`${s}T00:00:00Z`));

export const inDays = (n: number) => (n <= 0 ? "hoje" : n === 1 ? "amanhã" : `em ${n} dias`);
