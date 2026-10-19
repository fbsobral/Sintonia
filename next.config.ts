import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // lint roda localmente; no deploy pulamos para o build ser mais rápido
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};
export default nextConfig;
