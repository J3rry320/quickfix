"use client";

import React from "react";
import { Smartphone, Wrench, Edit3, ArrowRight } from "lucide-react";
import { useBookingWizard } from "./BookingWizardContext";

export default function WizardDeviceSummary() {
  const { currentStage, setStage, formData, dynamicPrice } = useBookingWizard();

  // Only show once brand is chosen
  if (!formData.brand) return null;

  return (
    <div className="mb-6 rounded-2xl bg-zinc-50 border border-border-default/80 p-3.5 sm:p-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Device Chip */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-clean-white border border-border-default text-flash-orange shadow-2xs">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="block text-2xs font-semibold text-text-muted">Selected Device</span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-tech-slate truncate">
                {formData.brand} {formData.model ? `• ${formData.model}` : ""}
              </span>
              {currentStage > 1 && (
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="inline-flex items-center gap-1 text-2xs font-bold text-flash-orange hover:underline cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Change</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Service Chip (Stages 2 and 3) */}
        {formData.issueDescription && currentStage === 3 && (
          <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-border-default pt-2 sm:pt-0 sm:pl-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-clean-white border border-border-default text-tech-slate shadow-2xs">
              <Wrench className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block text-2xs font-semibold text-text-muted">Repair Issue</span>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-tech-slate truncate">
                  {formData.issueDescription}
                </span>
                <button
                  type="button"
                  onClick={() => setStage(2)}
                  className="inline-flex items-center gap-1 text-2xs font-bold text-flash-orange hover:underline cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Change</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transparent Price Preview */}
        {dynamicPrice !== null && (
          <div className="ml-auto flex items-center gap-2 bg-clean-white border border-border-default px-3 py-1.5 rounded-xl shadow-2xs">
            <span className="text-2xs text-text-muted font-bold">Est. Cost:</span>
            <span className="font-heading text-sm font-black text-tech-slate tabular-nums">
              ₹{dynamicPrice.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
