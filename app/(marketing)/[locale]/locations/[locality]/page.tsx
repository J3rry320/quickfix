import JsonLd from "@/components/seo/JsonLd";
import {
  Container,
  CoverageMapView,
  CTABlock,
  PageHero,
  Section,
} from "@/components/ui";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";
import { getBreadcrumbSchema, getLocalityServiceSchema } from "@/config/jsonld";
import { getLocationSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getDbServices, getDbBrands } from "@/lib/db/catalogue";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import {
  ArrowRight,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { locale: string; locality: string }[] = [];
  for (const locale of routing.locales) {
    for (const loc of LOCALITIES_CATALOG) {
      params.push({ locale, locality: loc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; locality: string }>;
}): Promise<Metadata> {
  const { locale, locality } = await params;
  const loc = LOCALITIES_CATALOG.find((l) => l.slug === locality);

  if (!loc) {
    return {
      title: "Location Not Found | Quick Fix",
    };
  }

  return getLocationSeoMetadata({
    localityName: loc.name,
    zoneName: loc.zone,
    dispatchTime: loc.dispatchTime,
    locale,
    slug: loc.slug,
    image: `/locations/${loc.slug}/opengraph-image`,
  });
}

import { cacheLife, cacheTag } from "next/cache";

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ locale: string; locality: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale, locality } = await params;
  cacheTag("locations", `location-${locality}`, "brands");

  const loc = LOCALITIES_CATALOG.find((l) => l.slug === locality);
  if (!loc) {
    notFound();
  }

  const [services, brands, t] = await Promise.all([
    getDbServices(),
    getDbBrands(),
    getTranslations({ locale, namespace: "LocalityPage" }),
  ]);

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: loc.name, url: `${siteUrl}/${locale}/locations/${loc.slug}` },
  ]);

  const localityServiceSchema = getLocalityServiceSchema({
    localityName: loc.name,
    zoneName: loc.zone,
    dispatchTime: loc.dispatchTime,
    slug: loc.slug,
    locale,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, localityServiceSchema]}
        id={`locality-${loc.slug}-structured-data`}
      />

      {/* 1. Unified Page Hero with Clean Coverage Map View */}
      <PageHero
        breadcrumbs={[{ label: t("breadcrumbs.home"), href: "/" }, { label: loc.name }]}
        title={t("hero.title", { name: loc.name })}
        subtitle={t("hero.subtitle", {
          name: loc.name,
          dispatchTime: loc.dispatchTime,
        })}
        highlights={[
          {
            icon: Navigation,
            label: t("hero.dispatchZone"),
            value: loc.zone,
            color: "text-flash-orange",
          },
          {
            icon: Zap,
            label: t("hero.pickupSla"),
            value: loc.dispatchTime,
            color: "text-electric-amber",
          },
          {
            icon: MapPin,
            label: t("hero.landmark"),
            value: loc.landmark,
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: t("hero.warranty"),
            value: t("hero.warrantyValue"),
            color: "text-success",
          },
        ]}
        actions={
          <>
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>{t("hero.bookPickup", { name: loc.name })}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>{t("hero.callNow", { phone: contactConfig.phone.display })}</span>
            </a>
          </>
        }
        media={
          <CoverageMapView
            localityName={loc.name}
            zoneName={loc.zone}
            dispatchTime={loc.dispatchTime}
            pincode={loc.pincode}
          />
        }
      />

      {/* 2. Neighborhoods & Societies Served */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("neighborhoods.title", { name: loc.name })}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("neighborhoods.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {loc.popularNeighborhoods.map((area, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white border border-border-default px-3.5 py-2 text-xs font-semibold text-tech-slate shadow-2xs"
              >
                <MapPin className="h-3.5 w-3.5 text-flash-orange shrink-0" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Popular Repairs in this locality (Loaded from DB) */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("repairs.title", { name: loc.name })}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("repairs.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-5 rounded-2xl bg-elevated-surface border border-border-default/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-flash-orange uppercase tracking-wider">
                      {service.name.split("&")[0].trim()}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {t("repairs.fromPrice", { price: service.startingPrice })}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {t("repairs.serviceInLocality", {
                      serviceName: service.name,
                      name: loc.name,
                    })}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-flash-orange">
                  <span>{t("repairs.viewDetails")}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Supported Smartphone Brands in Locality */}
      <BrandsShowcase
        initialBrands={brands}
        title={t("brands.title", { name: loc.name })}
        subtitle={t("brands.subtitle", { name: loc.name, zone: loc.zone })}
        variant="white"
      />

      {/* 4.5 Cleanroom Lab & Doorstep Pickup Assurance */}
      <DoorstepPickupAssurance
        variant="section"
        videoSrc="/assets/videos/quickfixabout.mp4"
        posterSrc="/logo.png"
      />

      {/* 5. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={t("cta.title", { name: loc.name })}
            subtitle={t("cta.subtitle", { zone: loc.zone })}
          />
        </Container>
      </Section>
    </div>
  );
}
