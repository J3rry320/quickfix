"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import SectionHeader from "@/components/landing/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Link } from "@/i18n/navigation";

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
}

interface ServicePricing {
  service: {
    _id: string;
    name: string;
    slug: string;
    startingPrice: number;
    warrantyDays: number;
  };
  price: number;
  estimatedTimeMinutes?: number;
}

interface ModelItem {
  _id: string;
  name: string;
  slug: string;
  servicePricing?: ServicePricing[];
}

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  startingPrice: number;
  warrantyDays: number;
  estimatedTimeMinutes: number;
}

export default function PriceEstimator() {
  const t = useTranslations("Estimator");
  const tCommon = useTranslations("Common");

  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");

  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Load brands and services on mount
  useEffect(() => {
    async function loadInitialData() {
      setIsLoadingInitial(true);
      try {
        const [brandRes, serviceRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/services"),
        ]);
        const brandData = await brandRes.json();
        const serviceData = await serviceRes.json();

        if (brandData.success && Array.isArray(brandData.data?.brands)) {
          setBrands(brandData.data.brands);
          if (brandData.data.brands.length > 0) {
            setSelectedBrand(brandData.data.brands[0]._id);
          }
        }
        if (serviceData.success && Array.isArray(serviceData.data?.services)) {
          setServices(serviceData.data.services);
          if (serviceData.data.services.length > 0) {
            setSelectedService(serviceData.data.services[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load estimator data", err);
      } finally {
        setIsLoadingInitial(false);
      }
    }
    loadInitialData();
  }, []);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    setModels([]);
  };

  // When selected brand changes, fetch models for that brand
  useEffect(() => {
    if (!selectedBrand) return;

    let isSubscribed = true;

    async function loadModels() {
      setIsLoadingModels(true);
      try {
        const res = await fetch(`/api/models?brand=${selectedBrand}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.models)) {
            setModels(data.data.models);
            if (data.data.models.length > 0) {
              setSelectedModel(data.data.models[0]._id);
            } else {
              setSelectedModel("");
            }
          } else {
            setModels([]);
            setSelectedModel("");
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("Failed to load models", err);
          setModels([]);
          setSelectedModel("");
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingModels(false);
        }
      }
    }

    loadModels();

    return () => {
      isSubscribed = false;
    };
  }, [selectedBrand]);

  // Compute price based on selected model and service
  const currentModel = models.find((m) => m._id === selectedModel);
  const currentService = services.find((s) => s._id === selectedService);

  let computedPrice: number | null = currentService ? currentService.startingPrice : null;
  let estimatedTime = currentService?.estimatedTimeMinutes || 30;
  const warranty = currentService?.warrantyDays || 90;

  if (currentModel?.servicePricing && selectedService) {
    const customPricing = currentModel.servicePricing.find(
      (sp) => sp.service?._id === selectedService
    );
    if (customPricing) {
      computedPrice = customPricing.price;
      if (customPricing.estimatedTimeMinutes) {
        estimatedTime = customPricing.estimatedTimeMinutes;
      }
    }
  }

  const hasData = brands.length > 0 && services.length > 0;

  return (
    <section id="estimate" className="relative py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-12"
        />

        {/* Loading Skeleton */}
        {isLoadingInitial ? (
          <div className="mx-auto max-w-4xl rounded-3xl bg-mist-gray border border-zinc-200/80 p-6 sm:p-10 shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : !hasData ? (
          /* Empty State when no brands or services are available */
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
          /* Calculator Widget Container */
          <div className="mx-auto max-w-4xl rounded-3xl bg-mist-gray border border-zinc-200/80 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Select Brand */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-tech-slate mb-2">
                  {t("brandLabel")}
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-bold text-tech-slate shadow-xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
                >
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Model */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-tech-slate mb-2">
                  {t("modelLabel")}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoadingModels || models.length === 0}
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-bold text-tech-slate shadow-xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 disabled:opacity-60 cursor-pointer"
                >
                  {isLoadingModels ? (
                    <option>{t("loading")}</option>
                  ) : models.length > 0 ? (
                    models.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <option value="">{tCommon("emptyState.noModelsTitle")}</option>
                  )}
                </select>
              </div>

              {/* Step 3: Select Service / Issue */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-tech-slate mb-2">
                  {t("serviceLabel")}
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-bold text-tech-slate shadow-xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quote & Turnaround Result Card */}
            <div className="mt-8 rounded-2xl bg-tech-slate p-6 sm:p-8 text-clean-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-electric-amber">
                  {t("estimatedCost")}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-heading text-clean-white">
                    {computedPrice !== null
                      ? `₹${computedPrice.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                  {computedPrice !== null && (
                    <span className="text-xs text-zinc-400 font-medium">
                      ({t("startingFrom")})
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-flash-orange" />
                    <span>
                      {estimatedTime} {t("mins")} {t("turnaround")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-flash-orange" />
                    <span>
                      {warranty} {t("daysWarranty")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-flash-orange" />
                    <span>OEM Parts</span>
                  </div>
                </div>
              </div>

              <Link
                href="/book-repair"
                className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-flash-orange px-8 py-4 text-base font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all shrink-0"
              >
                <span>{t("bookThisRepair")}</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500 font-medium">
              {t("disclaimer")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
