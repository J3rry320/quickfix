"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Smartphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/landing/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonBrandStrip } from "@/components/ui/Skeleton";

export interface BrandItem {
  _id?: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isPopular?: boolean;
}

export interface BrandsShowcaseProps {
  initialBrands?: BrandItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  variant?: "white" | "muted";
  showBorder?: boolean;
  className?: string;
}

export default function BrandsShowcase({
  initialBrands,
  title,
  subtitle,
  badge,
  action,
  variant = "white",
  showBorder = true,
  className = "",
}: BrandsShowcaseProps = {}) {
  const t = useTranslations("BrandsShowcase");
  const tCommon = useTranslations("Common");

  const [fetchedBrands, setFetchedBrands] = useState<BrandItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialBrands);

  useEffect(() => {
    if (initialBrands !== undefined) {
      return;
    }

    let isMounted = true;
    async function loadBrands() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.data?.brands)) {
            setFetchedBrands(data.data.brands);
          } else {
            setFetchedBrands([]);
          }
        }
      } catch (err) {
        console.error("Failed to load brands", err);
        if (isMounted) setFetchedBrands([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBrands();

    return () => {
      isMounted = false;
    };
  }, [initialBrands]);

  const brands = initialBrands !== undefined ? initialBrands : fetchedBrands;

  const displayTitle = title || t("title");
  const displaySubtitle = subtitle || t("subtitle");
  const displayAction = action || (
    <span className="rounded-xl bg-mist-gray px-3.5 py-2 text-xs font-bold text-tech-slate border border-border-default shrink-0">
      {badge || t("supportedCount")}
    </span>
  );

  const sectionBg = variant === "muted" ? "bg-mist-gray/40" : "bg-clean-white";
  const borderClass = showBorder ? "border-b border-border-default" : "";
  const cardBg =
    variant === "muted"
      ? "bg-clean-white border-border-default hover:border-flash-orange hover:shadow-xs"
      : "bg-mist-gray/80 border-border-default hover:border-flash-orange hover:shadow-xs";
  const logoBoxBg =
    variant === "muted"
      ? "bg-mist-gray/60 border-border-default"
      : "bg-clean-white border-border-default";

  return (
    <section className={`py-10 sm:py-16 lg:py-20 ${sectionBg} ${borderClass} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={displayTitle}
          subtitle={displaySubtitle}
          className="mb-8 sm:mb-10"
          action={displayAction}
        />

        {/* Dynamic Content */}
        {isLoading ? (
          <SkeletonBrandStrip count={8} />
        ) : brands.length === 0 ? (
          <div className="mx-auto max-w-2xl">
            <EmptyState
              icon={Smartphone}
              title={tCommon("emptyState.noBrandsTitle")}
              description={tCommon("emptyState.noBrandsDesc")}
              actionLabel={tCommon("emptyState.contactCta")}
              actionHref="#contact"
            />
          </div>
        ) : (
          /* Brand Grid: 3-4 cols on mobile, 4-6 on tablet, 8 on desktop */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
            {brands.map((brand) => (
              <Link
                key={brand._id || brand.slug}
                href={`/brands/${brand.slug}`}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all group text-center ${cardBg}`}
              >
                <div className={`relative w-10 h-10 sm:w-12 sm:h-12 mb-2 flex items-center justify-center rounded-lg border shadow-2xs group-hover:scale-105 transition-transform ${logoBoxBg}`}>
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 40px, 48px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <span className="font-heading font-black text-xs text-tech-slate">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-tech-slate group-hover:text-flash-orange transition-colors line-clamp-1">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
