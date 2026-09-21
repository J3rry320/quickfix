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
import { getBreadcrumbSchema } from "@/config/jsonld";
import { getLocationSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getDbServices, getDbBrands } from "@/lib/db/catalogue";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import {
  ArrowRight,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
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
      title: "Location Not Found | QuickFixMobile.in",
    };
  }

  return getLocationSeoMetadata({
    localityName: loc.name,
    zoneName: loc.zone,
    dispatchTime: loc.dispatchTime,
    locale,
    slug: loc.slug,
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

  const [services, brands] = await Promise.all([
    getDbServices(),
    getDbBrands(),
  ]);

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: loc.name, url: `${siteUrl}/${locale}/locations/${loc.slug}` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={breadcrumbSchema}
        id={`locality-${loc.slug}-structured-data`}
      />

      {/* 1. Unified Page Hero with Spectacular Coverage Map View */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: loc.name }]}
        title={`Doorstep Mobile Pickup & Certified Lab Repair in ${loc.name}, Pune`}
        subtitle={`Broke your smartphone screen or struggling with a dead battery in ${loc.name}? QuickFix provides rapid doorstep pickup within ${loc.dispatchTime}, certified lab repair in Sadashiv Peth, and safe same-day return with a 90-day warranty.`}
        highlights={[
          {
            icon: Navigation,
            label: "Dispatch Zone",
            value: loc.zone,
            color: "text-flash-orange",
          },
          {
            icon: Zap,
            label: "Pickup SLA",
            value: loc.dispatchTime,
            color: "text-electric-amber",
          },
          {
            icon: MapPin,
            label: "Landmark",
            value: loc.landmark,
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: "90 Days Hassle-Free",
            color: "text-success",
          },
        ]}
        actions={
          <>
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>Book Pickup in {loc.name}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>Call {contactConfig.phone.display}</span>
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
              Neighborhoods We Visit in & around {loc.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              Zero extra travel charges anywhere within this radius. Safe
              doorstep pickup and return with tamper-proof transit bags.
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
              Top Smartphone Repairs Ordered in {loc.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              Repairs are performed by certified engineers in our Sadashiv Peth
              cleanroom lab with a 90-day replacement warranty.
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
                    {service.name} in {loc.name}
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

      {/* 4. Supported Smartphone Brands in Locality */}
      <BrandsShowcase
        initialBrands={brands}
        title={`Smartphone Brands We Service in ${loc.name}`}
        subtitle={`Doorstep pickup and certified lab repair available for all major brands across ${loc.name} and ${loc.zone}.`}
        variant="white"
      />

      {/* 5. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={`Doorstep Smartphone Pickup & Lab Repair in ${loc.name}`}
            subtitle={`Technicians active in ${loc.zone}. Book in 60 seconds or call our central Pune hotline.`}
          />
        </Container>
      </Section>
    </div>
  );
}
