"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminImageProps {
  src?: string | null;
  alt: string;
  fallbackIcon?: LucideIcon;
  fallbackText?: string;
  className?: string;
  containerClassName?: string;
}

export default function AdminImage({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  fallbackText,
  className = "h-full w-full object-contain",
  containerClassName = "h-9 w-9 rounded-lg bg-zinc-50 border border-zinc-200 shrink-0",
}: AdminImageProps) {
  const [error, setError] = useState(false);

  const hasValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0);
  const showImage = hasValidSrc && !error;

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center select-none ${containerClassName}`}
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src!}
          alt={alt}
          onError={() => setError(true)}
          className={className}
        />
      ) : FallbackIcon ? (
        <FallbackIcon className="h-4 w-4 text-zinc-400" />
      ) : fallbackText ? (
        <span className="font-heading font-extrabold text-xs text-tech-slate">
          {fallbackText}
        </span>
      ) : (
        <div className="h-2 w-2 rounded-full bg-zinc-300" />
      )}
    </div>
  );
}
