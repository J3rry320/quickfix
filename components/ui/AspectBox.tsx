"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Play,
  Wrench,
  Smartphone,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export interface AspectBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "21/9" | "9/16";
  src?: string | null;
  alt?: string;
  type?: "image" | "video";
  videoSrc?: string;
  poster?: string;
  label?: string;
  title?: string;
  badge?: string;
  fallbackType?: "service" | "model" | "brand" | "blog" | "lab" | "generic";
  variant?: "solid" | "glass" | "dashed";
  preload?: boolean;
  sizes?: string;
  className?: string;
  children?: React.ReactNode;
}

const aspectClasses: Record<string, string> = {
  "16/9": "aspect-16/9",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

export default function AspectBox({
  aspectRatio = "16/9",
  src = "",
  alt = "Media content",
  type = "image",
  videoSrc,
  poster,
  label,
  title,
  badge,
  fallbackType = "generic",
  variant = "solid",
  preload = false,
  sizes,
  className = "",
  children,
  ...props
}: AspectBoxProps) {
  const [hasError, setHasError] = useState(false);

  const hasValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0 && !hasError);
  const aspectClass = aspectClasses[aspectRatio] || "aspect-16/9";

  const defaultSizes =
    aspectRatio === "1/1"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
      : aspectRatio === "9/16"
      ? "(max-width: 640px) 240px, 320px"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px";
  const effectiveSizes = sizes || defaultSizes;

  // Container styling variants
  const variantStyles = {
    solid: "bg-clean-white border border-border-default/80 shadow-md",
    glass: "bg-clean-white/10 backdrop-blur-md border border-clean-white/20 text-clean-white",
    dashed: "bg-mist-gray border-2 border-dashed border-border-strong text-text-muted",
  }[variant] || "bg-clean-white border border-border-default/80 shadow-md";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center group ${aspectClass} ${variantStyles} ${className}`}
      {...props}
    >
      {/* Video element if videoSrc is explicitly provided */}
      {type === "video" && videoSrc ? (
        <video
          src={videoSrc}
          poster={poster || (src || undefined)}
          playsInline
          loop
          muted
          controls
          className="h-full w-full object-cover"
        />
      ) : hasValidSrc ? (
        /* Image render */
        <div className="relative h-full w-full">
          <Image
            src={src!}
            alt={alt}
            fill
            priority={preload}
            sizes={effectiveSizes}
            onError={() => setHasError(true)}
            className="object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Badge Overlay */}
          {badge && (
            <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-tech-slate/90 backdrop-blur-md px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-clean-white shadow-md border border-clean-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange" />
                <span>{badge}</span>
              </span>
            </div>
          )}

          {/* Bottom gradient and caption overlay if title/label present */}
          {(title || label) && (
            <div className="absolute inset-0 bg-gradient-to-t from-tech-slate/85 via-tech-slate/20 to-transparent flex flex-col justify-end p-4 sm:p-5 pointer-events-none">
              {title && (
                <h4 className="font-heading text-sm sm:text-base font-bold text-clean-white drop-shadow-sm">
                  {title}
                </h4>
              )}
              {label && (
                <p className="text-[11px] sm:text-xs text-clean-white/80 font-medium line-clamp-2 mt-0.5 drop-shadow-xs">
                  {label}
                </p>
              )}
            </div>
          )}

          {/* Subtle bottom protection gradient when only badge is present */}
          {badge && !title && !label && (
            <div className="absolute inset-0 bg-gradient-to-t from-tech-slate/30 via-transparent to-transparent pointer-events-none" />
          )}
        </div>
      ) : (
        /* Intentional, Branded Fallback State */
        <div
          className={`relative h-full w-full p-5 sm:p-7 flex flex-col justify-between select-none overflow-hidden ${
            variant === "glass"
              ? "bg-transparent text-clean-white"
              : "bg-gradient-to-br from-mist-gray via-clean-white to-flash-orange/5 text-tech-slate"
          }`}
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-flash-orange/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-electric-amber/10 blur-2xl" />

          {/* Top Bar: Badge & Verification */}
          <div className="relative z-10 flex items-center justify-between w-full">
            {badge ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-2xs ${
                  variant === "glass"
                    ? "bg-clean-white/20 text-clean-white border border-clean-white/30"
                    : "bg-tech-slate text-clean-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange" />
                <span>{badge}</span>
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  variant === "glass"
                    ? "bg-clean-white/15 text-clean-white"
                    : "bg-surface-hover/80 text-text-secondary"
                }`}
              >
                <ShieldCheck className="h-3 w-3 text-flash-orange" />
                <span>QuickFix Verified</span>
              </span>
            )}

            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success-light border border-success-border px-2 py-0.5 rounded-md">
              <CheckCircle2 className="h-3 w-3" />
              <span>Pune Lab</span>
            </div>
          </div>

          {/* Center Graphic Icon & Title */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2">
            {type === "video" ? (
              <div className="relative mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-flash-orange text-clean-white shadow-xl shadow-flash-orange/30 group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-0.5" />
              </div>
            ) : (
              <div
                className={`relative mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-md group-hover:scale-105 transition-transform ${
                  variant === "glass"
                    ? "bg-clean-white/20 text-clean-white border border-clean-white/30"
                    : "bg-tech-slate text-clean-white border border-border-dark/40"
                }`}
              >
                {fallbackType === "service" && <Wrench className="h-7 w-7 sm:h-8 sm:w-8 text-flash-orange" />}
                {fallbackType === "model" && <Smartphone className="h-7 w-7 sm:h-8 sm:w-8 text-electric-amber" />}
                {fallbackType === "brand" && <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-flash-orange" />}
                {fallbackType === "blog" && <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-flash-orange" />}
                {fallbackType === "lab" && <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-success" />}
                {fallbackType === "generic" && <ImageIcon className="h-7 w-7 sm:h-8 sm:w-8 text-electric-amber" />}
              </div>
            )}

            {title && (
              <h4
                className={`font-heading text-sm sm:text-base font-extrabold tracking-tight max-w-xs leading-tight ${
                  variant === "glass" ? "text-clean-white" : "text-tech-slate"
                }`}
              >
                {title}
              </h4>
            )}

            {label && (
              <p
                className={`mt-1 text-xs max-w-xs line-clamp-2 leading-relaxed ${
                  variant === "glass" ? "text-clean-white/80" : "text-text-muted"
                }`}
              >
                {label}
              </p>
            )}
          </div>

          {/* Bottom Meta Indicator */}
          <div
            className={`relative z-10 pt-2 border-t flex items-center justify-between text-[11px] font-medium ${
              variant === "glass"
                ? "border-clean-white/20 text-clean-white/80"
                : "border-border-default/60 text-text-secondary"
            }`}
          >
            <span>Sadashiv Peth Lab</span>
            <span className="font-bold text-flash-orange">Express Doorstep Dispatch</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
