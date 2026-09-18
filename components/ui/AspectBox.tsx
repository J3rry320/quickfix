import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Play } from "lucide-react";

export interface AspectBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "21/9";
  src?: string;
  alt?: string;
  type?: "image" | "video";
  label?: string;
  badge?: string;
  preload?: boolean;
  sizes?: string;
  className?: string;
}

const aspectClasses = {
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "21/9": "aspect-[21/9]",
};

export default function AspectBox({
  aspectRatio = "16/9",
  src = "",
  alt = "Media content",
  type = "image",
  label,
  badge,
  preload = false,
  sizes,
  className = "",
  ...props
}: AspectBoxProps) {
  const aspect = aspectClasses[aspectRatio] || "aspect-video";
  const defaultSizes =
    aspectRatio === "1/1"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px";
  const effectiveSizes = sizes || defaultSizes;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-mist-gray border-2 border-dashed border-border-strong flex flex-col items-center justify-center group ${aspect} ${className}`}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          preload={preload}
          sizes={effectiveSizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center select-none text-text-muted">
          {type === "video" ? (
            <div className="relative mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-flash-orange text-clean-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
            </div>
          ) : (
            <div className="mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-surface-hover/80 text-text-secondary shadow-inner">
              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}

          {badge && (
            <span className="mb-1 rounded-full bg-surface-hover px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-tech-slate">
              {badge}
            </span>
          )}

          {label && (
            <span className="text-xs font-semibold text-text-secondary max-w-xs leading-snug">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
