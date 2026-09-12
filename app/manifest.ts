// app/manifest.ts
// PWA: genera /manifest.webmanifest. Requiere public/icon-192.png y public/icon-512.png.

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WIN HOME CHECK",
    short_name: "WIN Check",
    description: "Diagnostica la experiencia de tu conexion en casa.",
    start_url: "/",
    display: "standalone",
    background_color: "#050B18",
    theme_color: "#050B18",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}