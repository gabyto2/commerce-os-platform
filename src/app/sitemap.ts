import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://melt-brownies.netlify.app";
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
