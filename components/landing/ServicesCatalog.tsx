"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeader, EmptyState, Skeleton } from "@/components/ui";

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

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

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredServices, isLoading]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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
      className="py-10 sm:py-16 lg:py-20 bg-mist-gray/60 border-b border-border-default"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-8 sm:mb-10"
        >
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
                  onClick={() => {
                    setActiveFilter(tab.id);
                    scrollContainerRef.current?.scrollTo({
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                  className={`shrink-0 rounded-xl px-4 sm:px-5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-tech-slate text-clean-white shadow-md"
                      : "bg-clean-white text-text-secondary hover:bg-surface-hover border border-border-default"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </SectionHeader>

        {/* Dynamic Content */}
        {isLoading ? (
          <div className="flex gap-5 sm:gap-6 overflow-hidden pb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[285px] sm:w-[320px] md:w-[350px] shrink-0 rounded-2xl bg-clean-white border border-border-default p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <Skeleton className="w-full aspect-16/9 rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-4 w-full mb-1.5 rounded" />
                  <Skeleton className="h-4 w-2/3 rounded mb-4" />
                  <div className="flex gap-3 mb-5">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
                <div className="pt-4 border-t border-border-default flex items-center justify-between">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
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
          /* Horizontally Scrollable Services Carousel */
          <div className="relative group/carousel">
            {/* Scroll Left Button */}
            <button
              type="button"
              aria-label="Scroll previous services"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={`hidden md:flex absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-clean-white text-tech-slate shadow-lg border border-border-default transition-all hover:bg-surface-hover hover:text-flash-orange hover:scale-105 active:scale-95 cursor-pointer ${
                !canScrollLeft
                  ? "opacity-0 pointer-events-none"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              aria-label="Scroll next services"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={`hidden md:flex absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-clean-white text-tech-slate shadow-lg border border-border-default transition-all hover:bg-surface-hover hover:text-flash-orange hover:scale-105 active:scale-95 cursor-pointer ${
                !canScrollRight
                  ? "opacity-0 pointer-events-none"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={scrollContainerRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1"
            >
              {filteredServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.slug, service.name);

                return (
                  <div
                    key={service._id}
                    className="w-[285px] sm:w-[320px] md:w-[350px] shrink-0 snap-start flex flex-col justify-between rounded-2xl bg-clean-white border border-border-default p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-flash-orange/50 transition-all group"
                  >
                    <div>
                      {/* Visual: Image or Stylized Feature Icon */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="relative mb-5 aspect-16/9 w-full overflow-hidden rounded-xl bg-gradient-to-br from-mist-gray to-border-default flex items-center justify-center border border-border-default block"
                      >
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            sizes="(max-width: 640px) 285px, (max-width: 768px) 320px, 350px"
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
                      </Link>

                      {/* Popular Badge & Title */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Link href={`/services/${service.slug}`}>
                          <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                            {service.name}
                          </h3>
                        </Link>
                        {service.isPopular && (
                          <span className="rounded-md bg-flash-orange/10 px-2 py-0.5 text-[11px] font-extrabold text-flash-orange shrink-0">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Turnaround & Warranty tags */}
                      <div className="flex items-center gap-3 text-xs font-semibold text-text-muted mb-5">
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
                    <div className="pt-4 border-t border-border-default flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-text-muted uppercase block">
                          {t("startingAt")}
                        </span>
                        <p className="text-lg sm:text-xl font-extrabold font-heading text-tech-slate">
                          ₹{service.startingPrice.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <Link
                        href={`/book-repair?service=${encodeURIComponent(service.slug)}`}
                        className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-extrabold text-clean-white shadow-xs hover:bg-flash-orange-hover active:scale-95 transition-all"
                      >
                        <span>{t("bookService")}</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
