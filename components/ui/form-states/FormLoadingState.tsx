"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface FormLoadingStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FormLoadingState({
  title = "Processing Your Request…",
  subtitle = "Connecting with Pune dispatch server. Please wait a moment.",
  className = "",
}: FormLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mx-auto max-w-lg rounded-3xl bg-clean-white border border-border-default p-8 sm:p-12 text-center shadow-lg animate-in fade-in duration-300 ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-flash-orange/10 text-flash-orange mb-4 shadow-2xs">
        <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl sm:text-2xl font-black text-tech-slate tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-2 text-xs sm:text-sm text-text-muted font-body max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
