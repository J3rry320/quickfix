"use client";

import React, { useState } from "react";
import {
  Smartphone,
  BatteryCharging,
  Zap,
  Camera,
  Volume2,
  Droplets,
  Cpu,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useBookingWizard } from "./BookingWizardContext";

function getServiceIcon(slug: string, name: string) {
  const s = `${slug} ${name}`.toLowerCase();
  if (s.includes("screen") || s.includes("display") || s.includes("touch") || s.includes("glass")) {
    return Smartphone;
  }
  if (s.includes("battery") || s.includes("drain") || s.includes("health")) {
    return BatteryCharging;
  }
  if (s.includes("charge") || s.includes("port") || s.includes("cable") || s.includes("flex")) {
    return Zap;
  }
  if (s.includes("camera") || s.includes("lens")) {
    return Camera;
  }
  if (s.includes("speaker") || s.includes("mic") || s.includes("sound") || s.includes("audio")) {
    return Volume2;
  }
  if (s.includes("water") || s.includes("liquid") || s.includes("drop")) {
    return Droplets;
  }
  if (s.includes("board") || s.includes("chip") || s.includes("cpu") || s.includes("dead")) {
    return Cpu;
  }
  return Wrench;
}

export default function StageServiceSelect() {
  const {
    services,
    isLoadingCatalog,
    selectedService,
    dynamicPrice,
    formData,
    handleSelectService,
    updateFormData,
    goToNextStage,
    goToPrevStage,
  } = useBookingWizard();

  const [showNotes, setShowNotes] = useState(Boolean(formData.additionalNotes));

  const canProceed = Boolean(formData.issueDescription.trim());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          id="stage-heading"
          tabIndex={-1}
          className="font-heading text-xl sm:text-2xl font-black text-tech-slate tracking-tight outline-hidden"
        >
          2. What needs to be repaired?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          Choose the service needed for your{" "}
          <span className="font-bold text-tech-slate">
            {formData.brand} {formData.model}
          </span>
          .
        </p>
      </div>

      {/* Services Grid */}
      {isLoadingCatalog ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-zinc-100 animate-pulse border border-zinc-200"
            />
          ))}
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label="Select repair service"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
        >
          {services.map((service) => {
            const isSelected =
              selectedService?.slug === service.slug ||
              formData.issueDescription === service.name;
            const IconComp = getServiceIcon(service.slug, service.name);

            return (
              <button
                type="button"
                key={service.slug}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectService(service)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                  isSelected
                    ? "border-flash-orange bg-flash-orange/5 text-tech-slate shadow-xs ring-2 ring-flash-orange/20"
                    : "border-border-default bg-clean-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-flash-orange text-clean-white shadow-2xs"
                        : "bg-mist-gray text-tech-slate"
                    }`}
                  >
                    <IconComp className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading text-xs sm:text-sm font-bold text-tech-slate truncate">
                      {service.name}
                    </div>
                    <div className="text-2xs text-text-muted mt-0.5 truncate">
                      ~{service.estimatedTimeMinutes || 30} mins • 90-Day Warranty
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-heading text-xs sm:text-sm font-black text-tech-slate tabular-nums block">
                    ₹{service.startingPrice.toLocaleString("en-IN")}
                  </span>
                  {isSelected ? (
                    <div className="mt-1 flex justify-end">
                      <div className="h-4 w-4 rounded-full bg-flash-orange text-clean-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xs text-text-muted">starting</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Optional Issue Description / Notes */}
      <div className="pt-1">
        {!showNotes ? (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-xs font-semibold text-flash-orange hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>+ Add specific problem notes (optional)</span>
          </button>
        ) : (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label
              htmlFor="additionalNotes"
              className="block text-xs font-bold text-tech-slate"
            >
              Additional Problem Details (Optional)
            </label>
            <textarea
              id="additionalNotes"
              rows={2}
              placeholder="e.g., Happened after dropping, touch works intermittently, lines on screen..."
              value={formData.additionalNotes || ""}
              onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
              className="w-full rounded-xl border border-border-default bg-zinc-50/70 p-3 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-zinc-400 focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-all"
            />
          </div>
        )}
      </div>

      {/* Estimate Box (Only when service is chosen) */}
      {selectedService && (
        <div className="rounded-xl bg-zinc-50 border border-border-default/80 p-3.5 sm:p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs sm:text-sm font-bold text-tech-slate truncate">
                  {selectedService.name} • 90-Day Warranty
                </p>
                <p className="text-2xs text-text-muted">Includes genuine parts, labor & free doorstep pickup</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-heading text-base sm:text-lg font-black text-tech-slate tabular-nums block">
                ₹{(dynamicPrice || selectedService.startingPrice).toLocaleString("en-IN")}
              </span>
              <span className="text-2xs text-emerald-600 font-medium block">
                Pay after service
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-border-default/70 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goToPrevStage}
          className="h-11 inline-flex items-center gap-1.5 rounded-xl border border-border-default px-4 text-xs sm:text-sm font-bold text-tech-slate hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Device</span>
        </button>

        <button
          type="button"
          onClick={goToNextStage}
          disabled={!canProceed}
          className={`h-11 inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 text-xs sm:text-sm font-bold transition-all ${
            canProceed
              ? "bg-flash-orange text-clean-white hover:bg-flash-orange-hover shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <span>Next: Schedule & Confirm</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

