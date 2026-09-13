import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ShieldCheck, Smartphone, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getBrandSeoMetadata } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { BRANDS_CATALOG, SERVICES_CATALOG } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, Badge, AspectBox, CTABlock } from "@/components/ui";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const brand of BRANDS_CATALOG) {
      params.push({ locale, slug: brand.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = BRANDS_CATALOG.find((b) => b.slug === slug);

  if (!brand) {
    return {
      title: "Brand Not Found | QuickFix.in",
    };
  }

  return getBrandSeoMetadata({
    brandName: brand.name,
    locale,
    slug: brand.slug,
  });
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const brand = BRANDS_CATALOG.find((b) => b.slug === slug);
  if (!brand) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Brands", url: `${siteUrl}/${locale}/#brands` },
    { name: brand.name, url: `${siteUrl}/${locale}/brands/${brand.slug}` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id={`brand-${brand.slug}-structured-data`} />

      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-zinc-200 bg-mist-gray/60 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-flash-orange transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#brands" className="hover:text-flash-orange transition-colors">
              Brands
            </Link>
            <span>/</span>
            <span className="text-tech-slate">{brand.name}</span>
          </nav>
        </Container>
      </div>

      {/* 2. Brand Hero Section */}
      <Section variant="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="amber" size="md">
                  Official Grade OEM Parts
                </Badge>
                <Badge variant="success" size="md">
                  🛡️ {brand.warrantyDays}-Day Parts Warranty
                </Badge>
                <Badge variant="default" size="md">
                  30-Min On-Site
                </Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-tech-slate tracking-tight leading-[1.15]">
                {brand.name} Doorstep Repair in Pune
              </h1>

              <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed max-w-2xl">
                Fast, professional on-site mobile repair for all {brand.name} models across Pune. Certified technicians arrive at your home or workplace equipped with antistatic workstations, OEM displays, and high-capacity battery units.
              </p>

              {/* Highlight metrics */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-mist-gray/80 border border-zinc-200">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Turnaround
                  </span>
                  <span className="font-heading text-lg font-bold text-tech-slate">
                    30 Minutes
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-mist-gray/80 border border-zinc-200">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Data Privacy
                  </span>
                  <span className="font-heading text-lg font-bold text-emerald-700">
                    100% In-Sight
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-mist-gray/80 border border-zinc-200 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Warranty
                  </span>
                  <span className="font-heading text-lg font-bold text-tech-slate">
                    90 Days Free
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/book-repair"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
                >
                  <span>Book {brand.name} Repair</span>
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
                aspectRatio="1/1"
                badge={`${brand.name} Pune`}
                label={`${brand.name} Device Diagnostics & Repair Kit`}
                className="max-w-md mx-auto shadow-md"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Supported Popular Models Grid */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <Badge variant="accent" size="sm" className="mb-2">
              Hardware Compatibility
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Popular {brand.name} Models Repaired in Pune
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              We stock factory-grade screens, batteries, and charging ports for all major generations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {brand.popularModels.map((model, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-clean-white border border-zinc-200/90 shadow-2xs hover:border-flash-orange/40 hover:shadow-xs transition-all flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist-gray text-tech-slate">
                  <Smartphone className="h-5 w-5 text-zinc-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-bold text-tech-slate truncate">
                    {model}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Doorstep Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Common Repairs for this Brand */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <Badge variant="amber" size="sm" className="mb-2">
              Available Fixes
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Specialized Repairs for {brand.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Select your specific hardware problem to view diagnostic details, pricing, and turnaround SLAs.
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
                      ₹{service.startingPrice}+
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                    {brand.name} {service.shortTitle}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-flash-orange">
                  <span>View Pricing & SLAs</span>
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
            title={`Schedule Doorstep ${brand.name} Repair in Pune`}
            subtitle={`Technicians equipped with OEM ${brand.name} replacement modules ready to dispatch to your home or office.`}
            badge="90-Day Warranty Protection"
          />
        </Container>
      </Section>
    </div>
  );
}
