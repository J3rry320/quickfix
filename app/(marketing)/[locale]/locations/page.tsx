import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";
import {
  Navigation,
  Zap,
  ShieldCheck,
  Tag,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getLocationsHubSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema, getItemListSchema } from "@/config/jsonld";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";
import { getDbServices, getDbBrands } from "@/lib/db/catalogue";
import JsonLd from "@/components/seo/JsonLd";
import {
  Container,
  Section,
  CTABlock,
  PageHero,
  CoverageMapView,
} from "@/components/ui";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import LocationsDirectoryClient from "@/components/locations/LocationsDirectoryClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getLocationsHubSeoMetadata({ locale });
}

export default async function LocationsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");
  cacheTag("locations");

  const { locale } = await params;

  const [services, brands, t] = await Promise.all([
    getDbServices(),
    getDbBrands(),
    getTranslations({ locale, namespace: "LocationsHub" }),
  ]);

  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.locations"), url: `${siteUrl}/${locale}/locations` },
  ]);

  const locationsCatalogSchema = getItemListSchema({
    name: "Doorstep Mobile Repair Service Areas in Pune",
    description:
      "Certified doorstep smartphone pickup and lab repair services across 30+ Pune localities with 90-day warranty.",
    url: `${siteUrl}/${locale}/locations`,
    items: LOCALITIES_CATALOG.map((loc) => ({
      name: `Mobile Repair in ${loc.name}, Pune`,
      url: `${siteUrl}/${locale}/locations/${loc.slug}`,
      description: `Rapid doorstep pickup within ${loc.dispatchTime} in ${loc.name}, Pune (${loc.zone}). Cleanroom lab repair in Sadashiv Peth with 90-day warranty.`,
    })),
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, locationsCatalogSchema]}
        id="locations-hub-structured-data"
      />

      {/* 1. Page Hero with Coverage Map */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.locations") },
        ]}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        highlights={[
          {
            icon: Navigation,
            label: t("hero.highlights.zones.label"),
            value: t("hero.highlights.zones.value"),
            color: "text-flash-orange",
          },
          {
            icon: Zap,
            label: t("hero.highlights.dispatch.label"),
            value: t("hero.highlights.dispatch.value"),
            color: "text-electric-amber",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty.label"),
            value: t("hero.highlights.warranty.value"),
            color: "text-success",
          },
          {
            icon: Tag,
            label: t("hero.highlights.pricing.label"),
            value: t("hero.highlights.pricing.value"),
            color: "text-info",
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
              <span>
                {t("hero.actions.callHelpline", {
                  phone: contactConfig.phone.display,
                })}
              </span>
            </a>
          </>
        }
        media={
          <CoverageMapView
            localityName="Pune City"
            zoneName="5 Zones"
            dispatchTime="15-40 Mins"
            pincode="411030"
          />
        }
      />

      {/* 2. Interactive Locality Directory with Search and Zone Filter */}
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

          <LocationsDirectoryClient localities={LOCALITIES_CATALOG} />
        </Container>
      </Section>

      {/* 3. Top Smartphone Repairs Available Across Localities */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("repairs.title")}
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
                      from ₹{service.startingPrice}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-flash-orange">
                  <span>View Details & Pricing</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Supported Smartphone Brands */}
      <BrandsShowcase
        initialBrands={brands}
        title={t("brands.title")}
        subtitle={t("brands.subtitle")}
        variant="muted"
      />

      {/* 5. Cleanroom Lab & Doorstep Pickup Assurance */}
      <DoorstepPickupAssurance
        variant="section"
        videoSrc="/assets/videos/quickfixabout.mp4"
        posterSrc="/logo.png"
      />

      {/* 6. Reusable Call to Action Block */}
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
