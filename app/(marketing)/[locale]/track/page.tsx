import type { Metadata } from "next";
import { Suspense } from "react";
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
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const trackSchema = getTrackPageSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Track Repair", url: `${siteUrl}/${locale}/track` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[trackSchema, breadcrumbSchema]} id="track-structured-data" />

      {/* Page Hero without eyebrows */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Track Repair" },
        ]}
        title="Track Your Device Repair"
        subtitle="Check the real-time service status of your smartphone by entering your QuickFix booking reference code."
        align="center"
      />

      {/* Client Component in Suspense for useSearchParams */}
      <div className="flex-1 py-8 sm:py-12 bg-clean-white">
        <Suspense
          fallback={
            <div className="w-full max-w-3xl mx-auto px-4 py-8 text-center text-text-muted text-sm">
              Loading tracking portal...
            </div>
          }
        >
          <TrackRepairClient />
        </Suspense>
      </div>
    </div>
  );
}
