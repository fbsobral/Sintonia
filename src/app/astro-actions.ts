"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { chartFor, reading, SIGN_INFO, type Who } from "@/lib/astro";
import { compatibility } from "@/lib/synastry";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal(""));
const asWho = (w: string): Who => (w === "her" ? "her" : "him");

/** `who` = de quem é o mapa; `viewer` = quem está olhando (define pessoa e gênero do texto). */
const view = (d: string, t: string | undefined, who: Who, viewer: Who) => {
  const c = chartFor(d, t || null);
  const i = SIGN_INFO[c.sun.sign];
  return {
    sign: c.sun.sign, glyph: i.glyph, element: i.element, essence: reading(c.sun.sign, "essence", who, viewer),
    moon: c.moon.sign, venus: c.venus.sign, mars: c.mars.sign, approx: c.approx,
  };
};

/** Ações de servidor são endpoints públicos: exigem login e têm limite por pessoa. */
async function guard() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");
  if (!(await rateLimit(`reveal:${userId}`, 120, 60)).ok) throw new Error("Muitas tentativas");
}

export async function revealSign(d: string, t: string | undefined, who: string, viewer: string) {
  await guard();
  return view(date.parse(d), time.parse(t ?? ""), asWho(who), asWho(viewer));
}

export async function revealCouple(himDate: string, himTime: string, herDate: string, herTime: string, viewer: string) {
  await guard();
  const v = asWho(viewer);
  const a = chartFor(date.parse(himDate), time.parse(himTime) || null);
  const b = chartFor(date.parse(herDate), time.parse(herTime) || null);
  return {
    him: view(himDate, himTime, "him", v),
    her: view(herDate, herTime, "her", v),
    couple: compatibility(a, b, v),
  };
}
