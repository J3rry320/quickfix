"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBookingWizard } from "./BookingWizardContext";

export default function WizardProgress() {
  const t = useTranslations("RepairPage.stages");
  const { currentStage, setStage, formData } = useBookingWizard();

  const stages = [
    { stage: 1 as const, shortLabel: t("stage1"), fullLabel: t("stage1Full") },
    { stage: 2 as const, shortLabel: t("stage2"), fullLabel: t("stage2Full") },
    { stage: 3 as const, shortLabel: t("stage3"), fullLabel: t("stage3Full") },
  ];

  const isStageAccessible = (s: 1 | 2 | 3) => {
    if (s === 1) return true;
    if (s === 2) return Boolean(formData.brand && formData.model);
    if (s === 3) return Boolean(formData.brand && formData.model && formData.issueDescription);
    return false;
  };

  return (
    <nav aria-label="Booking steps" className="max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        {stages.map(({ stage, shortLabel, fullLabel }, idx) => {
          const isCurrent = currentStage === stage;
          const isCompleted = currentStage > stage;
          const canClick = isStageAccessible(stage);

          return (
            <React.Fragment key={stage}>
              {idx > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-zinc-300 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => {
                  if (canClick) setStage(stage);
                }}
                disabled={!canClick}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-flash-orange text-clean-white shadow-xs ring-4 ring-flash-orange/15"
                    : isCompleted
                    ? "bg-clean-white border border-border-default text-tech-slate hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer shadow-2xs"
                    : "bg-clean-white border border-border-default/70 text-zinc-400 cursor-not-allowed"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-black shrink-0 ${
                    isCurrent
                      ? "bg-clean-white/25 text-clean-white"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
                  ) : (
                    stage
                  )}
                </span>

                <span className="whitespace-nowrap">
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{fullLabel}</span>
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
