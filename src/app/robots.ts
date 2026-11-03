import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/hoje", "/ciclos", "/astro", "/perfil", "/convidar", "/convite/", "/admin", "/onboarding", "/suspenso", "/api/", "/sign-in", "/sign-up"] }],
  };
}
