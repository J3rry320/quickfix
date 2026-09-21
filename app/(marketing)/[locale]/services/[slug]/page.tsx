import JsonLd from "@/components/seo/JsonLd";
import {
  AspectBox,
  Container,
  CTABlock,
  PageHero,
  ProcessStepGrid,
  Section,
} from "@/components/ui";
import contactConfig from "@/config/contact";
import {
  getBreadcrumbSchema,
  getServiceDetailPageSchema,
} from "@/config/jsonld";
import { getServiceSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getBrandsForService,
  getDbServiceBySlug,
  getStaticServiceSlugs,
} from "@/lib/db/catalogue";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Phone,
  ShieldCheck,
  Tag,
} from "lucide-react";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { cacheLife, cacheTag } from "next/cache";

export async function generateStaticParams() {
  const slugs = await getStaticServiceSlugs();
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
  const service = await getDbServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | QuickFixMobile.in",
    };
  }

  return getServiceSeoMetadata({
    serviceName: service.name,
    startingPrice: service.startingPrice,
    turnaroundMinutes: service.estimatedTimeMinutes,
    locale,
    slug: service.slug,
    image: service.image,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale, slug } = await params;
  cacheTag("services", `service-${slug}`);

  const [service, supportedBrands, t] = await Promise.all([
    getDbServiceBySlug(slug),
    getBrandsForService(slug),
    getTranslations({ locale, namespace: "ServiceDetail" }),
  ]);

  if (!service) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.services"), url: `${siteUrl}/${locale}/services` },
    {
      name: service.name,
      url: `${siteUrl}/${locale}/services/${service.slug}`,
    },
  ]);

  const serviceSchema = getServiceDetailPageSchema({
    serviceName: service.name,
    description: service.description,
    startingPrice: service.startingPrice,
    warrantyDays: service.warrantyDays,
    estimatedTimeMinutes: service.estimatedTimeMinutes,
    slug: service.slug,
    locale,
    image: service.image,
  });

  const serviceFaqs = [
    {
      q: t("faqs.dataSecurityQ", { serviceName: service.name }),
      a: t("faqs.dataSecurityA"),
    },
    {
      q: t("faqs.warrantyQ"),
      a: t("faqs.warrantyA", {
        serviceName: service.name,
        warrantyDays: service.warrantyDays,
      }),
    },
    {
      q: t("faqs.partsQ"),
      a: t("faqs.partsA"),
    },
    {
      q: t("faqs.timeQ"),
      a: t("faqs.timeA", { minutes: service.estimatedTimeMinutes }),
    },
  ];

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, serviceSchema]}
        id={`service-${service.slug}-structured-data`}
      />

      {/* 1. Unified Page Hero with DB Image & Fallback */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.services"), href: "/services" },
          { label: service.name },
        ]}
        title={service.name}
        subtitle={service.description}
        highlights={[
          {
            icon: Tag,
            label: t("highlights.startingFrom"),
            value: `₹${service.startingPrice}`,
            color: "text-flash-orange",
          },
          {
            icon: Clock,
            label: t("highlights.turnaround"),
            value: t("highlights.turnaroundValue", {
              minutes: service.estimatedTimeMinutes,
            }),
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: t("highlights.warranty"),
            value: t("highlights.warrantyValue", {
              days: service.warrantyDays,
            }),
            color: "text-success",
          },
        ]}
        actions={
          <>
            <Link
              href={`/book-repair?service=${encodeURIComponent(service.slug)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>
                {t("actions.bookService", { serviceName: service.name })}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>
                {t("actions.callNow", { phone: contactConfig.phone.display })}
              </span>
            </a>
          </>
        }
        media={
          <AspectBox
            src={service.image}
            alt={service.name}
            fallbackType="service"
            title={service.name}
            label={t("heroMedia.fallbackLabel", {
              serviceName: service.name,
            })}
            aspectRatio="4/3"
            className="shadow-md"
            preload
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 42vw, 520px"
          />
        }
      />

      {/* 2. Common Issues Resolved (Fetched from DB) */}
      {service.commonIssues && service.commonIssues.length > 0 && (
        <Section variant="muted" padding="default">
          <Container>
            <div className="max-w-3xl mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
                {t("issues.title")}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary">
                {t("issues.subtitle", {
                  minutes: service.estimatedTimeMinutes,
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {service.commonIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-clean-white border border-border-default shadow-2xs"
                >
                  <CheckCircle2 className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-tech-slate">
                    {issue}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 3. Standardized 4-Step Doorstep Process */}
      <Section variant="white" padding="default">
        <Container>
          <ProcessStepGrid
            title={t("process.title")}
            subtitle={t("process.subtitle")}
          />
        </Container>
      </Section>

      {/* 4. Supported Brands for this Service (Fetched from DB) */}
      {supportedBrands && supportedBrands.length > 0 && (
        <BrandsShowcase
          initialBrands={supportedBrands}
          title={t("brands.title", { serviceName: service.name })}
          subtitle={t("brands.subtitle")}
          variant="muted"
        />
      )}

      {/* 5. Service FAQs */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("faqs.title", { serviceName: service.name })}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              {t("faqs.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl space-y-4">
            {serviceFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border-default bg-clean-white p-5 sm:p-6 shadow-2xs"
              >
                <h3 className="font-heading text-base font-bold text-tech-slate flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-muted leading-relaxed pl-7.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={t("cta.title", { serviceName: service.name })}
            subtitle={t("cta.subtitle")}
          />
        </Container>
      </Section>
    </div>
  );
}
