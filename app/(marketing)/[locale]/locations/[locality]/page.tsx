import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MapPin, Clock, ShieldCheck, CheckCircle2, ArrowRight, Phone, Navigation } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getLocationSeoMetadata } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { LOCALITIES_CATALOG, SERVICES_CATALOG } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, Badge, AspectBox, CTABlock } from "@/components/ui";

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
      title: "Location Not Found | QuickFix.in",
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

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ locale: string; locality: string }>;
}) {
  const { locale, locality } = await params;
  setRequestLocale(locale);

  const loc = LOCALITIES_CATALOG.find((l) => l.slug === locality);
  if (!loc) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Pune Locations", url: `${siteUrl}/${locale}/#pune-locations` },
    { name: loc.name, url: `${siteUrl}/${locale}/locations/${loc.slug}` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id={`locality-${loc.slug}-structured-data`} />

      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-zinc-200 bg-mist-gray/60 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-flash-orange transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#pune-locations" className="hover:text-flash-orange transition-colors">
              Pune Locations
            </Link>
            <span>/</span>
            <span className="text-tech-slate">{loc.name}</span>
          </nav>
        </Container>
      </div>

      {/* 2. Locality Hero Section */}
      <Section variant="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="amber" size="md">
                  ⚡ {loc.dispatchTime} Express Dispatch
                </Badge>
                <Badge variant="default" size="md">
                  Pincode: {loc.pincode}
                </Badge>
                <Badge variant="success" size="md">
                  Zero Travel Fee
                </Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-tech-slate tracking-tight leading-[1.15]">
                Doorstep Mobile Repair in {loc.name}, Pune
              </h1>

              <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed max-w-2xl">
                Broke your smartphone screen or struggling with a dead battery in {loc.name}? QuickFix dispatches a certified technician straight to your home, office, or cafe in {loc.name} within {loc.dispatchTime}. Watch the complete repair live in 30 minutes with a 90-day warranty.
              </p>

              {/* Landmark & Dispatch Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-mist-gray/70 border border-zinc-200 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flash-orange text-clean-white">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-tech-slate block">
                    {loc.zone} Sector Dispatch
                  </span>
                  <p className="text-xs text-zinc-600">
                    Key Landmark: {loc.landmark}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/book-repair"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
                >
                  <span>Book Repair in {loc.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={`tel:${contactConfig.phone.value}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-zinc-300 text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4 text-flash-orange" />
                  <span>Call {contactConfig.phone.display}</span>
                </a>
              </div>
            </div>

            {/* Right Media AspectBox */}
            <div className="lg:col-span-5">
              <AspectBox
                aspectRatio="4/3"
                badge={`${loc.name}, Pune`}
                label={`Doorstep technician dispatch coverage map for ${loc.name} and surrounding areas`}
                className="shadow-md"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Neighborhoods & Societies Served */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <Badge variant="accent" size="sm" className="mb-2">
              Hyper-Local Coverage
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Neighborhoods We Visit in & around {loc.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Zero extra travel charges anywhere within this radius. Technician arrives with an antistatic mobile repair workstation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {loc.popularNeighborhoods.map((area, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white border border-zinc-200/90 px-3.5 py-2 text-xs sm:text-sm font-semibold text-tech-slate shadow-2xs"
              >
                <MapPin className="h-3.5 w-3.5 text-flash-orange" />
                {area}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Popular Repairs in this locality */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <Badge variant="amber" size="sm" className="mb-2">
              Available On-Demand
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Top Smartphone Repairs Ordered in {loc.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Each repair is performed live in front of you with 90-day replacement warranty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_CATALOG.slice(0, 6).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-5 rounded-2xl bg-elevated-surface border border-zinc-200/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-flash-orange uppercase tracking-wider">
                      {service.shortTitle}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      from ₹{service.startingPrice}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {service.shortTitle} in {loc.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-flash-orange">
                  <span>View Details & Pricing</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={`Get Your Phone Fixed at Your Doorstep in ${loc.name}`}
            subtitle={`Technicians active in ${loc.zone}. Book in 60 seconds or call our central Pune hotline.`}
            badge={`${loc.dispatchTime} Arrival Guarantee`}
          />
        </Container>
      </Section>
    </div>
  );
}
