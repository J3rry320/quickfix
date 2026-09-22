import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import {
  getDbBrands,
  getDbServices,
  getAllDbModels,
} from "@/lib/db/catalogue";
import { getStaticBlogSlugs } from "@/lib/db/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const locales = siteConfig.supportedLocales;

  // Static Hub and Core Pages
  const staticRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/services", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/brands", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/book-repair", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/blogs", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/reviews", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/track", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Dynamic MongoDB Collections
  const [brands, services, models, blogSlugs] = await Promise.all([
    getDbBrands(),
    getDbServices(),
    getAllDbModels(),
    getStaticBlogSlugs(),
  ]);

  const localitySlugs = LOCALITIES_CATALOG.map((loc) => loc.slug);

  // Combine All Dynamic Canonical Routes
  const allRoutes = [
    ...staticRoutes,
    ...services.map((srv) => ({
      path: `/services/${srv.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...brands.map((brand) => ({
      path: `/brands/${brand.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...models
      .filter((m) => m.brand && typeof m.brand === "object" && (m.brand as { slug?: string }).slug)
      .map((m) => ({
        path: `/brands/${(m.brand as { slug: string }).slug}/${m.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...blogSlugs.map((slug) => ({
      path: `/blogs/${slug}`,
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
