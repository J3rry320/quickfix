import JsonLd from "@/components/seo/JsonLd";
import {
  Container,
  CTABlock,
  HeroMediaImage,
  PageHero,
  ProcessStepGrid,
  Section,
} from "@/components/ui";
import { ModelsScrollSection } from "@/components/models";
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
import {
  ArrowRight,
  Clock,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
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
    return { title: "Model Not Found | QuickFixMobile.in" };
  }

  return getModelSeoMetadata({
    brandName: match.brand.name,
    modelName: match.model.name,
    brandSlug: slug,
    modelSlug,
    locale,
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
    return {
      slug: srv.slug,
      name: srv.name,
      description: srv.description,
      price: customPricing ? customPricing.price : srv.startingPrice,
      time: customPricing ? customPricing.time : srv.estimatedTimeMinutes,
      warrantyDays: srv.warrantyDays,
    };
  });

  const siblingModels = brandModels
    .filter((m) => m.slug !== modelSlug)
    .slice(0, 8);
  const minPrice = Math.min(...modelServices.map((s) => s.price));

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
    locale,
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
            color: "text-flash-orange",
          },
          {
            icon: ShieldCheck,
            label: t("hero.highlights.warranty"),
            value: t("hero.highlights.warrantyVal"),
            color: "text-blue-500",
          },
          // {
          //   icon: Lock,
          //   label: t("hero.highlights.privacy"),
          //   value: t("hero.highlights.privacyVal"),
          //   color: "text-emerald-500",
          // },
          {
            icon: Zap,
            label: t("hero.highlights.startingFrom"),
            value: `₹${minPrice}`,
            color: "text-electric-amber",
          },
        ]}
        actions={
          <>
            <Link
              href={`/book-repair?brand=${brand.slug}&model=${encodeURIComponent(model.name)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              <span>
                {t("hero.actions.bookModel", { modelName: model.name })}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-zinc-300 text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
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
          <HeroMediaImage
            src={model.imageUrl}
            alt={`${brand.name} ${model.name}`}
            badge={t("hero.media.badge", { modelName: model.name })}
            fallbackType="model"
            title={`${brand.name} ${model.name}`}
            subtitle={t("hero.media.fallbackLabel", { modelName: model.name })}
            aspectRatio="1/1"
            className="shadow-md"
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
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelServices.map((service) => (
              <div
                key={service.slug}
                className="p-5 rounded-2xl bg-clean-white border border-zinc-200/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-flash-orange uppercase tracking-wider">
                      {service.name.split("&")[0].trim()}
                    </span>
                    <span className="font-heading text-base font-black text-tech-slate">
                      ₹{service.price}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-tech-slate">
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
                      {t("pricing.mins", { minutes: service.time })}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {t("pricing.daysWarranty", {
                        days: service.warrantyDays,
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/book-repair?brand=${brand.slug}&model=${encodeURIComponent(model.name)}&service=${service.slug}`}
                    className="text-xs font-bold text-flash-orange hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{t("pricing.bookService")}</span>
                  </Link>
                </div>
              </div>
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
