import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // lint roda localmente; no deploy pulamos para o build ser mais rápido
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Telas autenticadas e dados pessoais nunca ficam em cache de navegador/proxy
      { source: "/(hoje|ciclos|astro|perfil|convidar|admin|onboarding|suspenso)/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      // O link do convite carrega um token: sem cache, sem indexação e sem vazar em Referer
      { source: "/convite/:path*", headers: [
        { key: "Cache-Control", value: "private, no-store, max-age=0" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ] },
    ];
  },
};
export default nextConfig;
