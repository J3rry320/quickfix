import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const locales = siteConfig.supportedLocales;

  const routes = [
    {
      path: "",
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      path: "/book-repair",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/about",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
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
