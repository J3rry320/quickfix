import { ModelsScrollSection } from "@/components/models";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import JsonLd from "@/components/seo/JsonLd";
import {
  AspectBox,
  BrandLogo,
  Container,
  CTABlock,
  PageHero,
  Section,
} from "@/components/ui";
import { ServiceCard } from "@/components/services";
import contactConfig from "@/config/contact";
import { getBrandServiceSchema, getBreadcrumbSchema } from "@/config/jsonld";
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
  Clock,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
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
      title: "Brand Not Found | Quick Fix",
    };
  }

  return getBrandSeoMetadata({
    brandName: brand.name,
    locale,
    slug: brand.slug,
    image: brand.logoUrl || siteConfig.defaultOgImage,
  });
}

import { cacheLife, cacheTag } from "next/cache";

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

  const brandServiceSchema = getBrandServiceSchema({
    brandName: brand.name,
    slug: brand.slug,
    logoUrl: brand.logoUrl,
    locale,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, brandServiceSchema]}
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 text-flash-orange-text px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange" />
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
            color: "text-flash-orange-text",
          },
          {
            icon: Lock,
            label: t("hero.highlights.privacy"),
            value: t("hero.highlights.privacyVal"),
            color: "text-success-text",
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
            color: "text-electric-amber-text",
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
          <AspectBox
            aspectRatio="1/1"
            src={brand.logoUrl}
            alt={brand.name}
            fallbackType="brand"
            title={t("hero.media.title", { brandName: brand.name })}
            label={t("hero.media.label")}
            className="shadow-xl"
            preload={true}
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 42vw, 520px"
          />
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
        searchPlaceholder={t("models.searchPlaceholder", {
          brandName: brand.name,
        })}
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
                {t("services.title", { brandName: brand.name })}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary">
                {t("services.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {services.slice(0, 6).map((service, idx) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  fromPriceLabel={t("services.startingFrom", {
                    price: service.startingPrice,
                  })}
                  estimatedTimeLabel={t("services.expressTime", {
                    minutes: service.estimatedTimeMinutes || 30,
                  })}
                  actionLabel={t("services.viewDetails")}
                  priority={idx < 3}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 4.5 Cleanroom Lab & Doorstep Pickup Assurance */}
      <DoorstepPickupAssurance
        variant="section"
        videoSrc="/assets/videos/quickfixabout.mp4"
        posterSrc="/logo.png"
      />

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
