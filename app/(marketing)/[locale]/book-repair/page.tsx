import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Wrench } from "lucide-react";
import StepByStepBookingWizard from "@/components/repair/StepByStepBookingWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RepairPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BookRepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "RepairPage" });

  return (
    <div className="py-10 sm:py-16 bg-mist-gray/60 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <Wrench className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-body">
            {t("subtitle")}
          </p>
        </div>

        {/* Step-by-Step Wizard */}
        <StepByStepBookingWizard />
      </div>
    </div>
  );
}
