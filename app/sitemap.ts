import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const locales = siteConfig.supportedLocales;

  const staticRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/book-repair", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const serviceSlugs = [
    "screen-replacement",
    "battery-replacement",
    "charging-port",
    "back-glass-replacement",
    "front-rear-camera",
    "camera-glass-lens",
    "speaker-earpiece-mic",
    "motherboard-chip-level",
    "water-damage-rescue",
    "software-issue-reflash",
  ];

  const brandSlugs = [
    "apple",
    "samsung",
    "oneplus",
    "xiaomi",
    "google-pixel",
    "vivo",
    "oppo",
    "realme",
    "motorola",
    "nothing",
    "iqoo",
    "poco",
  ];

  const localitySlugs = LOCALITIES_CATALOG.map((loc) => loc.slug);

  const allRoutes = [
    ...staticRoutes,
    ...serviceSlugs.map((slug) => ({
      path: `/services/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...brandSlugs.map((slug) => ({
      path: `/brands/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...localitySlugs.map((slug) => ({
      path: `/locations/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of allRoutes) {
    for (const locale of locales) {
      const url = `${siteUrl}/${locale}${route.path}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${siteUrl}/en${route.path}`,
            hi: `${siteUrl}/hi${route.path}`,
            mr: `${siteUrl}/mr${route.path}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
