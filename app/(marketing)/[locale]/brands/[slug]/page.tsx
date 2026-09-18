import JsonLd from "@/components/seo/JsonLd";
import {
  BrandLogo,
  Container,
  CTABlock,
  PageHero,
  Section,
} from "@/components/ui";
import { ModelsScrollSection } from "@/components/models";
import contactConfig from "@/config/contact";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { getBrandSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getDbBrandBySlug,
  getDbModelsForBrand,
  getDbServices,
  getStaticBrandSlugs,
} from "@/lib/db/catalogue";
import {
  ArrowRight,
  BatteryCharging,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  Droplets,
  Lock,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Volume2,
  Wrench,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

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
      title: "Brand Not Found | QuickFixMobile.in",
    };
  }

  return getBrandSeoMetadata({
    brandName: brand.name,
    locale,
    slug: brand.slug,
  });
}

import { cacheLife, cacheTag } from "next/cache";

function getBrandServiceIcon(slug: string, name: string) {
  const s = (slug + " " + name).toLowerCase();
  if (s.includes("battery") || s.includes("power")) return BatteryCharging;
  if (s.includes("screen") || s.includes("display") || s.includes("touch")) return Smartphone;
  if (s.includes("charging") || s.includes("port") || s.includes("flex")) return Zap;
  if (s.includes("camera") || s.includes("lens")) return Camera;
  if (s.includes("glass") || s.includes("frame") || s.includes("housing")) return Shield;
  if (s.includes("speaker") || s.includes("mic") || s.includes("earpiece") || s.includes("audio")) return Volume2;
  if (s.includes("motherboard") || s.includes("chip") || s.includes("soldering")) return Cpu;
  if (s.includes("water") || s.includes("liquid")) return Droplets;
  return Wrench;
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale, slug } = await params;
  cacheTag("brands", `brand-${slug}`);

  const [brand, models, services, t] = await Promise.all([
    getDbBrandBySlug(slug),
    getDbModelsForBrand(slug),
    getDbServices(),
    getTranslations({ locale, namespace: "BrandDetail" }),
  ]);

  if (!brand) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.brands"), url: `${siteUrl}/${locale}/brands` },
    { name: brand.name, url: `${siteUrl}/${locale}/brands/${brand.slug}` },
  ]);

  const guarantees = [
    {
      icon: ShieldCheck,
      title: t("standards.oemTitle"),
      desc: t("standards.oemDesc", { brandName: brand.name }),
    },
    {
      icon: Lock,
      title: t("standards.dataTitle"),
      desc: t("standards.dataDesc"),
    },
    {
      icon: Clock,
      title: t("standards.liveTitle"),
      desc: t("standards.liveDesc"),
    },
    {
      icon: Sparkles,
      title: t("standards.warrantyTitle"),
      desc: t("standards.warrantyDesc"),
    },
  ];

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={breadcrumbSchema}
        id={`brand-${brand.slug}-structured-data`}
      />

      {/* 1. Unified Page Hero with Small Brand Logo from DB */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.brands"), href: "/brands" },
          { label: brand.name },
        ]}
        title={
          <div className="space-y-3">
            {/* Small Brand Logo Badge Fetched from DB */}
            <div className="flex items-center gap-3">
              <BrandLogo
                src={brand.logoUrl}
                brandName={brand.name}
                size="md"
                className="shadow-md"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 text-flash-orange px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange animate-pulse" />
                <span>{t("hero.badge")}</span>
              </span>
            </div>
            <span>{t("hero.title", { brandName: brand.name })}</span>
          </div>
        }
        subtitle={t("hero.subtitle", { brandName: brand.name })}
        highlights={[
          {
            icon: Clock,
            label: t("hero.highlights.turnaround"),
            value: t("hero.highlights.turnaroundVal"),
            color: "text-flash-orange",
          },
          {
            icon: Lock,
            label: t("hero.highlights.privacy"),
            value: t("hero.highlights.privacyVal"),
            color: "text-success",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty"),
            value: t("hero.highlights.warrantyVal"),
            color: "text-info",
          },
          {
            icon: Zap,
            label: t("hero.highlights.dispatch"),
            value: t("hero.highlights.dispatchVal"),
            color: "text-electric-amber",
          },
        ]}
        actions={
          <>
            <Link
              href={`/book-repair?brand=${encodeURIComponent(brand.slug)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>
                {t("hero.actions.bookBrand", { brandName: brand.name })}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>
                {t("hero.actions.callUs", {
                  phone: contactConfig.phone.display,
                })}
              </span>
            </a>
          </>
        }
        media={
          /* Redesigned Brand Showcase Hero Card with Small Brand Logo from DB */
          <div className="relative w-full rounded-3xl bg-gradient-to-br from-mist-gray via-clean-white to-flash-orange/5 p-6 sm:p-8 border border-border-default/80 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandLogo
                  src={brand.logoUrl}
                  brandName={brand.name}
                  size="lg"
                  className="shadow-sm"
                />
                <div>
                  <h3 className="font-heading text-lg font-black text-tech-slate leading-tight">
                    {brand.name}
                  </h3>
                  <span className="text-xs text-text-muted font-medium">
                    {models.length} {t("models.viewModels")}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light text-success-text border border-success-border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified OEM</span>
              </span>
            </div>

            <div className="my-6 space-y-2 text-xs text-text-secondary bg-clean-white/80 p-4 rounded-2xl border border-border-default/60">
              <div className="flex items-center justify-between">
                <span>Certified On-Site Turnaround:</span>
                <strong className="text-tech-slate font-bold">
                  30 Mins Express
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Replacement Warranty:</span>
                <strong className="text-success font-bold">
                  90 Days Full Replacement
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Pune Service Areas:</span>
                <strong className="text-flash-orange font-bold">
                  All Pune Localities
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border-default/60 pt-3">
              <span>QuickFix Sadashiv Peth Hub</span>
              <span className="font-bold text-tech-slate">
                Zero Doorstep Travel Fee
              </span>
            </div>
          </div>
        }
      />

      {/* 2. Supported Models for this Brand (Loaded from DB, searchable & horizontally scrollable) */}
      <ModelsScrollSection
        models={models}
        title={t("models.title", { brandName: brand.name })}
        subtitle={t("models.subtitle")}
        brandSlugOverride={brand.slug}
        brandNameOverride={brand.name}
        showSearch={true}
        searchPlaceholder={t("models.searchPlaceholder", { brandName: brand.name })}
        showingCountTemplate={t("models.showingCount", {
          count: "{count}",
          total: "{total}",
          brandName: brand.name,
        })}
        emptyTitle={t("models.emptyTitle", { brandName: brand.name })}
        emptySubtitle={t("models.emptySubtitle", { brandName: brand.name })}
        clearSearchLabel={t("models.clearSearch")}
        sectionVariant="muted"
      />

      {/* 3. OEM Parts Warranty & Quality Guarantee Block */}
      <Section variant="white" padding="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("standards.title", { brandName: brand.name })}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("standards.subtitle")}
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

      {/* 4. Common Repairs for this Brand (Loaded from DB) */}
      {services && services.length > 0 && (
        <Section variant="muted" padding="default">
          <Container>
            <div className="max-w-3xl mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
                Popular Repairs for {brand.name} Phones
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary">
                All services performed live on-site with zero hidden diagnostic
                fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service) => {
                const IconComponent = getBrandServiceIcon(service.slug, service.name);
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="p-5 rounded-2xl bg-clean-white border border-border-default hover:border-flash-orange/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Icon Container + Starting Price Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist-gray text-tech-slate border border-border-default group-hover:bg-flash-orange group-hover:text-clean-white group-hover:border-flash-orange transition-all duration-200 shadow-2xs">
                          <IconComponent className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-mist-gray/90 border border-border-default/80 text-xs font-bold text-tech-slate group-hover:border-flash-orange/30 transition-colors">
                          From ₹{service.startingPrice}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Footer: Turnaround SLA & Action Link */}
                    <div className="mt-5 pt-3.5 border-t border-border-default/60 flex items-center justify-between text-xs font-bold text-flash-orange">
                      <div className="flex items-center gap-1.5 text-3xs text-text-muted font-normal">
                        <Clock className="h-3.5 w-3.5 text-flash-orange/70" />
                        <span>{service.estimatedTimeMinutes || 30} mins express</span>
                      </div>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. CTA Block */}
      <Section variant="white" padding="default">
        <Container>
          <CTABlock
            title={t("cta.title", { brandName: brand.name })}
            subtitle={t("cta.subtitle")}
          />
        </Container>
      </Section>
    </div>
  );
}
