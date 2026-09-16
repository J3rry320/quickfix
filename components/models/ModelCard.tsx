import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Smartphone, ArrowRight } from "lucide-react";

export interface ModelCardItem {
  _id?: string;
  name: string;
  slug: string;
  brand:
    | string
    | {
        _id?: string;
        name: string;
        slug: string;
        logoUrl?: string;
      };
  releaseYear?: number;
  imageUrl?: string;
  isPopular?: boolean;
  servicePricing?: Array<{
    service?:
      | {
          name?: string;
          slug?: string;
          startingPrice?: number;
        }
      | string;
    price?: number;
    estimatedTimeMinutes?: number;
  }>;
}

interface ModelCardProps {
  model: ModelCardItem;
  className?: string;
  brandSlugOverride?: string;
  startingPriceLabel?: string;
  viewDetailsLabel?: string;
}

export default function ModelCard({
  model,
  className = "",
  brandSlugOverride,
  startingPriceLabel = "Repairs from",
  viewDetailsLabel = "View Repairs",
}: ModelCardProps) {
  const brandObj =
    typeof model.brand === "object" && model.brand !== null ? model.brand : null;
  const brandName =
    brandObj?.name ||
    (typeof model.brand === "string" ? model.brand : "Smartphone");
  const brandSlug =
    brandSlugOverride ||
    brandObj?.slug ||
    (typeof model.brand === "string" ? model.brand.toLowerCase() : "");

  // Calculate lowest starting repair price
  const validPrices = Array.isArray(model.servicePricing)
    ? model.servicePricing
        .map((sp) => sp.price)
        .filter((p): p is number => typeof p === "number" && p > 0)
    : [];
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;

  const targetHref = brandSlug
    ? `/brands/${brandSlug}/${model.slug}`
    : `/brands`;

  return (
    <Link
      href={targetHref}
      className={`group flex flex-col justify-between p-4 rounded-2xl bg-clean-white border border-border-default hover:border-flash-orange/60 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        {/* Device Image / Elegant Phone Silhouette Graphic */}
        <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl bg-gradient-to-b from-mist-gray/40 to-mist-gray/80 flex items-center justify-center p-3 mb-3 border border-border-default/60 group-hover:border-border-default transition-colors">
          {model.imageUrl ? (
            <Image
              src={model.imageUrl}
              alt={model.name}
              fill
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 280px, 300px"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            /* Modern device silhouette mockup */
            <div className="relative w-24 h-32 rounded-2xl bg-clean-white border border-border-default shadow-2xs flex flex-col items-center justify-between p-1.5 group-hover:scale-105 group-hover:border-flash-orange/40 transition-all duration-300">
              {/* Speaker pill */}
              <div className="w-6 h-1 rounded-full bg-border-default/80 mt-0.5" />

              {/* Screen Area with Brand Emblem */}
              <div className="flex-1 w-full rounded-lg bg-mist-gray/70 flex flex-col items-center justify-center p-1 my-1">
                {brandObj?.logoUrl ? (
                  <div className="relative w-7 h-7">
                    <Image
                      src={brandObj.logoUrl}
                      alt={brandName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Smartphone className="w-5 h-5 text-text-muted group-hover:text-flash-orange transition-colors" />
                )}
                <span className="text-[10px] font-bold text-tech-slate/70 mt-1 truncate max-w-[65px]">
                  {brandName}
                </span>
              </div>

              {/* Bottom bar indicator */}
              <div className="w-8 h-1 rounded-full bg-border-default/70 mb-0.5" />
            </div>
          )}
        </div>

        {/* Brand & Release Year Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-3xs font-bold uppercase tracking-wider text-text-muted truncate">
            {brandName}
          </span>
          {model.releaseYear && (
            <span className="text-3xs font-mono font-bold text-text-secondary bg-mist-gray px-1.5 py-0.5 rounded border border-border-default/70 shrink-0">
              {model.releaseYear}
            </span>
          )}
        </div>

        {/* Model Name */}
        <h3 className="font-heading font-bold text-sm sm:text-base text-tech-slate group-hover:text-flash-orange transition-colors line-clamp-1">
          {model.name}
        </h3>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-3.5 pt-3 border-t border-border-default/60 flex items-center justify-between text-xs">
        <div>
          <span className="text-3xs font-medium text-text-muted block">
            {startingPriceLabel}
          </span>
          <span className="font-heading font-bold text-tech-slate text-xs sm:text-sm">
            {minPrice ? `₹${minPrice.toLocaleString("en-IN")}` : "Genuine Parts"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-bold text-flash-orange text-xs group-hover:translate-x-0.5 transition-transform">
          <span>{viewDetailsLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
