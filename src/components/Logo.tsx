import { useId } from "react";

/** Dois círculos em sintonia: ele (lilás) e ela (coral). A interseção brilha. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label="Sintonia">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d6c9ff" /><stop offset="1" stopColor="#7b61ff" /></linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffc2a8" /><stop offset="1" stopColor="#ff5e8a" /></linearGradient>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#ffe9b8" /></radialGradient>
        <clipPath id={`${id}c`}><circle cx="39" cy="32" r="18" /></clipPath>
      </defs>
      <circle cx="25" cy="32" r="18" fill="none" stroke={`url(#${id}a)`} strokeWidth="4.5" />
      <circle cx="39" cy="32" r="18" fill="none" stroke={`url(#${id}b)`} strokeWidth="4.5" />
      <circle cx="25" cy="32" r="18" fill={`url(#${id}g)`} clipPath={`url(#${id}c)`} />
    </svg>
  );
}

export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-[1.35em] leading-none tracking-wide">sintonia</span>
    </span>
  );
}
