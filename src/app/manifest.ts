import type { MetadataRoute } from "next";
import { getTenant } from "@/tenants";

export default function manifest(): MetadataRoute.Manifest {
  const tenant = getTenant();
  return {
    name: tenant.brand.name,
    short_name: tenant.brand.shortName,
    description: tenant.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0807",
    theme_color: "#0b0807",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
