/** Dois mundos orbitando um núcleo: ele (lilás) e ela (coral). */
export function Orbit({ a, b, size = 240 }: { a: string; b: string; size?: number }) {
  return (
    <div className="orbit" style={{ width: size, height: size, transform: size === 240 ? undefined : `scale(${size / 240})` }} aria-hidden>
      <span className="orbit-ring" />
      <span className="orbit-ring r2" />
      <span className="orbit-core" />
      <div className="orb-wrap"><span className="orb" style={{ ["--c" as string]: "#7b61ff" }}><span>{a}</span></span></div>
      <div className="orb-wrap b"><span className="orb" style={{ ["--c" as string]: "#ff5e8a" }}><span>{b}</span></span></div>
    </div>
  );
}

const STARS = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100, d: ((i * 13) % 30) / 10, s: i % 5 === 0 ? 4 : 2,
}));

export function Stars() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden>
      {STARS.map((s, i) => (
        <span key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s`, width: s.s, height: s.s }} />
      ))}
    </div>
  );
}
