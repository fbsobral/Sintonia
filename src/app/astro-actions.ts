"use server";

import { z } from "zod";
import { chartFor, SIGN_INFO } from "@/lib/astro";
import { compatibility } from "@/lib/synastry";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal(""));

const view = (d: string, t?: string) => {
  const c = chartFor(d, t || null);
  const i = SIGN_INFO[c.sun.sign];
  return { sign: c.sun.sign, glyph: i.glyph, element: i.element, essence: i.essence, moon: c.moon.sign, venus: c.venus.sign, mars: c.mars.sign, approx: c.approx };
};

export async function revealSign(d: string, t?: string) {
  return view(date.parse(d), time.parse(t ?? ""));
}

export async function revealCouple(himDate: string, himTime: string, herDate: string, herTime: string) {
  const a = chartFor(date.parse(himDate), time.parse(himTime) || null);
  const b = chartFor(date.parse(herDate), time.parse(herTime) || null);
  return { him: view(himDate, himTime), her: view(herDate, herTime), couple: compatibility(a, b) };
}
