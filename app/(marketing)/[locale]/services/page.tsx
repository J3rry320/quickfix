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
import { Container, Section, CTABlock, PageHero, AspectBox } from "@/components/ui";

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

      {/* 1. Unified Page Hero with Media */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.services") },
        ]}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        align="left"
        media={
          <AspectBox
            aspectRatio="4/3"
            variant="solid"
            badge={t("hero.media.badge")}
            fallbackType="service"
            title={t("hero.media.title")}
            label={t("hero.media.label")}
            className="shadow-xl"
          />
        }
        highlights={[
          {
            icon: Wrench,
            label: t("hero.highlights.repairs.label"),
            value: t("hero.highlights.repairs.value", { count: services.length }),
            color: "text-flash-orange",
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
            color: "text-success",
          },
        ]}
        actions={
          <>
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>{t("hero.actions.bookRepair")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>{t("hero.actions.callHelpline", { phone: contactConfig.phone.display })}</span>
            </a>
          </>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-5 rounded-2xl bg-clean-white border border-border-default/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-flash-orange uppercase tracking-wider">
                      {service.name.split("&")[0].trim()}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {t("grid.fromPrice", { price: service.startingPrice })}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-text-muted font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t("grid.estimatedTime", { minutes: service.estimatedTimeMinutes })}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {t("grid.warrantyDays", { days: service.warrantyDays })}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-flash-orange group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Doorstep Pickup Assurance Banner */}
      <Section variant="muted" padding="default">
        <Container>
          <DoorstepPickupAssurance />
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
              <div className="col-span-4 sm:col-span-4 text-text-muted">{t("comparison.headers.localShop")}</div>
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
                  <div className="col-span-4 sm:col-span-4 text-text-muted flex items-center gap-1.5">
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
