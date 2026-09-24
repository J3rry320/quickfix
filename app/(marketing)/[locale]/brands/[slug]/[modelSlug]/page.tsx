import { ModelsScrollSection } from "@/components/models";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import JsonLd from "@/components/seo/JsonLd";
import {
  AspectBox,
  Container,
  CTABlock,
  PageHero,
  ProcessStepGrid,
  Section,
} from "@/components/ui";
import { ServiceCard } from "@/components/services";
import contactConfig from "@/config/contact";
import { getBreadcrumbSchema, getModelDetailPageSchema } from "@/config/jsonld";
import { getModelSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getDbModelBySlug,
  getDbModelsForBrand,
  getDbServices,
  getStaticModelParams,
} from "@/lib/db/catalogue";
import { ArrowRight, Clock, Phone, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const modelParams = await getStaticModelParams();
  const params: { locale: string; slug: string; modelSlug: string }[] = [];
  for (const locale of routing.locales) {
    for (const item of modelParams) {
      params.push({
        locale,
        slug: item.slug,
        modelSlug: item.modelSlug,
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; modelSlug: string }>;
}): Promise<Metadata> {
  const { locale, slug, modelSlug } = await params;
  const match = await getDbModelBySlug(slug, modelSlug);

  if (!match) {
    return { title: "Model Not Found | Quick Fix" };
  }

  const modelImage =
    match.model.imageUrl || match.brand.logoUrl || siteConfig.defaultOgImage;

  return getModelSeoMetadata({
    brandName: match.brand.name,
    modelName: match.model.name,
    brandSlug: slug,
    modelSlug,
    locale,
    image: modelImage,
  });
}

import { cacheLife, cacheTag } from "next/cache";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; modelSlug: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale, slug, modelSlug } = await params;
  cacheTag("models", `model-${modelSlug}`);

  const [match, allServices, brandModels, t] = await Promise.all([
    getDbModelBySlug(slug, modelSlug),
    getDbServices(),
    getDbModelsForBrand(slug),
    getTranslations({ locale, namespace: "ModelDetail" }),
  ]);

  if (!match) {
    notFound();
  }

  const { brand, model } = match;

  // Combine model's explicit service pricing with all global services
  const pricingMap = new Map<string, { price: number; time: number }>();
  if (Array.isArray(model.servicePricing)) {
    for (const sp of model.servicePricing) {
      if (sp.service && typeof sp.service === "object" && sp.service.slug) {
        pricingMap.set(sp.service.slug, {
          price: sp.price,
          time: sp.estimatedTimeMinutes || 30,
        });
      }
    }
  }

  const modelServices = allServices.map((srv) => {
    const customPricing = pricingMap.get(srv.slug);
    const price = customPricing ? customPricing.price : srv.startingPrice;
    const time = customPricing ? customPricing.time : srv.estimatedTimeMinutes;
    return {
      _id: srv._id,
      slug: srv.slug,
      name: srv.name,
      description: srv.description,
      image: srv.image,
      isPopular: srv.isPopular,
      price,
      startingPrice: price,
      time,
      estimatedTimeMinutes: time,
      warrantyDays: srv.warrantyDays,
    };
  });

  const siblingModels = brandModels
    .filter((m) => m.slug !== modelSlug)
    .slice(0, 8);
  const prices = modelServices
    .map((s) => s.price)
    .filter((p) => typeof p === "number" && !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 699;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 4999;
  const offerCount = modelServices.length > 0 ? modelServices.length : 6;

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.brands"), url: `${siteUrl}/${locale}/brands` },
    { name: brand.name, url: `${siteUrl}/${locale}/brands/${brand.slug}` },
    {
      name: model.name,
      url: `${siteUrl}/${locale}/brands/${brand.slug}/${model.slug}`,
    },
  ]);

  const productSchema = getModelDetailPageSchema({
    brandName: brand.name,
    modelName: model.name,
    brandSlug: brand.slug,
    modelSlug: model.slug,
    startingPrice: minPrice,
    highPrice: maxPrice,
    offerCount,
    locale,
    image: model.imageUrl || brand.logoUrl || siteConfig.defaultOgImage,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, productSchema]}
        id={`model-${model.slug}-structured-data`}
      />

      {/* 1. Unified Page Hero with Model Image from DB & Fallback */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.brands"), href: "/brands" },
          { label: brand.name, href: `/brands/${brand.slug}` },
          { label: model.name },
        ]}
        title={t("hero.title", { modelName: model.name })}
        subtitle={t("hero.subtitle", { modelName: model.name })}
        highlights={[
          {
            icon: Clock,
            label: t("hero.highlights.turnaround"),
            value: t("hero.highlights.turnaroundVal"),
            color: "text-flash-orange-text",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty"),
            value: t("hero.highlights.warrantyVal"),
            color: "text-info",
          },
          // {
          //   icon: Lock,
          //   label: t("hero.highlights.privacy"),
          //   value: t("hero.highlights.privacyVal"),
          //   color: "text-success",
          // },
          {
            icon: Zap,
            label: t("hero.highlights.startingFrom"),
            value: `₹${minPrice}`,
            color: "text-electric-amber-text",
          },
        ]}
        actions={
          <>
            <Link
              href={`/book-repair?brand=${brand.slug}&model=${encodeURIComponent(model.name)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>
                {t("hero.actions.bookModel", { modelName: model.name })}
              </span>
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
          <AspectBox
            src={model.imageUrl}
            alt={`${brand.name} ${model.name}`}
            badge={t("hero.media.badge", { modelName: model.name })}
            fallbackType="model"
            title={`${brand.name} ${model.name}`}
            label={t("hero.media.fallbackLabel", { modelName: model.name })}
            aspectRatio="4/3"
            className="shadow-md"
            preload={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 512px"
          />
        }
      />

      {/* 2. Model Repair Pricing Catalog */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("pricing.title", { modelName: model.name })}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {modelServices.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                service={service}
                href={`/book-repair?brand=${brand.slug}&model=${encodeURIComponent(model.name)}&service=${service.slug}`}
                fromPriceLabel={`₹${service.startingPrice}`}
                estimatedTimeLabel={t("pricing.mins", {
                  minutes: service.estimatedTimeMinutes,
                })}
                warrantyDaysLabel={t("pricing.daysWarranty", {
                  days: service.warrantyDays,
                })}
                actionLabel={t("pricing.bookService").replace(/→|\s*→/g, "").trim()}
                priority={idx < 3}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. 4-Step Standardized Doorstep Process */}
      <Section variant="white" padding="default">
        <Container>
          <ProcessStepGrid
            title={`How ${model.name} Doorstep Pickup & Repair Works`}
            subtitle="Secure doorstep pickup, precision cleanroom repair in Sadashiv Peth, and safe same-day return."
          />
        </Container>
      </Section>

      {/* 4. Other Models by Brand (Loaded from DB, horizontally scrollable) */}
      {siblingModels.length > 0 && (
        <ModelsScrollSection
          models={siblingModels}
          title={t("siblings.title", { brandName: brand.name })}
          subtitle={t("siblings.subtitle")}
          brandSlugOverride={brand.slug}
          brandNameOverride={brand.name}
          sectionVariant="muted"
        />
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
            title={t("cta.title", { modelName: model.name })}
            subtitle={t("cta.subtitle")}
          />
        </Container>
      </Section>
    </div>
  );
}
