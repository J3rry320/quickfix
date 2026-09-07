"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkles, Smartphone } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonBrandStrip } from "@/components/ui/Skeleton";

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isPopular?: boolean;
}

export default function BrandsShowcase() {
  const t = useTranslations("BrandsShowcase");
  const tCommon = useTranslations("Common");

  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBrands() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.brands)) {
          setBrands(data.data.brands);
        } else {
          setBrands([]);
        }
      } catch (err) {
        console.error("Failed to load brands", err);
        setBrands([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {t("badge")}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-600 font-body max-w-xl">
              {t("subtitle")}
            </p>
          </div>

          <span className="rounded-xl bg-mist-gray px-3.5 py-2 text-xs font-bold text-tech-slate border border-zinc-200 shrink-0">
            {t("supportedCount")}
          </span>
        </div>

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
              <div
                key={brand._id}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-mist-gray/80 border border-zinc-200/80 hover:border-flash-orange hover:shadow-xs transition-all group text-center"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-2 flex items-center justify-center rounded-lg bg-clean-white border border-zinc-200 shadow-2xs group-hover:scale-105 transition-transform">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
