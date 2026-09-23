import type { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, Check, X, Phone, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getServicesHubSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema, getItemListSchema } from "@/config/jsonld";
import { getDbServices, getDbBrands } from "@/lib/db/catalogue";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import { Container, Section, CTABlock, PageHero } from "@/components/ui";
import { ServiceCard } from "@/components/services";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getServicesHubSeoMetadata({ locale });
}

export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");
  cacheTag("services");

  const { locale } = await params;

  const [services, brands, t] = await Promise.all([
    getDbServices(),
    getDbBrands(),
    getTranslations({ locale, namespace: "ServicesHub" }),
  ]);

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.services"), url: `${siteUrl}/${locale}/services` },
  ]);

  const comparisonFeatures = [
    {
      feature: t("comparison.features.logistics.name"),
      quickfix: t("comparison.features.logistics.quickfix"),
      localShop: t("comparison.features.logistics.localShop"),
    },
    {
      feature: t("comparison.features.security.name"),
      quickfix: t("comparison.features.security.quickfix"),
      localShop: t("comparison.features.security.localShop"),
    },
    {
      feature: t("comparison.features.turnaround.name"),
      quickfix: t("comparison.features.turnaround.quickfix"),
      localShop: t("comparison.features.turnaround.localShop"),
    },
    {
      feature: t("comparison.features.parts.name"),
      quickfix: t("comparison.features.parts.quickfix"),
      localShop: t("comparison.features.parts.localShop"),
    },
    {
      feature: t("comparison.features.warranty.name"),
      quickfix: t("comparison.features.warranty.quickfix"),
      localShop: t("comparison.features.warranty.localShop"),
    },
  ];

  const servicesCatalogSchema = getItemListSchema({
    name: "Smartphone Repair Services in Pune",
    description: "Certified doorstep smartphone pickup and lab repair services across Pune with 90-day warranty.",
    url: `${siteUrl}/${locale}/services`,
    items: services.map((s) => ({
      name: s.name,
      url: `${siteUrl}/${locale}/services/${s.slug}`,
      description: s.description,
      image: s.image
        ? s.image.startsWith("http://") || s.image.startsWith("https://")
          ? s.image
          : `${siteUrl}${s.image.startsWith("/") ? "" : "/"}${s.image}`
        : `${siteUrl}${siteConfig.defaultOgImage}`,
    })),
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, servicesCatalogSchema]}
        id="services-hub-structured-data"
      />

      {/* 1. Unified Page Hero (Clean, centered without media) */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.services") },
        ]}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        align="center"
        highlights={[
          {
            icon: Wrench,
            label: t("hero.highlights.repairs.label"),
            value: t("hero.highlights.repairs.value", { count: services.length }),
            color: "text-flash-orange-text",
          },
          {
            icon: Clock,
            label: t("hero.highlights.turnaround.label"),
            value: t("hero.highlights.turnaround.value"),
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty.label"),
            value: t("hero.highlights.warranty.value"),
            color: "text-success-text",
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg shadow-flash-orange/20 hover:bg-flash-orange-hover active:scale-95 transition-all cursor-pointer"
            >
              <span>{t("hero.actions.bookRepair")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>{t("hero.actions.callHelpline", { phone: contactConfig.phone.display })}</span>
            </a>
          </div>
        }
      />

      {/* 2. All Services Grid (Loaded from DB) */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("grid.title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("grid.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {services.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                service={service}
                fromPriceLabel={t("grid.fromPrice", { price: service.startingPrice })}
                estimatedTimeLabel={t("grid.estimatedTime", { minutes: service.estimatedTimeMinutes })}
                warrantyDaysLabel={t("grid.warrantyDays", { days: service.warrantyDays })}
                priority={idx < 3}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Doorstep Pickup Assurance Banner */}
      <Section variant="muted" padding="default">
        <Container>
          <DoorstepPickupAssurance
            videoSrc="/assets/videos/quickfixabout.mp4"
            posterSrc="/logo.png"
          />
        </Container>
      </Section>

      {/* 4. Doorstep Repair vs Local Shop Comparison */}
      <Section variant="white" padding="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("comparison.title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("comparison.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border-default shadow-xs bg-clean-white">
            <div className="grid grid-cols-12 bg-tech-slate text-clean-white p-4 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-4">{t("comparison.headers.feature")}</div>
              <div className="col-span-4 sm:col-span-4 text-success-light font-black">{t("comparison.headers.quickfix")}</div>
              <div className="col-span-4 sm:col-span-4 text-border-strong font-bold">{t("comparison.headers.localShop")}</div>
            </div>

            <div className="divide-y divide-border-default text-xs sm:text-sm">
              {comparisonFeatures.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center gap-2 hover:bg-mist-gray/40 transition-colors">
                  <div className="col-span-4 sm:col-span-4 font-bold text-tech-slate">
                    {row.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-success-text font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    <span>{row.quickfix}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-text-secondary flex items-center gap-1.5">
                    <X className="h-4 w-4 text-error shrink-0" />
                    <span>{row.localShop}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Supported Smartphone Brands (Loaded from DB) */}
      <BrandsShowcase
        initialBrands={brands}
        variant="muted"
      />

      {/* 6. CTA */}
      <Section variant="white" padding="default">
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
