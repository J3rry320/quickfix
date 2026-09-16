import type { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, Zap, Check, X, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getServicesHubSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { getDbServices, getDbBrands } from "@/lib/db/catalogue";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import { Container, Section, CTABlock, PageHero } from "@/components/ui";

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

import { cacheLife, cacheTag } from "next/cache";

export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");
  cacheTag("services");

  const { locale } = await params;

  const [services, brands] = await Promise.all([
    getDbServices(),
    getDbBrands(),
  ]);

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Services", url: `${siteUrl}/${locale}/services` },
  ]);

  const comparisonFeatures = [
    {
      feature: "Service Logistics",
      quickfix: "Free doorstep pickup & same-day return in Pune",
      localShop: "You commute in traffic & leave phone for days",
    },
    {
      feature: "Data Security & Privacy",
      quickfix: "100% safe — zero passcodes needed & sealed transit",
      localShop: "Password required / unattended device risk",
    },
    {
      feature: "Repair Turnaround",
      quickfix: "Same-day express return to your doorstep",
      localShop: "2 to 5 days delay",
    },
    {
      feature: "Parts Quality",
      quickfix: "Certified OEM-grade factory tested",
      localShop: "Unknown duplicate / refurbished clones",
    },
    {
      feature: "Warranty",
      quickfix: "Up to 90 days replacement warranty",
      localShop: "Zero warranty or 7 days verbal",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id="services-hub-structured-data" />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        title="Smartphone Repair Services in Pune"
        subtitle="Doorstep smartphone pickup across Pune with precision repairs in our Sadashiv Peth cleanroom lab, authentic OEM parts, and a 90-day replacement warranty."
        align="center"
        highlights={[
          {
            icon: WrenchIcon,
            label: "Repairs",
            value: `${services.length} Core Services`,
            color: "text-flash-orange",
          },
          {
            icon: Clock,
            label: "Turnaround",
            value: "Same-Day Return",
            color: "text-blue-500",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: "90-Day Coverage",
            color: "text-emerald-500",
          },
          {
            icon: Zap,
            label: "Coverage",
            value: "All Pune & PCMC",
            color: "text-electric-amber",
          },
        ]}
        actions={
          <>
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              <span>Book Doorstep Repair</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-zinc-300 text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>Call Helpline: {contactConfig.phone.display}</span>
            </a>
          </>
        }
      />

      {/* 2. All Services Grid (Loaded from DB) */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              All Smartphone Repair Services
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Select any repair to inspect symptoms, turnaround times, and pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-5 rounded-2xl bg-clean-white border border-zinc-200/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-flash-orange uppercase tracking-wider">
                      {service.name.split("&")[0].trim()}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      from ₹{service.startingPrice}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.estimatedTimeMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {service.warrantyDays}-day warranty
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-flash-orange group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Doorstep Repair vs Local Shop Comparison */}
      <Section variant="white" padding="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Why Doorstep Repair Wins Over Local Shops
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Save hours of travel time and protect your confidential mobile data with live doorstep service.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border-default shadow-xs bg-clean-white">
            <div className="grid grid-cols-12 bg-tech-slate text-clean-white p-4 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-4">Service Feature</div>
              <div className="col-span-4 sm:col-span-4 text-emerald-400 font-black">QuickFix Doorstep</div>
              <div className="col-span-4 sm:col-span-4 text-zinc-400">Traditional Local Shop</div>
            </div>

            <div className="divide-y divide-border-default text-xs sm:text-sm">
              {comparisonFeatures.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center gap-2 hover:bg-mist-gray/40 transition-colors">
                  <div className="col-span-4 sm:col-span-4 font-bold text-tech-slate">
                    {row.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{row.quickfix}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-text-muted flex items-center gap-1.5">
                    <X className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{row.localShop}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Brands Quick Grid (Loaded from DB) */}
      <Section variant="muted" padding="default">
        <Container>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight mb-2">
            Repairs by Smartphone Brand
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mb-8">
            Select your smartphone brand to see model-specific repair options and pricing.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="p-4 rounded-xl bg-clean-white border border-zinc-200 hover:border-flash-orange/50 hover:shadow-xs transition-all group flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist-gray border border-zinc-200 shadow-2xs font-heading font-black text-xs text-tech-slate">
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-bold text-tech-slate group-hover:text-flash-orange transition-colors truncate">
                    {brand.name}
                  </p>
                  <span className="text-[11px] text-zinc-500">
                    Doorstep in Pune →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Doorstep Pickup Assurance Banner */}
      <Section variant="muted" padding="default">
        <Container>
          <DoorstepPickupAssurance />
        </Container>
      </Section>

      {/* 6. CTA */}
      <Section variant="white" padding="default">
        <Container>
          <CTABlock
            title="Need An Immediate On-Site Diagnostic?"
            subtitle="Our Pune dispatch hub operates 7 days a week. Book online in 60 seconds."
          />
        </Container>
      </Section>
    </div>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return <Clock className={className} />;
}
