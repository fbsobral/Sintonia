"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "./Icon";
import { markTourSeen } from "@/app/actions";
import type { TourStep } from "@/lib/tours";

type Props = {
  id: string;
  label: string;
  steps: TourStep[];
  /** Abre sozinho (primeira vez). */
  autoOpen?: boolean;
  /** Mostra o botão "?" que reabre o guia. */
  button?: boolean;
};

/**
 * Guia passo a passo. No celular é uma folha que sobe da base (alvos de toque grandes, gesto de deslizar);
 * em telas maiores vira um modal centralizado.
 */
export function Tour({ id, label, steps, autoOpen = false, button = false }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [, start] = useTransition();
  const next = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const last = i === steps.length - 1;
  const step = steps[i];

  useEffect(() => { if (autoOpen) { setI(0); setOpen(true); } }, [autoOpen]);

  const close = useCallback(() => {
    setOpen(false);
    if (autoOpen) start(() => { void markTourSeen(id); });
    opener.current?.focus();
  }, [autoOpen, id]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setI((n) => Math.min(n + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setI((n) => Math.max(n - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, close, steps.length]);

  useEffect(() => { if (open) next.current?.focus(); }, [open, i]);

  return (
    <>
      {button && (
        <button type="button" onClick={(e) => { opener.current = e.currentTarget; setI(0); setOpen(true); }}
          aria-label={`Ver o guia: ${label}`} title="Ver o guia desta tela"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white/5 text-base font-semibold text-accent transition hover:bg-white/10 active:scale-95">?</button>
      )}
      {open && step && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" role="presentation">
          <div className="tour-fade absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={close} aria-hidden />
          <div role="dialog" aria-modal="true" aria-labelledby={`tour-${id}-t`}
            onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touch.current == null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              touch.current = null;
              if (dx < -60) setI((n) => Math.min(n + 1, steps.length - 1));
              if (dx > 60) setI((n) => Math.max(n - 1, 0));
            }}
            className="tour-sheet relative flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] border border-line bg-[#15122b] shadow-2xl md:rounded-[2rem]">
            <div className="flex items-center gap-3 px-5 pt-4">
              <ol className="flex flex-1 gap-1.5" aria-label={`Passo ${i + 1} de ${steps.length}`}>
                {steps.map((_, n) => <li key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= i ? "bg-accent" : "bg-white/12"}`} />)}
              </ol>
              <button type="button" onClick={close} className="-mr-2 min-h-[44px] rounded-full px-3 text-sm text-muted hover:text-ink">{last ? "Fechar" : "Pular"}</button>
            </div>

            <div key={i} className="rise overflow-y-auto px-6 pb-2 pt-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent"><Icon name={step.icon} size={26} /></span>
              <p className="eyebrow mt-4">{label}</p>
              <h2 id={`tour-${id}-t`} className="font-display mt-1 text-[1.65rem] leading-tight">{step.title}</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{step.body}</p>
              {step.points && (
                <ul className="mt-4 space-y-2.5 text-[15px] leading-snug">
                  {step.points.map((p) => (
                    <li key={p} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300" aria-hidden><Icon name="check" size={12} /></span><span>{p}</span></li>
                  ))}
                </ul>
              )}
              {step.cta && <Link href={step.cta.href} onClick={close} className="mt-4 inline-flex min-h-[44px] items-center text-[15px] font-medium text-accent underline underline-offset-4">{step.cta.label}</Link>}
            </div>

            <div className="flex gap-2.5 px-5 pt-4" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1.25rem)" }}>
              {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="btn btn-ghost flex-none px-6">Voltar</button>}
              <button ref={next} type="button" onClick={() => (last ? close() : setI(i + 1))} className="btn flex-1">
                {last ? "Entendi" : "Próximo"}{!last && <Icon name="arrow" size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
