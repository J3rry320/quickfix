"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";

interface BrandLogoProps {
  src?: string | null;
  brandName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9 w-9 rounded-xl p-1.5 text-xs",
  md: "h-12 w-12 rounded-xl p-2 text-sm",
  lg: "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl p-3 text-base",
};

export default function BrandLogo({
  src,
  brandName,
  className = "",
  size = "md",
}: BrandLogoProps) {
  const [error, setError] = useState(false);

  const hasValidLogo = Boolean(src && typeof src === "string" && src.trim().length > 0 && !error);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-clean-white border border-border-default shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 ${sizeClass} ${className}`}
      title={brandName}
    >
      {hasValidLogo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src!}
          alt={`${brandName} official logo`}
          onError={() => setError(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center font-heading font-black text-tech-slate uppercase text-center leading-none select-none">
          {brandName ? (
            <span>{brandName.slice(0, 2).toUpperCase()}</span>
          ) : (
            <Smartphone className="h-4 w-4 text-text-muted" />
          )}
        </div>
      )}
    </div>
  );
}
