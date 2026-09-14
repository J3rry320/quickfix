import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Smartphone, ArrowRight, Phone, ShieldCheck, Clock, CheckCircle2, Lock, Sparkles, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getBrandSeoMetadata } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { getDbBrandBySlug, getStaticBrandSlugs, getDbModelsForBrand, getDbServices } from "@/lib/db/catalogue";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, AspectBox, CTABlock, PageHero } from "@/components/ui";

export async function generateStaticParams() {
  const slugs = await getStaticBrandSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
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
  const brand = await getDbBrandBySlug(slug);

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

  const [brand, models, services] = await Promise.all([
    getDbBrandBySlug(slug),
    getDbModelsForBrand(slug),
    getDbServices(),
  ]);

  if (!brand) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Brands", url: `${siteUrl}/${locale}/brands` },
    { name: brand.name, url: `${siteUrl}/${locale}/brands/${brand.slug}` },
  ]);

  const guarantees = [
    {
      icon: ShieldCheck,
      title: "Genuine OEM-Grade Components",
      desc: `Every replacement display, battery, and flex board used for ${brand.name} matches original equipment manufacturer specs.`,
    },
    {
      icon: Lock,
      title: "Zero Passwords or Data Risk",
      desc: "Repaired right in your living room or office desk. You never give away passwords or leave your device unattended.",
    },
    {
      icon: Clock,
      title: "30-Minute Live Service",
      desc: "Fast precision disassembly and reassembly executed on antistatic mats with specialized thermal tools.",
    },
    {
      icon: Sparkles,
      title: "90-Day Replacement Warranty",
      desc: "Instant digital warranty card provided. If any touch or battery malfunction occurs, we replace it at no charge.",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id={`brand-${brand.slug}-structured-data`} />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
        title={`${brand.name} Doorstep Repair in Pune`}
        subtitle={`Professional on-site hardware repair for all ${brand.name} smartphones across Pune. Certified technicians arrive at your home or workplace equipped with antistatic workstations, OEM displays, and high-capacity battery units.`}
        highlights={[
          {
            icon: Clock,
            label: "Turnaround",
            value: "30 Mins On-Site",
            color: "text-flash-orange",
          },
          {
            icon: Lock,
            label: "Privacy",
            value: "100% Data Safe",
            color: "text-emerald-500",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: "90-Day Guarantee",
            color: "text-blue-500",
          },
          {
            icon: Zap,
            label: "Dispatch",
            value: "Within 30 Mins",
            color: "text-electric-amber",
          },
        ]}
        actions={
          <>
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
          </>
        }
        media={
          <AspectBox
            aspectRatio="4/3"
            badge={`${brand.name} Lab`}
            label={`Mobile repair toolkit and genuine components for ${brand.name}`}
            className="shadow-md"
          />
        }
      />

      {/* 2. Supported Models for this Brand (Loaded from DB) */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Select Your {brand.name} Model
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Choose your device model to view exact replacement pricing for displays, batteries, and camera lenses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {models.map((model) => (
              <Link
                key={model.slug}
                href={`/brands/${brand.slug}/${model.slug}`}
                className="p-4 rounded-xl bg-clean-white border border-zinc-200 hover:border-flash-orange hover:shadow-xs transition-all group flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-gray text-zinc-600 group-hover:text-flash-orange transition-colors">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs sm:text-sm font-bold text-tech-slate group-hover:text-flash-orange transition-colors truncate block">
                    {model.name}
                  </span>
                  {model.releaseYear && (
                    <span className="text-3xs text-text-muted font-mono">
                      {model.releaseYear}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. OEM Parts Warranty & Quality Guarantee Block */}
      <Section variant="white" padding="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Our {brand.name} Service Standards
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Why thousands of smartphone owners across Pune trust QuickFix for certified repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border-default bg-clean-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-gray text-flash-orange mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-tech-slate mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. Common Repairs for this Brand */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Popular Repairs for {brand.name} Phones
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              All services performed live on-site with zero hidden diagnostic fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((service) => (
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
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-flash-orange">
                  <span>View Details & Pricing</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. CTA Block */}
      <Section variant="white" padding="default">
        <Container>
          <CTABlock
            title={`Get Your ${brand.name} Repaired Today`}
            subtitle="Doorstep technicians ready across Pune. Book in 60 seconds with no upfront fee."
          />
        </Container>
      </Section>
    </div>
  );
}
