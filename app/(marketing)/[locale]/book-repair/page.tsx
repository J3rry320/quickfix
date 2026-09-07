import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getServiceSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/landing/SectionHeader";
import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";

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
    <div className="py-10 sm:py-16 bg-mist-gray/60 min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[serviceSchema, breadcrumbSchema]} id="repair-structured-data" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="max-w-2xl mb-10"
        />

        {/* Step-by-Step Wizard */}
        <StepByStepBookingWizard />
      </div>
    </div>
  );
}
