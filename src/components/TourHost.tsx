import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Tour } from "./Tour";
import { tourContent, type TourId } from "@/lib/tours";
import type { Viewer } from "@/lib/session";

/** Boas-vindas: abre sozinho na primeira vez que a pessoa entra no app, em qualquer tela. */
export async function WelcomeTour() {
  const { userId } = await auth();
  if (!userId) return null;
  const u = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, onboardedAt: true, tours: true, couple: { select: { profile: { select: { name: true } } } } },
  });
  if (!u?.role || !u.onboardedAt || u.tours.includes("welcome")) return null;
  const viewer: Viewer = u.role === "CYCLE" ? "her" : "him";
  const c = tourContent("welcome", viewer, u.couple?.profile?.name ?? "ela");
  return <Tour id="welcome" label={c.label} steps={c.steps} autoOpen />;
}

/**
 * Guia de um módulo: botão "?" no cabeçalho e abertura automática na primeira visita.
 * Só abre sozinho depois das boas-vindas, para nunca haver dois guias ao mesmo tempo.
 */
export function ModuleTour({ id, viewer, partnerName, seen }: { id: Exclude<TourId, "welcome">; viewer: Viewer; partnerName: string; seen: string[] }) {
  const c = tourContent(id, viewer, partnerName);
  return <Tour id={id} label={c.label} steps={c.steps} button autoOpen={seen.includes("welcome") && !seen.includes(id)} />;
}
