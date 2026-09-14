"use client";

import React from "react";
import { AlertCircle, Phone } from "lucide-react";
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
  const { currentStage, errorMessage, isSubmitting, bookingSuccess, formData, resetWizard } =
    useBookingWizard();

  if (isSubmitting) {
    return (
      <FormLoadingState
        title="Confirming Your Doorstep Pickup…"
        subtitle="Reserving your appointment slot and assigning pickup fleet in Pune."
      />
    );
  }

  if (bookingSuccess) {
    return (
      <FormSuccessState
        title="Doorstep Pickup Scheduled!"
        subtitle="Our Pune dispatch team has logged your booking. A technician will call you prior to arriving for device pickup."
        badgeLabel="Pickup Fleet Assigned & Confirmed"
        referenceCode={bookingSuccess.bookingReference}
        referenceLabel="Booking Reference Code"
        summaryDetails={[
          { label: "Device", value: `${formData.brand} ${formData.model}` },
          { label: "Repair", value: formData.issueDescription || "Phone Diagnostic & Repair" },
          { label: "Scheduled Slot", value: `${formData.date} • ${formData.timeSlot}` },
          {
            label: "Doorstep Address",
            value: `${formData.streetAddress}${formData.area ? ` (${formData.area})` : ""}`,
          },
        ]}
        onReset={resetWizard}
        resetLabel="Book Another Repair"
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 3-Stage Progress Stepper */}
      <WizardProgress />

      {/* Main Booking Card */}
      <div className="rounded-3xl border border-border-default/90 bg-clean-white p-5 sm:p-8 shadow-xs">
        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-medium animate-in fade-in"
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
          Prefer booking over a call?{" "}
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
