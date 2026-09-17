"use client";

import React from "react";
import { AlertCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import contactConfig from "@/config/contact";
import {
  BookingWizardProvider,
  useBookingWizard,
} from "./BookingWizardContext";
import WizardProgress from "./WizardProgress";
import WizardDeviceSummary from "./WizardDeviceSummary";
import StageDeviceSelect from "./StageDeviceSelect";
import StageServiceSelect from "./StageServiceSelect";
import StageConfirmBooking from "./StageConfirmBooking";
import { FormLoadingState, FormSuccessState } from "@/components/ui/form-states";

function BookingWizardContent() {
  const t = useTranslations("RepairPage.status");
  const {
    currentStage,
    errorMessage,
    fieldErrors,
    isSubmitting,
    bookingSuccess,
    formData,
    dynamicPrice,
    selectedService,
    resetWizard,
  } = useBookingWizard();

  const showTopError = Boolean(errorMessage && Object.keys(fieldErrors).length === 0);

  if (isSubmitting) {
    return (
      <FormLoadingState
        title={t("loadingTitle")}
        subtitle={t("loadingSubtitle")}
      />
    );
  }

  if (bookingSuccess) {
    const estimatedCost = dynamicPrice || selectedService?.startingPrice || 0;
    return (
      <FormSuccessState
        title={t("successTitle")}
        subtitle={t("successSubtitle")}
        badgeLabel={t("successBadge")}
        referenceCode={bookingSuccess.bookingReference}
        referenceLabel={t("refLabel")}
        summaryDetails={[
          { label: t("summaryDevice"), value: `${formData.brand} ${formData.model}`.trim() },
          { label: t("summaryRepair"), value: formData.issueDescription || t("defaultRepairDesc") },
          { label: t("summarySlot"), value: `${formData.date} • ${formData.timeSlot}` },
          {
            label: t("summaryAddress"),
            value: formData.streetAddress?.trim() || t("tobeConfirmedOnCall"),
          },
          ...(estimatedCost > 0
            ? [
                {
                  label: t("summaryEstimatedCost"),
                  value: `₹${estimatedCost.toLocaleString("en-IN")}`,
                },
              ]
            : []),
        ]}
        onReset={resetWizard}
        resetLabel={t("bookAnother")}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 3-Stage Progress Stepper */}
      <WizardProgress />

      {/* Main Booking Card */}
      <div className="rounded-2xl border border-border-default/90 bg-clean-white p-3.5 sm:p-6 md:p-7 shadow-xs">
        {/* Error Alert (only for non-field general errors) */}
        {showTopError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-medium animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dynamic Selection Breadcrumb / Summary */}
        <WizardDeviceSummary />

        {/* Stage Content */}
        {currentStage === 1 && <StageDeviceSelect />}
        {currentStage === 2 && <StageServiceSelect />}
        {currentStage === 3 && <StageConfirmBooking />}
      </div>

      {/* Direct Phone Helpline Support */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          {t("preferCall")}{" "}
          <a
            href={`tel:${contactConfig.phone.value}`}
            className="font-bold text-flash-orange hover:underline inline-flex items-center gap-1 font-mono ml-1"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{contactConfig.phone.display}</span>
          </a>
        </p>
      </div>
    </div>
  );
}

export default function StepByStepBookingWizard() {
  return (
    <BookingWizardProvider>
      <BookingWizardContent />
    </BookingWizardProvider>
  );
}
