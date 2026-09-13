"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  BrandItem,
  ModelItem,
  ServiceItem,
  BookingSuccessData,
  BookingFormData,
  QuickSlot,
} from "./types";

export const QUICK_SLOTS: QuickSlot[] = [
  {
    id: "today-express",
    dateOffset: 0,
    slot: "Express (Within 45 Mins)",
    label: "Express Dispatch",
    sub: "Within 45 mins",
  },
  {
    id: "today-afternoon",
    dateOffset: 0,
    slot: "Afternoon (1:00 PM - 4:00 PM)",
    label: "Today Afternoon",
    sub: "1:00 PM – 4:00 PM",
  },
  {
    id: "today-evening",
    dateOffset: 0,
    slot: "Evening (4:00 PM - 8:00 PM)",
    label: "Today Evening",
    sub: "4:00 PM – 8:00 PM",
  },
  {
    id: "tomorrow-morning",
    dateOffset: 1,
    slot: "Morning (10:00 AM - 1:00 PM)",
    label: "Tomorrow Morning",
    sub: "10:00 AM – 1:00 PM",
  },
];

interface BookingWizardContextType {
  // Stage
  currentStage: 1 | 2 | 3;
  setStage: (stage: 1 | 2 | 3) => void;
  goToNextStage: () => void;
  goToPrevStage: () => void;

  // Catalog State
  brands: BrandItem[];
  popularBrands: BrandItem[];
  otherBrands: BrandItem[];
  models: ModelItem[];
  popularModels: ModelItem[];
  filteredModels: ModelItem[];
  services: ServiceItem[];
  isLoadingCatalog: boolean;
  isLoadingModels: boolean;

  // Selections
  selectedBrand: BrandItem | null;
  selectedModel: ModelItem | null;
  selectedService: ServiceItem | null;
  modelInput: string;
  dynamicPrice: number | null;
  hasPreFilled: boolean;

  // Slot & Form
  selectedSlotId: string;
  useCustomSlot: boolean;
  formData: BookingFormData;
  todayStr: string;
  tomorrowStr: string;
  minSelectableDate: string;
  currentTimeInMinutes: number | null;
  isSlotAvailable: (slotId: string) => boolean;
  getSlotDisabledReason: (slotId: string) => string | null;
  isTimeWindowAvailableForDate: (timeWindow: string, dateStr: string) => boolean;

  // Status
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  isSubmitting: boolean;
  bookingSuccess: BookingSuccessData | null;

  // Actions
  handleSelectBrand: (brand: BrandItem) => void;
  handleSelectModel: (model: ModelItem | string) => void;
  handleSelectService: (service: ServiceItem) => void;
  setModelInput: (val: string) => void;
  updateFormData: (partial: Partial<BookingFormData>) => void;
  handleSelectQuickSlot: (slot: QuickSlot) => void;
  setUseCustomSlot: (useCustom: boolean) => void;
  submitBooking: () => Promise<void>;
  resetWizard: () => void;
}

const BookingWizardContext = createContext<BookingWizardContextType | null>(null);

export function BookingWizardProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const searchParams = useSearchParams();

  const queryBrand = searchParams?.get("brand") || "";
  const queryModel = searchParams?.get("model") || "";
  const queryService = searchParams?.get("service") || "";

  // 3-Stage flow: 1 = Device (Brand + Model), 2 = Service, 3 = Details & Schedule
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessData | null>(null);

  // Catalog state
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Selection state
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modelInput, setModelInput] = useState<string>("");
  const [hasPreFilled, setHasPreFilled] = useState<boolean>(false);

  // Date constants (local timezone)
  const todayDate = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => todayDate.toISOString().split("T")[0], [todayDate]);

  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);
  const tomorrowStr = useMemo(() => tomorrowDate.toISOString().split("T")[0], [tomorrowDate]);

  // Client time tracking (minutes from midnight, client-only to avoid SSR hydration mismatches)
  const [currentTimeInMinutes, setCurrentTimeInMinutes] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeInMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Time-based availability checks
  const isSlotAvailable = useCallback(
    (slotId: string): boolean => {
      if (currentTimeInMinutes === null) return true;
      switch (slotId) {
        case "today-express":
          // Express dispatch operating cutoff: 8:15 PM (20:15 = 1215 mins)
          return currentTimeInMinutes <= 1215;
        case "today-afternoon":
          // Afternoon cutoff: 3:30 PM (15:30 = 930 mins)
          return currentTimeInMinutes < 930;
        case "today-evening":
          // Evening cutoff: 7:30 PM (19:30 = 1170 mins)
          return currentTimeInMinutes < 1170;
        case "tomorrow-morning":
          return true;
        default:
          return true;
      }
    },
    [currentTimeInMinutes]
  );

  const getSlotDisabledReason = useCallback(
    (slotId: string): string | null => {
      if (currentTimeInMinutes === null) return null;
      switch (slotId) {
        case "today-express":
          return currentTimeInMinutes > 1215 ? "Closed for today" : null;
        case "today-afternoon":
          return currentTimeInMinutes >= 930 ? "Slot passed" : null;
        case "today-evening":
          return currentTimeInMinutes >= 1170 ? "Slot passed" : null;
        default:
          return null;
      }
    },
    [currentTimeInMinutes]
  );

  const isTimeWindowAvailableForDate = useCallback(
    (timeWindow: string, dateStr: string): boolean => {
      if (dateStr !== todayStr || currentTimeInMinutes === null) return true;
      const windowLower = timeWindow.toLowerCase();
      if (windowLower.includes("morning")) {
        return currentTimeInMinutes < 750; // 12:30 PM cutoff
      }
      if (windowLower.includes("afternoon")) {
        return currentTimeInMinutes < 930; // 3:30 PM cutoff
      }
      if (windowLower.includes("evening")) {
        return currentTimeInMinutes < 1170; // 7:30 PM cutoff
      }
      return true;
    },
    [currentTimeInMinutes, todayStr]
  );

  const minSelectableDate = useMemo(() => {
    if (currentTimeInMinutes !== null && currentTimeInMinutes > 1215) {
      return tomorrowStr;
    }
    return todayStr;
  }, [currentTimeInMinutes, todayStr, tomorrowStr]);

  // Slot state
  const [selectedSlotId, setSelectedSlotId] = useState<string>("today-express");
  const [useCustomSlot, setUseCustomSlot] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<BookingFormData>({
    brand: "",
    model: "",
    issueDescription: "",
    additionalNotes: "",
    serviceMode: "doorstep",
    date: todayStr,
    timeSlot: "Express (Within 45 Mins)",
    area: "",
    streetAddress: "",
    pincode: "411030",
    name: "",
    phone: "",
  });

  const handleSelectQuickSlot = useCallback(
    (slotItem: QuickSlot) => {
      setSelectedSlotId(slotItem.id);
      setUseCustomSlot(false);

      const slotDate = slotItem.dateOffset === 0 ? todayStr : tomorrowStr;
      setFormData((prev) => ({
        ...prev,
        date: slotDate,
        timeSlot: slotItem.slot,
      }));
    },
    [todayStr, tomorrowStr]
  );

  // Auto-switch to earliest available slot based on current time
  useEffect(() => {
    if (currentTimeInMinutes === null) return;

    const isExpressAvail = currentTimeInMinutes <= 1215;
    const isAfternoonAvail = currentTimeInMinutes < 930;
    const isEveningAvail = currentTimeInMinutes < 1170;

    const earliestAvailableSlot: QuickSlot = isExpressAvail
      ? QUICK_SLOTS[0]
      : isAfternoonAvail
      ? QUICK_SLOTS[1]
      : isEveningAvail
      ? QUICK_SLOTS[2]
      : QUICK_SLOTS[3];

    const isCurrentlySelectedValid =
      (selectedSlotId === "today-express" && isExpressAvail) ||
      (selectedSlotId === "today-afternoon" && isAfternoonAvail) ||
      (selectedSlotId === "today-evening" && isEveningAvail) ||
      selectedSlotId === "tomorrow-morning";

    if (!isCurrentlySelectedValid && !useCustomSlot) {
      handleSelectQuickSlot(earliestAvailableSlot);
    }
  }, [currentTimeInMinutes, selectedSlotId, useCustomSlot, handleSelectQuickSlot]);

  // 1. Initial Data Load from Database APIs
  useEffect(() => {
    let isSubscribed = true;

    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const [brandRes, serviceRes] = await Promise.all([
          fetch("/api/brands").catch(() => null),
          fetch("/api/services").catch(() => null),
        ]);

        let loadedBrands: BrandItem[] = [];
        let loadedServices: ServiceItem[] = [];

        if (brandRes && brandRes.ok) {
          const brandJson = await brandRes.json();
          if (brandJson.success && Array.isArray(brandJson.data?.brands)) {
            loadedBrands = brandJson.data.brands;
          }
        }

        if (serviceRes && serviceRes.ok) {
          const serviceJson = await serviceRes.json();
          if (serviceJson.success && Array.isArray(serviceJson.data?.services)) {
            loadedServices = serviceJson.data.services;
          }
        }

        if (!isSubscribed) return;

        setBrands(loadedBrands);
        setServices(loadedServices);

        // Check for URL query pre-fills
        if (queryBrand && loadedBrands.length > 0) {
          const matchedB =
            loadedBrands.find(
              (b) =>
                b.name.toLowerCase() === queryBrand.toLowerCase() ||
                b.slug.toLowerCase() === queryBrand.toLowerCase()
            ) || {
              name: queryBrand,
              slug: queryBrand.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            };

          setSelectedBrand(matchedB);
          setFormData((prev) => ({ ...prev, brand: matchedB.name }));

          if (queryModel) {
            const mItem: ModelItem = {
              name: queryModel,
              slug: queryModel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            };
            setSelectedModel(mItem);
            setModelInput(queryModel);
            setFormData((prev) => ({ ...prev, model: queryModel }));
          }

          if (queryService && loadedServices.length > 0) {
            const matchedS = loadedServices.find(
              (s) =>
                s.name.toLowerCase().includes(queryService.toLowerCase()) ||
                s.slug.toLowerCase() === queryService.toLowerCase()
            );
            if (matchedS) {
              setSelectedService(matchedS);
              setFormData((prev) => ({ ...prev, issueDescription: matchedS.name }));
            }
          }

          // If brand, model, and service were provided via URL, jump directly to stage 3
          if (queryModel && queryService) {
            setHasPreFilled(true);
            setCurrentStage(3);
          } else if (queryModel) {
            setCurrentStage(2);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog data from DB:", err);
      } finally {
        if (isSubscribed) {
          setIsLoadingCatalog(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isSubscribed = false;
    };
  }, [queryBrand, queryModel, queryService]);

  // 2. Load Models dynamically from DB when Brand changes
  useEffect(() => {
    if (!selectedBrand) return;

    const currentBrand = selectedBrand;
    let isSubscribed = true;

    async function loadModels() {
      setIsLoadingModels(true);
      try {
        const query = currentBrand._id
          ? `brand=${encodeURIComponent(currentBrand._id)}`
          : `brand=${encodeURIComponent(currentBrand.slug)}`;
        const res = await fetch(`/api/models?${query}`).catch(() => null);

        let loadedModels: ModelItem[] = [];
        if (res && res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data?.models)) {
            loadedModels = json.data.models;
          }
        }

        if (isSubscribed) {
          setModels(loadedModels);
        }
      } catch (err) {
        console.error("Failed to load models from DB:", err);
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

  // Brand categorization (Popular vs All from DB)
  const { popularBrands, otherBrands } = useMemo(() => {
    const popular = brands.filter((b) => b.isPopular);
    const popList = popular.length > 0 ? popular : brands.slice(0, 8);
    const others = brands.filter((b) => !popList.some((p) => p.slug === b.slug));
    return { popularBrands: popList, otherBrands: others };
  }, [brands]);

  // Popular models vs filtered list
  const popularModels = useMemo(() => {
    const pop = models.filter((m) => m.isPopular);
    return pop.length > 0 ? pop.slice(0, 8) : models.slice(0, 8);
  }, [models]);

  const filteredModels = useMemo(() => {
    if (!modelInput.trim()) return [];
    return models.filter((m) =>
      m.name.toLowerCase().includes(modelInput.trim().toLowerCase())
    );
  }, [models, modelInput]);

  // Dynamic Price computation
  const dynamicPrice = useMemo(() => {
    if (!selectedService) return null;
    let price = selectedService.startingPrice;

    if (selectedModel?.servicePricing) {
      const custom = selectedModel.servicePricing.find((sp) => {
        if (typeof sp.service === "object" && sp.service !== null) {
          return (
            sp.service.slug === selectedService.slug ||
            sp.service._id === selectedService._id
          );
        }
        return sp.service === selectedService._id;
      });
      if (custom?.price) price = custom.price;
    }
    return price;
  }, [selectedModel, selectedService]);

  // Selection actions
  const handleSelectBrand = useCallback((brand: BrandItem) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setModels([]);
    setModelInput("");
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      brand: brand.name,
      model: "",
    }));
  }, []);

  const handleSelectModel = useCallback(
    (model: ModelItem | string) => {
      if (typeof model === "string") {
        const trimmed = model.trim();
        const matched = models.find(
          (m) => m.name.toLowerCase() === trimmed.toLowerCase()
        );
        setSelectedModel(matched || { name: trimmed, slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
        setModelInput(trimmed);
        setFormData((prev) => ({ ...prev, model: trimmed }));
      } else {
        setSelectedModel(model);
        setModelInput(model.name);
        setFormData((prev) => ({ ...prev, model: model.name }));
      }
      setErrorMessage("");
    },
    [models]
  );

  const handleSelectService = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      issueDescription: service.name,
    }));
  }, []);

  const updateFormData = useCallback((partial: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  // Stage Navigation
  const setStage = useCallback((stage: 1 | 2 | 3) => {
    setErrorMessage("");
    setCurrentStage(stage);
    window.scrollTo({ top: 80, behavior: "smooth" });
  }, []);

  const goToNextStage = useCallback(() => {
    setErrorMessage("");
    if (currentStage === 1) {
      if (!formData.brand.trim()) {
        setErrorMessage("Please select your phone brand.");
        return;
      }
      if (!formData.model.trim()) {
        setErrorMessage("Please select or enter your device model.");
        return;
      }
      setCurrentStage(2);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } else if (currentStage === 2) {
      if (!formData.issueDescription.trim()) {
        setErrorMessage("Please select the repair service or issue needed.");
        return;
      }
      setCurrentStage(3);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  }, [currentStage, formData.brand, formData.model, formData.issueDescription]);

  const goToPrevStage = useCallback(() => {
    setErrorMessage("");
    if (currentStage > 1) {
      setCurrentStage((prev) => (prev - 1) as 1 | 2 | 3);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  }, [currentStage]);

  // Submission handler
  const submitBooking = useCallback(async () => {
    setErrorMessage("");

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number (e.g. 8308686454).");
      return;
    }

    if (!formData.streetAddress.trim() || formData.streetAddress.trim().length < 3) {
      setErrorMessage("Please enter your doorstep address (Flat/Society/Street).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: cleanPhone,
        },
        device: {
          brand: formData.brand.trim() || "Smartphone",
          model: formData.model.trim(),
        },
        issueDescription: formData.additionalNotes?.trim()
          ? `${formData.issueDescription.trim()} - Notes: ${formData.additionalNotes.trim()}`
          : formData.issueDescription.trim(),
        serviceMode: formData.serviceMode || "doorstep",
        address: {
          area: formData.area.trim() || "Pune",
          streetAddress: formData.streetAddress.trim(),
          pincode: formData.pincode.trim() || "411030",
          city: "Pune",
        },
        preferredSlot: {
          date: new Date(formData.date),
          timeSlot: formData.timeSlot,
        },
        locale,
      };

      const res = await fetch("/api/repair-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-quickfix-csrf": "quickfix-valid",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error?.message || "Failed to schedule repair. Please call our helpline."
        );
      }

      setBookingSuccess({
        bookingReference: data.data.bookingReference,
        message: data.data.message,
      });
      window.scrollTo({ top: 60, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to schedule repair. Please call our helpline."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, locale]);

  const resetWizard = useCallback(() => {
    setBookingSuccess(null);
    setCurrentStage(1);
    setSelectedBrand(null);
    setSelectedModel(null);
    setModels([]);
    setSelectedService(null);
    setHasPreFilled(false);
    setModelInput("");
    setErrorMessage("");
    setUseCustomSlot(false);

    const isAllTodayClosed = currentTimeInMinutes !== null && currentTimeInMinutes > 1215;
    const defaultSlot = isAllTodayClosed ? QUICK_SLOTS[3] : QUICK_SLOTS[0];
    const initialDate = isAllTodayClosed ? tomorrowStr : todayStr;

    setSelectedSlotId(defaultSlot.id);
    setFormData({
      brand: "",
      model: "",
      issueDescription: "",
      additionalNotes: "",
      serviceMode: "doorstep",
      date: initialDate,
      timeSlot: defaultSlot.slot,
      area: "",
      streetAddress: "",
      pincode: "411030",
      name: "",
      phone: "",
    });
  }, [currentTimeInMinutes, todayStr, tomorrowStr]);

  const value = useMemo(
    () => ({
      currentStage,
      setStage,
      goToNextStage,
      goToPrevStage,
      brands,
      popularBrands,
      otherBrands,
      models,
      popularModels,
      filteredModels,
      services,
      isLoadingCatalog,
      isLoadingModels,
      selectedBrand,
      selectedModel,
      selectedService,
      modelInput,
      dynamicPrice,
      hasPreFilled,
      selectedSlotId,
      useCustomSlot,
      formData,
      todayStr,
      tomorrowStr,
      minSelectableDate,
      currentTimeInMinutes,
      isSlotAvailable,
      getSlotDisabledReason,
      isTimeWindowAvailableForDate,
      errorMessage,
      setErrorMessage,
      isSubmitting,
      bookingSuccess,
      handleSelectBrand,
      handleSelectModel,
      handleSelectService,
      setModelInput,
      updateFormData,
      handleSelectQuickSlot,
      setUseCustomSlot,
      submitBooking,
      resetWizard,
    }),
    [
      currentStage,
      setStage,
      goToNextStage,
      goToPrevStage,
      brands,
      popularBrands,
      otherBrands,
      models,
      popularModels,
      filteredModels,
      services,
      isLoadingCatalog,
      isLoadingModels,
      selectedBrand,
      selectedModel,
      selectedService,
      modelInput,
      dynamicPrice,
      hasPreFilled,
      selectedSlotId,
      useCustomSlot,
      formData,
      todayStr,
      tomorrowStr,
      minSelectableDate,
      currentTimeInMinutes,
      isSlotAvailable,
      getSlotDisabledReason,
      isTimeWindowAvailableForDate,
      errorMessage,
      isSubmitting,
      bookingSuccess,
      handleSelectBrand,
      handleSelectModel,
      handleSelectService,
      updateFormData,
      handleSelectQuickSlot,
      submitBooking,
      resetWizard,
    ]
  );

  return (
    <BookingWizardContext.Provider value={value}>
      {children}
    </BookingWizardContext.Provider>
  );
}

export function useBookingWizard() {
  const context = useContext(BookingWizardContext);
  if (!context) {
    throw new Error("useBookingWizard must be used within a BookingWizardProvider");
  }
  return context;
}
