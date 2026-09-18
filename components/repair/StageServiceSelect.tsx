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
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("RepairPage.stage2");
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
  const deviceLabel = `${formData.brand} ${formData.model}`.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          id="stage-heading"
          tabIndex={-1}
          className="font-heading text-lg sm:text-xl font-black text-tech-slate tracking-tight outline-hidden"
        >
          {t("title")}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          {t("description", { device: deviceLabel })}
        </p>
      </div>

      {/* Services Selection Container */}
      <div className="sm:rounded-2xl sm:border sm:border-border-default/80 sm:bg-elevated-surface p-0 sm:p-5">
        {isLoadingCatalog ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 sm:h-20 rounded-xl bg-clean-white animate-pulse border border-border-default"
              />
            ))}
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label="Select repair service"
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4"
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
                  className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2.5 sm:gap-4 focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                    isSelected
                      ? "border-flash-orange bg-flash-orange/10 text-tech-slate shadow-xs ring-2 ring-flash-orange/20"
                      : "border-border-default bg-clean-white text-text-secondary hover:border-border-strong hover:bg-surface-hover shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                    <div
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-colors ${
                        isSelected
                          ? "bg-flash-orange text-clean-white shadow-2xs"
                          : "bg-mist-gray text-tech-slate group-hover:bg-surface-hover"
                      }`}
                    >
                      <IconComp className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-heading text-xs sm:text-sm font-bold text-tech-slate leading-snug break-words">
                        {service.name}
                      </div>
                      <div className="flex items-center gap-1 text-2xs sm:text-xs text-text-muted mt-0.5 sm:mt-1 font-medium whitespace-nowrap">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-text-muted shrink-0" aria-hidden="true" />
                        <span>{t("turnaround", { mins: service.estimatedTimeMinutes || 30 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-1 flex items-center gap-2 sm:gap-3">
                    <div>
                      <span className="font-heading text-xs sm:text-sm font-black text-tech-slate tabular-nums block">
                        ₹{service.startingPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-2xs text-text-muted font-medium block -mt-0.5 sm:mt-0">
                        {t("starting")}
                      </span>
                    </div>
                    <div
                      className={`h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-flash-orange text-clean-white shadow-2xs"
                          : "border-2 border-border-default group-hover:border-border-strong"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Optional Issue Description / Notes */}
      <div className="pt-1">
        {!showNotes ? (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-xs font-semibold text-flash-orange hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{t("addNotesBtn")}</span>
          </button>
        ) : (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label
              htmlFor="additionalNotes"
              className="block text-xs font-bold text-tech-slate"
            >
              {t("notesLabel")}
            </label>
            <textarea
              id="additionalNotes"
              rows={2}
              placeholder={t("notesPlaceholder")}
              value={formData.additionalNotes || ""}
              onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
              className="w-full rounded-xl border border-border-default bg-elevated-surface p-3 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-all"
            />
          </div>
        )}
      </div>

      {/* Estimate Box (Only when service is chosen) */}
      {selectedService && (
        <div className="rounded-xl bg-elevated-surface border border-border-default/80 p-3.5 sm:p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-light text-success border border-success-border">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs sm:text-sm font-bold text-tech-slate truncate">
                  {t("warrantyBadge", { service: selectedService.name })}
                </p>
                <p className="text-2xs text-text-muted">{t("warrantySub")}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-heading text-base sm:text-lg font-black text-tech-slate tabular-nums block">
                ₹{(dynamicPrice || selectedService.startingPrice).toLocaleString("en-IN")}
              </span>
              <span className="text-2xs text-success font-medium block">
                {t("payAfter")}
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
          className="h-11 inline-flex items-center gap-1.5 rounded-xl border border-border-default px-4 text-xs sm:text-sm font-bold text-tech-slate hover:bg-surface-hover cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("backBtn")}</span>
        </button>

        <button
          type="button"
          onClick={goToNextStage}
          disabled={!canProceed}
          className={`h-11 inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 text-xs sm:text-sm font-bold transition-all ${
            canProceed
              ? "bg-flash-orange text-clean-white hover:bg-flash-orange-hover shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
              : "bg-surface-disabled text-text-muted cursor-not-allowed"
          }`}
        >
          <span>{t("nextBtn")}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}


