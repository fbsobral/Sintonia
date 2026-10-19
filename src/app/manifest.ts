import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sintonia",
    short_name: "Sintonia",
    description: "Entenda o momento dela e esteja em sintonia.",
    start_url: "/hoje",
    display: "standalone",
    background_color: "#0b0919",
    theme_color: "#0b0919",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
