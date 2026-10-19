export type PhaseKey = "menstrual" | "folicular" | "ovulatoria" | "lutea";
export type Mode = "D28" | "D31" | "IRREGULAR";

const DAY = 86_400_000;
export const toDay = (s: string) => Math.floor(Date.parse(`${s}T00:00:00Z`) / DAY);
export const fromDay = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);
export const dateStr = (d: Date) => d.toISOString().slice(0, 10);

/** Data de hoje (YYYY-MM-DD) no fuso informado. */
export function todayIn(tz: string, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(now);
}

export type CycleEntry = { start: string; end?: string | null };

export type Profile = {
  length: number;
  periodLength: number;
  /** "media" quando há mais de 2 ciclos cadastrados; senão o ritmo declarado. */
  source: "media" | "declarado";
  intervals: number[];
  starts: string[];
};

const MODE_LENGTH: Record<Mode, number> = { D28: 28, D31: 31, IRREGULAR: 30 };

export function buildProfile(entries: CycleEntry[], mode: Mode, defaultPeriod: number): Profile {
  const starts = entries.map((e) => e.start).sort();
  const intervals = starts.slice(1).map((s, i) => toDay(s) - toDay(starts[i]));
  // "mais de 2 ciclos" = 3+ menstruações registradas (2+ intervalos medidos)
  const useAvg = starts.length > 2 && intervals.length > 0;
  const length = useAvg
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : MODE_LENGTH[mode];

  const durs = entries
    .filter((e) => e.end)
    .map((e) => toDay(e.end!) - toDay(e.start) + 1)
    .filter((n) => n > 0 && n < 15);
  const periodLength = durs.length
    ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length)
    : defaultPeriod;

  return { length: Math.min(Math.max(length, 21), 45), periodLength, source: useAvg ? "media" : "declarado", intervals, starts };
}

export type Ranges = Record<PhaseKey, [number, number]> & { ovulationDay: number };

/** Fase lútea ≈ 14 dias; ovulação = comprimento − 14. */
export function phaseRanges(L: number, P: number): Ranges {
  const ov = Math.max(P + 3, L - 14);
  return {
    menstrual: [1, P],
    folicular: [P + 1, ov - 2],
    ovulatoria: [ov - 1, ov + 1],
    lutea: [ov + 2, L],
    ovulationDay: ov,
  };
}

export function phaseOf(day: number, r: Ranges): PhaseKey {
  for (const k of ["menstrual", "folicular", "ovulatoria", "lutea"] as PhaseKey[]) {
    if (day >= r[k][0] && day <= r[k][1]) return k;
  }
  return "lutea";
}

export type Status = {
  profile: Profile;
  ranges: Ranges;
  cycleDay: number;
  phase: PhaseKey;
  phaseDay: number;
  phaseLength: number;
  projected: boolean; // além do último ciclo registrado (estimativa)
  nextPeriod: string;
  daysToPeriod: number;
  ovulationDate: string;
  /** Últimos 4 dias da lútea: janela provável de TPM */
  pms: boolean;
  anchor: string; // início do ciclo corrente (real ou projetado)
};

export function statusOn(profile: Profile, today: string): Status | null {
  const past = profile.starts.filter((s) => s <= today);
  if (!past.length) return null;
  const last = past[past.length - 1];
  const nextStart = profile.starts.find((s) => s > today);
  const diff = toDay(today) - toDay(last);
  // Dentro de um ciclo já encerrado usamos a duração REAL dele; no ciclo corrente, a média.
  const closed = nextStart ? toDay(nextStart) - toDay(last) : null;
  const L = closed ?? profile.length;
  const Lr = Math.max(L, profile.periodLength + 8); // proteção para registros muito curtos
  const n = closed ? 0 : Math.floor(diff / L);
  const cycleDay = closed ? diff + 1 : (diff % L) + 1;
  const ranges = phaseRanges(Lr, profile.periodLength);
  const phase = phaseOf(cycleDay, ranges);
  const [a, b] = ranges[phase];
  const anchorDay = toDay(last) + n * L;
  const nextDay = closed ? toDay(nextStart!) : anchorDay + L;
  return {
    profile,
    ranges,
    cycleDay,
    phase,
    phaseDay: cycleDay - a + 1,
    phaseLength: b - a + 1,
    projected: !closed && diff >= L,
    nextPeriod: fromDay(nextDay),
    daysToPeriod: nextDay - toDay(today),
    ovulationDate: fromDay(anchorDay + ranges.ovulationDay - 1),
    pms: phase === "lutea" && cycleDay > Lr - 4,
    anchor: fromDay(anchorDay),
  };
}

export type DayCell = { date: string; cycleDay: number; phase: PhaseKey };

/** Linha do tempo de `count` dias a partir de `from` (projeta ciclos futuros). */
export function timeline(profile: Profile, from: string, count: number): DayCell[] {
  const out: DayCell[] = [];
  for (let i = 0; i < count; i++) {
    const date = fromDay(toDay(from) + i);
    const s = statusOn(profile, date);
    if (s) out.push({ date, cycleDay: s.cycleDay, phase: s.phase });
  }
  return out;
}
