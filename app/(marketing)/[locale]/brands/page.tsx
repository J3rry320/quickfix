import type { Metadata } from "next";
import { Smartphone, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBrandsHubSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { getDbBrands, getAllDbModels, getPopularDbModels } from "@/lib/db/catalogue";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, CTABlock, PageHero } from "@/components/ui";
import { ModelsScrollSection } from "@/components/models";

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

import { cacheLife, cacheTag } from "next/cache";

export default async function BrandsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");
  cacheTag("brands");

  const { locale } = await params;

  const [brands, allModels, popularModels] = await Promise.all([
    getDbBrands(),
    getAllDbModels(),
    getPopularDbModels(24),
  ]);

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
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Brands", url: `${siteUrl}/${locale}/brands` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id="brands-hub-structured-data" />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Brands" },
        ]}
        title="Smartphone Brands We Repair in Pune"
        subtitle="Select your phone brand to explore model-specific repairs, authentic OEM pricing estimates, and convenient doorstep pickup scheduling across Pune."
        align="center"
        highlights={[
          {
            icon: Smartphone,
            label: "Brands",
            value: `${brands.length} Brands`,
            color: "text-flash-orange",
          },
          {
            icon: Zap,
            label: "Models",
            value: `${allModels.length}+ Models`,
            color: "text-electric-amber",
          },
          {
            icon: Clock,
            label: "Turnaround",
            value: "Same-Day Return",
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: "90-Day Guarantee",
            color: "text-success",
          },
        ]}
      />

      {/* 2. Brands Directory Grid (Loaded from DB) */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => {
              const brandModels = modelsByBrandSlug[brand.slug] || [];
              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="p-5 rounded-2xl bg-clean-white border border-border-default/90 hover:border-flash-orange/50 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mist-gray border border-border-default font-heading font-black text-sm text-tech-slate">
                        {brand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-heading text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                          {brand.name}
                        </h2>
                        <span className="text-xs text-text-muted">
                          {brandModels.length > 0 ? `${brandModels.length} models supported` : "All models supported"}
                        </span>
                      </div>
                    </div>

                    {brandModels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {brandModels.slice(0, 4).map((modelName) => (
                          <span
                            key={modelName}
                            className="text-[11px] font-semibold text-text-secondary bg-mist-gray/80 px-2 py-0.5 rounded"
                          >
                            {modelName}
                          </span>
                        ))}
                        {brandModels.length > 4 && (
                          <span className="text-[11px] font-semibold text-text-muted px-2 py-0.5">
                            +{brandModels.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-flash-orange">
                    <span>View Models & Pricing</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 2.5 Popular Models Across Brands */}
      {popularModels.length > 0 && (
        <ModelsScrollSection
          models={popularModels}
          brands={brands}
          showBrandFilter={true}
          badge="Popular Across Brands"
          title="Top Repaired Phone Models in Pune"
          subtitle="Explore authentic replacement costs, genuine parts stock, and quick turnaround times for Pune's most popular smartphones."
          sectionVariant="white"
        />
      )}

      {/* 3. Reusable CTA */}
      <Section variant="white" padding="default">
        <Container>
          <CTABlock
            title="Don't See Your Specific Smartphone Model?"
            subtitle="We service all major and emerging smartphone brands in India. Book a free on-site diagnostic in Pune."
          />
        </Container>
      </Section>
    </div>
  );
}
