"use client";

import { useState } from "react";
import { Wrench, Smartphone, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

interface HeroMediaImageProps {
  src?: string | null;
  alt: string;
  badge?: string;
  fallbackType?: "service" | "model" | "brand";
  title?: string;
  subtitle?: string;
  aspectRatio?: "4/3" | "16/9" | "1/1";
  className?: string;
}

const aspectClasses = {
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
};

export default function HeroMediaImage({
  src,
  alt,
  badge,
  fallbackType = "service",
  title,
  subtitle,
  aspectRatio = "4/3",
  className = "",
}: HeroMediaImageProps) {
  const [hasError, setHasError] = useState(false);

  const hasValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0 && !hasError);
  const aspectClass = aspectClasses[aspectRatio] || "aspect-4/3";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl bg-clean-white border border-border-default/80 shadow-md group ${aspectClass} ${className}`}
    >
      {hasValidSrc ? (
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src!}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge Overlay */}
          {badge && (
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-tech-slate/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-clean-white shadow-md border border-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange animate-pulse" />
                <span>{badge}</span>
              </span>
            </div>
          )}

          {/* Subtle bottom gradient protection */}
          <div className="absolute inset-0 bg-gradient-to-t from-tech-slate/40 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Graceful, Responsive Fallback Visual */
        <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-mist-gray via-clean-white to-orange-50/40 select-none overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-flash-orange/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-electric-amber/10 blur-2xl pointer-events-none" />

          {/* Top Bar: Badge & Status */}
          <div className="flex items-center justify-between w-full relative z-10">
            {badge ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-tech-slate px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-clean-white shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange" />
                <span>{badge}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/80 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700">
                <ShieldCheck className="h-3 w-3 text-flash-orange" />
                <span>QuickFix Verified</span>
              </span>
            )}

            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="h-3 w-3" />
              <span>Pune Lab</span>
            </div>
          </div>

          {/* Center Graphic */}
          <div className="my-auto flex flex-col items-center justify-center text-center relative z-10 py-2">
            <div className="relative mb-3 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-tech-slate text-clean-white shadow-lg border border-zinc-700/40 group-hover:scale-105 transition-transform">
              {fallbackType === "service" && <Wrench className="h-8 w-8 sm:h-10 sm:w-10 text-flash-orange" />}
              {fallbackType === "model" && <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-electric-amber" />}
              {fallbackType === "brand" && <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-flash-orange" />}
            </div>

            {title && (
              <h4 className="font-heading text-sm sm:text-base font-extrabold text-tech-slate tracking-tight max-w-xs leading-tight">
                {title}
              </h4>
            )}

            {subtitle && (
              <p className="mt-1 text-xs text-text-muted max-w-xs line-clamp-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom Indicators */}
          <div className="relative z-10 pt-2 border-t border-border-default/60 flex items-center justify-between text-[11px] font-medium text-text-secondary">
            <span>Sadashiv Peth Central Hub</span>
            <span className="font-bold text-flash-orange">30-Min Dispatch SLA</span>
          </div>
        </div>
      )}
    </div>
  );
}
