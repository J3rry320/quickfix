"use client";

import React from "react";
import { Smartphone, Wrench, Edit3 } from "lucide-react";
import { useBookingWizard } from "./BookingWizardContext";

export default function WizardDeviceSummary() {
  const { currentStage, setStage, formData, dynamicPrice } = useBookingWizard();

  // Only show once brand is chosen
  if (!formData.brand) return null;

  return (
    <div className="mb-5 rounded-xl bg-zinc-50 border border-border-default/80 px-3.5 py-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Breadcrumb Items */}
        <div className="flex flex-wrap items-center gap-2 text-tech-slate min-w-0">
          {/* Device */}
          <div className="inline-flex items-center gap-1.5 font-medium">
            <Smartphone className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="font-bold text-tech-slate">
              {formData.brand}{formData.model ? ` ${formData.model}` : ""}
            </span>
            {currentStage > 1 && (
              <button
                type="button"
                onClick={() => setStage(1)}
                className="ml-1 inline-flex items-center gap-0.5 text-2xs font-bold text-flash-orange hover:underline cursor-pointer"
                aria-label="Change device"
              >
                <Edit3 className="h-2.5 w-2.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Service (Stages 2 and 3) */}
          {formData.issueDescription && currentStage === 3 && (
            <>
              <span className="text-zinc-300 font-bold select-none">•</span>
              <div className="inline-flex items-center gap-1.5 font-medium">
                <Wrench className="h-3.5 w-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                <span className="font-bold text-tech-slate">
                  {formData.issueDescription}
                </span>
                <button
                  type="button"
                  onClick={() => setStage(2)}
                  className="ml-1 inline-flex items-center gap-0.5 text-2xs font-bold text-flash-orange hover:underline cursor-pointer"
                  aria-label="Change repair issue"
                >
                  <Edit3 className="h-2.5 w-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Live Estimated Price Tag */}
        {dynamicPrice !== null && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-clean-white border border-border-default px-2.5 py-1 text-2xs shadow-2xs shrink-0">
            <span className="text-text-muted font-medium">Est. Total:</span>
            <span className="font-heading font-black text-tech-slate tabular-nums">
              ₹{dynamicPrice.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
