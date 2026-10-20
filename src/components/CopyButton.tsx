"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copiar link" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost min-h-[48px] px-5"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); } catch { /* sem permissão */ }
      }}
    >
      {ok ? "Copiado" : label}
    </button>
  );
}
