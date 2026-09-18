"use client";

import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export interface FormLoadingStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
  autoScroll?: boolean;
}

export default function FormLoadingState({
  title = "Processing Your Request…",
  subtitle = "Please wait a moment while we process your request.",
  className = "",
  autoScroll = true,
}: FormLoadingStateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoScroll]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      className={`mx-auto w-full max-w-md rounded-3xl bg-clean-white border border-border-default/90 p-8 sm:p-10 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200 scroll-mt-28 ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-flash-orange/10 border border-flash-orange/20 text-flash-orange shadow-2xs mb-4">
        <Loader2 className="h-7 w-7 animate-spin stroke-[2.5]" aria-hidden="true" />
      </div>

      <h3 className="font-heading text-lg sm:text-xl font-bold text-tech-slate tracking-tight">
        {title}
      </h3>

      {subtitle && (
        <p className="mt-2 text-xs sm:text-sm text-text-muted font-body max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

