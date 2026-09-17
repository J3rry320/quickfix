import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";
import JsonLd from "@/components/seo/JsonLd";
import { Skeleton } from "@/components/ui";
import { getBreadcrumbSchema, getServiceSchema } from "@/config/jsonld";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

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
    {
      name: t("title") || "Book Doorstep Repair",
      url: `${siteUrl}/${locale}/book-repair`,
    },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd
        schema={[serviceSchema, breadcrumbSchema]}
        id="repair-structured-data"
      />

      {/* 1. Distraction-Free Header */}
      <div className="border-b border-border-default/60 bg-gradient-to-b from-mist-gray/50 to-clean-white pt-5 pb-6 sm:pt-7 sm:pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Breadcrumbs */}
          <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-xl mx-auto font-body">
            You are here
          </p>
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center justify-center gap-1.5 text-2xs sm:text-xs text-text-muted mb-3"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-flash-orange transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="font-semibold text-tech-slate">{t("title")}</span>
          </nav>

          {/* Heading */}
        </div>
      </div>

      {/* 2. Interactive Booking Wizard Section */}
      <div className="py-4 sm:py-10 bg-mist-gray/30 grow">
        <div className="mx-auto max-w-5xl px-2.5 sm:px-6">
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
            <StepByStepBookingWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
