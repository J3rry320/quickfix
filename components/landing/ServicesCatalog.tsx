"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Shield,
  Clock,
  ArrowRight,
  Wrench,
  Smartphone,
  BatteryCharging,
  Camera,
  Cpu,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
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

  const getServiceIcon = (slug: string, name: string) => {
    const s = (slug + " " + name).toLowerCase();
    if (s.includes("screen") || s.includes("display")) return Smartphone;
    if (s.includes("battery") || s.includes("power")) return BatteryCharging;
    if (s.includes("camera") || s.includes("lens")) return Camera;
    if (s.includes("motherboard") || s.includes("chip")) return Cpu;
    if (s.includes("charging") || s.includes("port")) return Zap;
    return Wrench;
  };

  return (
    <section
      id="services"
      className="py-10 sm:py-16 lg:py-20 bg-mist-gray/60 border-b border-zinc-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <Wrench className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-body">
            {t("subtitle")}
          </p>

          {/* Filter Pills with horizontal scroll on mobile */}
          {services.length > 0 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
              {[
                { id: "all", label: t("filterAll") },
                { id: "screen", label: t("filterScreen") },
                { id: "battery", label: t("filterBattery") },
                { id: "hardware", label: t("filterHardware") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`shrink-0 rounded-xl px-4 sm:px-5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filteredServices.map((service) => {
              const ServiceIcon = getServiceIcon(service.slug, service.name);

              return (
                <div
                  key={service._id}
                  className="flex flex-col justify-between rounded-2xl bg-clean-white border border-zinc-200 p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-flash-orange/50 transition-all group"
                >
                  <div>
                    {/* Visual: Image or Stylized Feature Icon */}
                    <div className="relative mb-5 aspect-16/9 w-full overflow-hidden rounded-xl bg-gradient-to-br from-mist-gray to-zinc-200 flex items-center justify-center border border-zinc-100">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-clean-white text-flash-orange shadow-md group-hover:scale-110 transition-transform">
                            <ServiceIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                          </div>
                          <span className="mt-2 text-xs font-bold text-tech-slate tracking-tight">
                            {service.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Popular Badge & Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                        {service.name}
                      </h3>
                      {service.isPopular && (
                        <span className="rounded-md bg-flash-orange/10 px-2 py-0.5 text-[11px] font-extrabold text-flash-orange shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Turnaround & Warranty tags */}
                    <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-5">
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
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase block">
                        {t("startingAt")}
                      </span>
                      <p className="text-lg sm:text-xl font-extrabold font-heading text-tech-slate">
                        ₹{service.startingPrice.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      href="/book-repair"
                      className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-extrabold text-clean-white shadow-xs hover:bg-orange-600 active:scale-95 transition-all"
                    >
                      <span>{t("bookService")}</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
