import React from "react";
import { STANDARD_REPAIR_PROCESS } from "@/config/catalogue-data";

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface ProcessStepGridProps {
  steps?: ProcessStep[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ProcessStepGrid({
  steps = STANDARD_REPAIR_PROCESS,
  title = "How Doorstep Repair Works in Pune",
  subtitle = "Transparent, certified doorstep repair with no hidden charges and zero data compromise.",
  className = "",
}: ProcessStepGridProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {title && (
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-tech-slate tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((item, index) => (
          <div
            key={index}
            className="relative rounded-2xl bg-clean-white border border-border-default p-6 shadow-2xs hover:shadow-md hover:border-flash-orange/40 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="font-heading text-2xl font-black text-flash-orange/80">
                {item.step}
              </span>
              <h3 className="mt-3 font-heading text-base font-bold text-tech-slate">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-default/60 flex items-center justify-between text-2xs text-text-muted font-medium">
              <span>Step {index + 1} of {steps.length}</span>
              <span className="text-success font-bold">Pune On-Site</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
