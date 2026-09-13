import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getServiceSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/landing/SectionHeader";
import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";
import { Skeleton } from "@/components/ui/Skeleton";
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
  setRequestLocale(locale);

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
        {/* Simplified Page Header */}
        <SectionHeader
          badge={t("badge") || "Express Doorstep Booking"}
          title={t("title") || "Book Your Doorstep Mobile Repair"}
          subtitle={t("subtitle") || "Certified technician arrives at your home or office in Pune with genuine replacement parts."}
          className="max-w-2xl mb-6 text-center mx-auto"
        />

        {/* Clean & Creative Trust Capsule */}
        <div className="mb-8 mx-auto max-w-3xl rounded-2xl bg-clean-white border border-border-default/80 p-2 sm:p-2.5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-center sm:text-left">
            {/* Trust Item 1 */}
            <div className="flex items-center gap-2 rounded-xl p-2 bg-mist-gray/40 hover:bg-mist-gray/70 transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-tech-slate leading-tight truncate">30-Min Fix</p>
                <p className="text-[10px] text-text-muted leading-tight truncate">At your doorstep</p>
              </div>
            </div>

            {/* Trust Item 2 */}
            <div className="flex items-center gap-2 rounded-xl p-2 bg-mist-gray/40 hover:bg-mist-gray/70 transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-tech-slate leading-tight truncate">Data Protected</p>
                <p className="text-[10px] text-text-muted leading-tight truncate">Repaired on-site</p>
              </div>
            </div>

            {/* Trust Item 3 */}
            <div className="flex items-center gap-2 rounded-xl p-2 bg-mist-gray/40 hover:bg-mist-gray/70 transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-tech-slate leading-tight truncate">90-Day Warranty</p>
                <p className="text-[10px] text-text-muted leading-tight truncate">Official warranty card</p>
              </div>
            </div>

            {/* Trust Item 4 */}
            <div className="flex items-center gap-2 rounded-xl p-2 bg-mist-gray/40 hover:bg-mist-gray/70 transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <BadgeIndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-tech-slate leading-tight truncate">Free Visit</p>
                <p className="text-[10px] text-text-muted leading-tight truncate">No travel charges</p>
              </div>
            </div>
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
