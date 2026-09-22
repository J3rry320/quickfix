import type { Metadata } from "next";
import { Smartphone, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBrandsHubSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema, getItemListSchema } from "@/config/jsonld";
import { getDbBrands, getAllDbModels, getPopularDbModels } from "@/lib/db/catalogue";
import JsonLd from "@/components/seo/JsonLd";
import {
  Container,
  Section,
  CTABlock,
  PageHero,
  AspectBox,
  BrandLogo,
} from "@/components/ui";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import { ModelsScrollSection } from "@/components/models";
import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getBrandsHubSeoMetadata({ locale });
}

export default async function BrandsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");
  cacheTag("brands");

  const { locale } = await params;

  const [brands, allModels, popularModels, t] = await Promise.all([
    getDbBrands(),
    getAllDbModels(),
    getPopularDbModels(24),
    getTranslations({ locale, namespace: "BrandsHub" }),
  ]);

  // Filter brands that actually have models in popularModels for the filter tabs
  const popularBrandSlugs = new Set(
    popularModels
      .map((m) =>
        typeof m.brand === "object" && m.brand
          ? (m.brand as { slug: string }).slug
          : typeof m.brand === "string"
            ? m.brand.toLowerCase()
            : ""
      )
      .filter(Boolean)
  );
  const supportedPopularBrands = brands.filter((b) =>
    popularBrandSlugs.has(b.slug)
  );

  // Group models by brand id / slug
  const modelsByBrandSlug: Record<string, string[]> = {};
  for (const model of allModels) {
    const bSlug =
      typeof model.brand === "object" && model.brand ? (model.brand as { slug: string }).slug : "";
    if (bSlug) {
      if (!modelsByBrandSlug[bSlug]) modelsByBrandSlug[bSlug] = [];
      modelsByBrandSlug[bSlug].push(model.name);
    }
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.brands"), url: `${siteUrl}/${locale}/brands` },
  ]);

  const brandsCatalogSchema = getItemListSchema({
    name: "Smartphone Brands Repaired in Pune",
    description: "All smartphone brands supported for certified doorstep pickup and repair across Pune by Quick Fix",
    url: `${siteUrl}/${locale}/brands`,
    items: brands.map((b) => ({
      name: `${b.name} Repair`,
      url: `${siteUrl}/${locale}/brands/${b.slug}`,
      description: `Doorstep mobile repair and genuine OEM parts for ${b.name} devices in Pune`,
      image: b.logoUrl
        ? b.logoUrl.startsWith("http://") || b.logoUrl.startsWith("https://")
          ? b.logoUrl
          : `${siteUrl}${b.logoUrl.startsWith("/") ? "" : "/"}${b.logoUrl}`
        : `${siteUrl}${siteConfig.defaultOgImage}`,
    })),
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, brandsCatalogSchema]}
        id="brands-hub-structured-data"
      />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.brands") },
        ]}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        align="left"
        media={
          <AspectBox
            aspectRatio="4/3"
            variant="solid"
            badge={t("hero.media.badge")}
            fallbackType="brand"
            title={t("hero.media.title")}
            label={t("hero.media.label")}
            className="shadow-xl"
          />
        }
        highlights={[
          {
            icon: Smartphone,
            label: t("hero.highlights.brands"),
            value: t("hero.highlights.brandsCount", { count: brands.length }),
            color: "text-flash-orange",
          },
          {
            icon: Zap,
            label: t("hero.highlights.models"),
            value: t("hero.highlights.modelsCount", { count: allModels.length }),
            color: "text-electric-amber",
          },
          {
            icon: Clock,
            label: t("hero.highlights.turnaround"),
            value: t("hero.highlights.turnaroundVal"),
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty"),
            value: t("hero.highlights.warrantyVal"),
            color: "text-success",
          },
        ]}
      />

      {/* 2. Quick Brand Strip Reused from Landing */}
      <BrandsShowcase
        initialBrands={brands}
        title={t("showcase.title")}
        subtitle={t("showcase.subtitle")}
        badge={t("showcase.badge")}
        variant="white"
        showBorder={true}
      />

      {/* 3. Brands Directory Grid (Enhanced with DB Logos, Badges, and Clean Card Styling) */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("directory.title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("directory.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.map((brand) => {
              const brandModels = modelsByBrandSlug[brand.slug] || [];
              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border-default bg-clean-white p-5 sm:p-6 shadow-xs hover:border-flash-orange/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle ambient hover background accent */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-flash-orange/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Brand Header with Database Logo & Popular Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <BrandLogo
                          src={brand.logoUrl}
                          brandName={brand.name}
                          size="md"
                          className="shadow-2xs border border-border-default bg-clean-white"
                        />
                        <div>
                          <h3 className="font-heading text-base sm:text-lg font-extrabold text-tech-slate group-hover:text-flash-orange transition-colors">
                            {brand.name}
                          </h3>
                          <span className="text-2xs font-semibold text-text-muted">
                            {brandModels.length > 0
                              ? t("directory.modelsSupported", { count: brandModels.length })
                              : t("directory.allModelsSupported")}
                          </span>
                        </div>
                      </div>

                      {brand.isPopular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-flash-orange/10 px-2.5 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-flash-orange border border-flash-orange/20 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-flash-orange animate-pulse" />
                          <span>{t("directory.popularBadge")}</span>
                        </span>
                      )}
                    </div>

                    {/* Popular Models Tags Preview */}
                    {brandModels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {brandModels.slice(0, 4).map((modelName) => (
                          <span
                            key={modelName}
                            className="text-[11px] font-semibold text-text-secondary bg-mist-gray/90 group-hover:bg-mist-gray border border-border-default/60 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {modelName}
                          </span>
                        ))}
                        {brandModels.length > 4 && (
                          <span className="text-[11px] font-bold text-flash-orange bg-flash-orange/5 border border-flash-orange/20 px-2 py-1 rounded-lg">
                            {t("directory.moreModels", { count: brandModels.length - 4 })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-3.5 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-flash-orange">
                    <span>{t("directory.viewModels")}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. Popular Models Across Brands */}
      {popularModels.length > 0 && (
        <ModelsScrollSection
          models={popularModels}
          brands={supportedPopularBrands}
          allBrandsLabel={t("popularModels.allBrands")}
          showBrandFilter={true}
          badge={t("popularModels.badge")}
          title={t("popularModels.title")}
          subtitle={t("popularModels.subtitle")}
          sectionVariant="white"
        />
      )}

      {/* 5. Reusable CTA */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={t("cta.title")}
            subtitle={t("cta.subtitle")}
          />
        </Container>
      </Section>
    </div>
  );
}
