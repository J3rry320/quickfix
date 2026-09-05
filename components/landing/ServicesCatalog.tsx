"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Shield,
  Clock,
  ArrowRight,
  Wrench,
} from "lucide-react";
import MediaPlaceholder from "./MediaPlaceholder";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/Skeleton";

interface ServiceDoc {
  _id: string;
  name: string;
  slug: string;
  description: string;
  estimatedTimeMinutes: number;
  startingPrice: number;
  warrantyDays: number;
  image?: string;
  commonIssues?: string[];
  isPopular?: boolean;
}

export default function ServicesCatalog() {
  const t = useTranslations("ServicesCatalog");
  const tCommon = useTranslations("Common");

  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.services)) {
          setServices(data.data.services);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, []);

  // Filter services by category if tags/slugs match
  const filteredServices = services.filter((service) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "screen") {
      return (
        service.slug.includes("screen") ||
        service.slug.includes("display") ||
        service.name.toLowerCase().includes("screen")
      );
    }
    if (activeFilter === "battery") {
      return (
        service.slug.includes("battery") ||
        service.slug.includes("charging") ||
        service.name.toLowerCase().includes("battery")
      );
    }
    if (activeFilter === "hardware") {
      return (
        service.slug.includes("camera") ||
        service.slug.includes("motherboard") ||
        service.slug.includes("glass") ||
        !service.slug.includes("screen")
      );
    }
    return true;
  });

  return (
    <section id="services" className="py-16 lg:py-24 bg-mist-gray/60 border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <Wrench className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-body">
            {t("subtitle")}
          </p>

          {/* Filter Pills */}
          {services.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "all", label: t("filterAll") },
                { id: "screen", label: t("filterScreen") },
                { id: "battery", label: t("filterBattery") },
                { id: "hardware", label: t("filterHardware") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-xl px-5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-tech-slate text-clean-white shadow-md"
                      : "bg-clean-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content */}
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : filteredServices.length === 0 ? (
          <div className="mx-auto max-w-2xl">
            <EmptyState
              icon={Wrench}
              title={tCommon("emptyState.noServicesTitle")}
              description={tCommon("emptyState.noServicesDesc")}
              actionLabel={tCommon("emptyState.contactCta")}
              actionHref="#contact"
            />
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="flex flex-col justify-between rounded-2xl bg-clean-white border border-zinc-200 p-6 shadow-xs hover:shadow-xl hover:border-flash-orange/50 transition-all group"
              >
                <div>
                  {/* Media Placeholder with Aspect Ratio 16:9 */}
                  <div className="mb-5 overflow-hidden rounded-xl">
                    <MediaPlaceholder
                      src={service.image}
                      alt={service.name}
                      aspectRatio="16/9"
                      type="image"
                      label={service.name}
                      badge={t("mediaPlaceholder")}
                    />
                  </div>

                  {/* Popular Badge & Title */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-heading text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                      {service.name}
                    </h3>
                    {service.isPopular && (
                      <span className="rounded-md bg-flash-orange/10 px-2.5 py-0.5 text-[11px] font-extrabold text-flash-orange">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-600 font-body leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Turnaround & Warranty tags */}
                  <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-6">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-flash-orange" />
                      {service.estimatedTimeMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-flash-orange" />
                      {service.warrantyDays} Days Warranty
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase">
                      {t("startingAt")}
                    </span>
                    <p className="text-xl font-extrabold font-heading text-tech-slate">
                      ₹{service.startingPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <a
                    href="#book"
                    className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-extrabold text-clean-white shadow-sm hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    <span>{t("bookService")}</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
