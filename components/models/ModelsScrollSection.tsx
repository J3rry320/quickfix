"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import ModelCard, { ModelCardItem } from "./ModelCard";
import { Container, Section, Badge } from "@/components/ui";

export interface BrandFilterOption {
  _id?: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface ModelsScrollSectionProps {
  models: ModelCardItem[];
  title: string;
  subtitle?: string;
  badge?: string;
  brands?: BrandFilterOption[];
  showBrandFilter?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  brandSlugOverride?: string;
  brandNameOverride?: string;
  showingCountTemplate?: string; // e.g. "Showing {count} of {total} {brandName} models"
  emptyTitle?: string;
  emptySubtitle?: string;
  clearSearchLabel?: string;
  sectionVariant?: "white" | "muted";
  className?: string;
}

export default function ModelsScrollSection({
  models,
  title,
  subtitle,
  badge,
  brands = [],
  showBrandFilter = false,
  showSearch = false,
  searchPlaceholder = "Search smartphone model...",
  brandSlugOverride,
  brandNameOverride,
  showingCountTemplate,
  emptyTitle = "No matching smartphone models found",
  emptySubtitle = "Try adjusting your search keywords or clear the filter to view all supported models.",
  clearSearchLabel = "Clear search",
  sectionVariant = "white",
  className = "",
}: ModelsScrollSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter models by brand pill and search query
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      // Brand filter
      if (showBrandFilter && selectedBrandSlug !== "all") {
        const bSlug =
          typeof model.brand === "object" && model.brand
            ? model.brand.slug
            : typeof model.brand === "string"
              ? model.brand.toLowerCase()
              : "";
        if (bSlug !== selectedBrandSlug) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = model.name.toLowerCase().includes(q);
        const yearMatch = model.releaseYear
          ? model.releaseYear.toString().includes(q)
          : false;
        const brandMatch =
          typeof model.brand === "object" && model.brand?.name
            ? model.brand.name.toLowerCase().includes(q)
            : false;
        return nameMatch || yearMatch || brandMatch;
      }

      return true;
    });
  }, [models, showBrandFilter, selectedBrandSlug, searchQuery]);

  // Check scroll position for desktop arrow states
  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons, { passive: true });
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [filteredModels]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollOffset = direction === "left" ? -320 : 320;
    el.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  // Format count string
  const countText = useMemo(() => {
    if (!showingCountTemplate) {
      return `Showing ${filteredModels.length} of ${models.length} models`;
    }
    return showingCountTemplate
      .replace("{count}", filteredModels.length.toString())
      .replace("{total}", models.length.toString())
      .replace("{brandName}", brandNameOverride || "");
  }, [showingCountTemplate, filteredModels.length, models.length, brandNameOverride]);

  return (
    <Section variant={sectionVariant} padding="default" className={className}>
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            {badge && (
              <div className="mb-2.5">
                <Badge variant="accent" size="sm">
                  {badge}
                </Badge>
              </div>
            )}
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-text-secondary font-body leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop Left / Right Scroll Navigation */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollLeft
                  ? "bg-clean-white border-border-default text-tech-slate hover:border-flash-orange hover:text-flash-orange shadow-2xs"
                  : "bg-mist-gray/60 border-border-default/40 text-text-muted cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollRight
                  ? "bg-clean-white border-border-default text-tech-slate hover:border-flash-orange hover:text-flash-orange shadow-2xs"
                  : "bg-mist-gray/60 border-border-default/40 text-text-muted cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Search Bar & Result Counter */}
        {showSearch && (
          <div className="mb-6 space-y-3">
            <div className="relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-clean-white border border-border-default text-sm text-tech-slate placeholder:text-text-muted focus:outline-hidden focus:border-flash-orange focus:ring-1 focus:ring-flash-orange transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-tech-slate transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Model Count Indicator */}
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{countText}</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1 font-semibold text-flash-orange hover:underline text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{clearSearchLabel}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Optional Brand Filter Tabs (for Landing page or hub) */}
        {showBrandFilter && brands.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedBrandSlug("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedBrandSlug === "all"
                  ? "bg-flash-orange text-clean-white shadow-2xs"
                  : "bg-mist-gray text-text-secondary hover:text-tech-slate hover:bg-surface-hover border border-border-default/60"
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.slug}
                type="button"
                onClick={() => setSelectedBrandSlug(brand.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedBrandSlug === brand.slug
                    ? "bg-flash-orange text-clean-white shadow-2xs"
                    : "bg-mist-gray text-text-secondary hover:text-tech-slate hover:bg-surface-hover border border-border-default/60"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        )}

        {/* Horizontally Scrollable Cards Container */}
        {filteredModels.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredModels.map((model) => (
              <ModelCard
                key={model._id || model.slug}
                model={model}
                brandSlugOverride={brandSlugOverride}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start"
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-clean-white border border-border-default my-4">
            <div className="w-12 h-12 rounded-2xl bg-mist-gray flex items-center justify-center mx-auto mb-3 text-text-muted">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-tech-slate">
              {emptyTitle}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
              {emptySubtitle}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-mist-gray hover:bg-surface-hover text-tech-slate border border-border-default transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-flash-orange" />
                <span>{clearSearchLabel}</span>
              </button>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
