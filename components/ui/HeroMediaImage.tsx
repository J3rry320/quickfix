"use client";

import AspectBox from "@/components/ui/AspectBox";

export interface HeroMediaImageProps {
  src?: string | null;
  alt: string;
  badge?: string;
  fallbackType?: "service" | "model" | "brand";
  title?: string;
  subtitle?: string;
  aspectRatio?: "4/3" | "16/9" | "1/1";
  preload?: boolean;
  sizes?: string;
  className?: string;
}

export default function HeroMediaImage({
  src,
  alt,
  badge,
  fallbackType = "service",
  title,
  subtitle,
  aspectRatio = "4/3",
  preload = false,
  sizes,
  className = "",
}: HeroMediaImageProps) {
  return (
    <AspectBox
      src={src}
      alt={alt}
      badge={badge}
      fallbackType={fallbackType}
      title={title}
      label={subtitle}
      aspectRatio={aspectRatio}
      preload={preload}
      sizes={sizes}
      className={className}
    />
  );
}
