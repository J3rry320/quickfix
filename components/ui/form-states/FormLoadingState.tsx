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
      className={`mx-auto w-full max-w-md rounded-3xl bg-clean-white border border-border-default/90 p-6 sm:p-8 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center mb-3.5">
        <div className="absolute inset-0 rounded-2xl bg-flash-orange/15 animate-ping opacity-60" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-flash-orange/10 border border-flash-orange/20 text-flash-orange shadow-2xs">
          <Loader2 className="h-6 w-6 animate-spin stroke-[2.5]" aria-hidden="true" />
        </div>
      </div>

      <h3 className="font-heading text-lg sm:text-xl font-black text-tech-slate tracking-tight">
        {title}
      </h3>

      {subtitle && (
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200/70 text-2xs font-semibold text-zinc-500">
        <span className="w-1.5 h-1.5 rounded-full bg-flash-orange animate-pulse" />
        <span>QuickFix Live Dispatch</span>
      </div>
    </div>
  );
}
