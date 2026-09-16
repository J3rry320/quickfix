import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getServiceSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import { PageHero, Skeleton } from "@/components/ui";
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
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[serviceSchema, breadcrumbSchema]} id="repair-structured-data" />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: t("title") || "Book Doorstep Repair" },
        ]}
        title={t("title") || "Book Doorstep Mobile Pickup & Repair"}
        subtitle={t("subtitle") || "Safe doorstep pickup across Pune, precision repair in our certified Sadashiv Peth lab, returned same-day."}
        align="center"
        highlights={[
          {
            icon: Clock,
            label: "Fast Pickup",
            value: "Pune-wide",
            color: "text-flash-orange",
          },
          {
            icon: Lock,
            label: "Data Protected",
            value: "Safe transit",
            color: "text-emerald-500",
          },
          {
            icon: ShieldCheck,
            label: "90-Day Warranty",
            value: "Genuine parts",
            color: "text-blue-500",
          },
          {
            icon: BadgeIndianRupee,
            label: "Free Visit",
            value: "Zero travel fee",
            color: "text-emerald-500",
          },
        ]}
      />

      {/* 2. Interactive Booking Wizard Section */}
      <div className="py-8 sm:py-12 bg-mist-gray/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Step-by-Step 3-Stage Wizard */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          <StepByStepBookingWizard />
        </Suspense>

        {/* Reusable Doorstep Pickup & Lab Assurance Banner */}
        <div className="mt-10 sm:mt-14">
          <DoorstepPickupAssurance showCta={false} />
        </div>
      </div>
    </div>
  </div>
  );
}
