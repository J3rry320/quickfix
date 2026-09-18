"use client";

import React, { useEffect, useRef } from "react";
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
    setErrorMessage,
    isSubmitting,
    bookingSuccess,
    formData,
    dynamicPrice,
    selectedService,
    resetWizard,
  } = useBookingWizard();

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [errorMessage]);

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
        {/* Error Alert */}
        {errorMessage && (
          <div
            ref={errorRef}
            role="alert"
            aria-live="assertive"
            className="mb-5 rounded-xl bg-error-light border border-error-border p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-error-text font-medium animate-in fade-in scroll-mt-24 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5 sm:mt-0" aria-hidden="true" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-xs font-bold text-error hover:text-error-text cursor-pointer shrink-0 ml-2"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
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
