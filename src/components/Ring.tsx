import { PHASES } from "@/lib/tips";
import type { PhaseKey, Ranges } from "@/lib/cycle";

const ORDER: PhaseKey[] = ["menstrual", "folicular", "ovulatoria", "lutea"];

/** Anel do ciclo: 4 arcos coloridos + marcador no dia atual. */
export function Ring({ length, ranges, day, children }: { length: number; ranges: Ranges; day: number; children: React.ReactNode }) {
  const R = 92, C = 2 * Math.PI * R, gap = 3;
  const ang = (d: number) => ((d - 1) / length) * 2 * Math.PI - Math.PI / 2;
  const mid = ang(day + 0.5);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[200px] min-[400px]:max-w-[230px] sm:max-w-[300px]">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-0" role="img" aria-label={`Dia ${day} de ${length} do ciclo`}>
        {ORDER.map((k) => {
          const [a, b] = ranges[k];
          const len = ((b - a + 1) / length) * C;
          const off = ((a - 1) / length) * C;
          return (
            <circle key={k} cx="110" cy="110" r={R} fill="none" stroke={PHASES[k].color} strokeWidth="14"
              strokeLinecap="round" strokeDasharray={`${Math.max(len - gap, 1)} ${C}`} strokeDashoffset={-off}
              transform="rotate(-90 110 110)" opacity={0.9} />
          );
        })}
        <circle cx={110 + R * Math.cos(mid)} cy={110 + R * Math.sin(mid)} r="11" fill="#fff" />
        <circle cx={110 + R * Math.cos(mid)} cy={110 + R * Math.sin(mid)} r="5" fill="#0f0d1f" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
