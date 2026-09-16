import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getTrackPageSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui";
import TrackRepairClient from "@/components/track/TrackRepairClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "track",
    locale,
    path: "/track",
  });
}

export default async function TrackRepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TrackPage" });
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const trackSchema = getTrackPageSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumb"), url: `${siteUrl}/${locale}/track` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[trackSchema, breadcrumbSchema]} id="track-structured-data" />

      {/* Compact Page Hero without eyebrows or excessive padding */}
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("breadcrumb") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        className="!pt-6 !pb-4 sm:!pt-8 sm:!pb-6 lg:!pb-6 !border-b-0"
      />

      {/* Client Component in Suspense for useSearchParams */}
      <div className="flex-1 pt-1 pb-8 sm:pb-12 bg-clean-white">
        <Suspense
          fallback={
            <div className="w-full max-w-3xl mx-auto px-4 py-8 text-center text-text-muted text-sm">
              {t("loading")}
            </div>
          }
        >
          <TrackRepairClient />
        </Suspense>
      </div>
    </div>
  );
}
