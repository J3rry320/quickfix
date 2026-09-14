import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getServiceSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";
import { Breadcrumbs, SectionHeader, Skeleton } from "@/components/ui";
import { Clock, Lock, ShieldCheck, BadgeIndianRupee } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "repair",
    locale,
    path: "/book-repair",
  });
}

export default async function BookRepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "RepairPage" });

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const serviceSchema = getServiceSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title") || "Book Doorstep Repair", url: `${siteUrl}/${locale}/book-repair` },
  ]);

  return (
    <div className="py-8 sm:py-12 bg-mist-gray/40 min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[serviceSchema, breadcrumbSchema]} id="repair-structured-data" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex justify-center mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: t("title") || "Book Doorstep Repair" },
            ]}
          />
        </div>

        {/* Simplified Page Header */}
        <SectionHeader
          title={t("title") || "Book Doorstep Mobile Pickup & Repair"}
          subtitle={t("subtitle") || "Safe doorstep pickup across Pune, precision repair in our certified Sadashiv Peth lab, returned same-day."}
          className="max-w-2xl mb-6 text-center mx-auto"
        />

        {/* Streamlined Trust Strip */}
        <div className="mb-6 mx-auto max-w-2xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="font-semibold text-tech-slate">Fast Pickup</span>
            <span className="text-2xs text-text-muted">• Pune-wide</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-tech-slate">Data Protected</span>
            <span className="text-2xs text-text-muted">• Safe transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="font-semibold text-tech-slate">90-Day Warranty</span>
            <span className="text-2xs text-text-muted">• Genuine parts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BadgeIndianRupee className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-tech-slate">Free Visit</span>
            <span className="text-2xs text-text-muted">• Zero travel fee</span>
          </div>
        </div>

        {/* Step-by-Step 3-Stage Wizard */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          <StepByStepBookingWizard />
        </Suspense>
      </div>
    </div>
  );
}
