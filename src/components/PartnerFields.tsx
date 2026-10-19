type P = { name?: string; birthDate?: string; birthTime?: string | null; cycleMode?: string; periodLength?: number };

export function PartnerFields({ v = {} }: { v?: P }) {
  const modes = [
    { id: "D28", t: "28 dias", d: "Ciclo clássico" },
    { id: "D31", t: "31 dias", d: "Ciclo mais longo" },
    { id: "IRREGULAR", t: "Irregular", d: "Varia bastante" },
  ];
  return (
    <div className="space-y-4">
      <label className="block text-sm text-muted">Nome dela
        <input name="name" required maxLength={60} defaultValue={v.name} placeholder="Como você a chama" className="field mt-1" autoComplete="off" />
      </label>
      <label className="block text-sm text-muted">Data de nascimento
        <input type="date" name="birthDate" required defaultValue={v.birthDate} max="2015-12-31" className="field mt-1" />
      </label>
      <label className="block text-sm text-muted">Hora de nascimento <span className="opacity-70">(opcional, deixa o mapa mais preciso)</span>
        <input type="time" name="birthTime" defaultValue={v.birthTime ?? ""} className="field mt-1" />
      </label>
      <fieldset>
        <legend className="mb-1 text-sm text-muted">Ritmo do ciclo</legend>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => (
            <label key={m.id} className="cursor-pointer">
              <input type="radio" name="cycleMode" value={m.id} defaultChecked={(v.cycleMode ?? "D28") === m.id} className="peer sr-only" />
              <span className="flex min-h-[72px] flex-col items-center justify-center rounded-2xl border border-line bg-surface2 px-2 text-center peer-checked:border-accent peer-checked:bg-accent/15 peer-focus-visible:outline peer-focus-visible:outline-2">
                <span className="font-semibold">{m.t}</span><span className="text-[11px] text-muted">{m.d}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Depois de 3 menstruações registradas, o app passa a usar a média real.</p>
      </fieldset>
      <label className="block text-sm text-muted">Duração da menstruação (dias)
        <input type="number" name="periodLength" min={2} max={10} defaultValue={v.periodLength ?? 5} inputMode="numeric" className="field mt-1" />
      </label>
    </div>
  );
}
