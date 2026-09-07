"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Smartphone,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Home,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import contactConfig from "@/config/contact";

interface BookingSuccessData {
  bookingReference: string;
  message: string;
}

export default function StepByStepBookingWizard() {
  const t = useTranslations("RepairPage");
  const locale = useLocale();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] =
    useState<BookingSuccessData | null>(null);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    issueDescription: "",
    serviceMode: "doorstep",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    area: "",
    streetAddress: "",
    pincode: "",
    landmark: "",
    city: "Pune",
    name: "",
    phone: "",
    email: "",
  });

  const popularBrands = [
    "Apple iPhone",
    "Samsung Galaxy",
    "OnePlus",
    "Xiaomi",
    "Vivo",
    "Oppo",
    "Google Pixel",
    "Realme",
  ];

  const commonIssues = [
    { key: "issueScreen", label: t("step1.issueScreen") },
    { key: "issueBattery", label: t("step1.issueBattery") },
    { key: "issueCharging", label: t("step1.issueCharging") },
    { key: "issueCamera", label: t("step1.issueCamera") },
    { key: "issueBackGlass", label: t("step1.issueBackGlass") },
    { key: "issueWater", label: t("step1.issueWater") },
  ];

  const puneAreas = [
    "Kothrud",
    "Baner",
    "Balewadi",
    "Aundh",
    "Wakad",
    "Hinjawadi Phase 1",
    "Hinjawadi Phase 2",
    "Hinjawadi Phase 3",
    "Viman Nagar",
    "Kalyani Nagar",
    "Kharadi",
    "Magarpatta City",
    "Hadapsar",
    "Shivajinagar",
    "FC Road / Deccan",
    "Camp / MG Road",
    "Bavdhan",
    "Pimple Saudagar",
    "Pashan",
    "Bibwewadi",
    "Katraj",
    "Kondhwa",
    "Other Pune Locality",
  ];

  const validateStep = (step: number): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!formData.brand.trim()) {
        setErrorMessage(t("errors.brandRequired"));
        return false;
      }
      if (!formData.model.trim()) {
        setErrorMessage(t("errors.modelRequired"));
        return false;
      }
      if (!formData.issueDescription.trim()) {
        setErrorMessage(t("errors.issueRequired"));
        return false;
      }
    } else if (step === 2) {
      if (!formData.date) {
        setErrorMessage(t("errors.dateRequired"));
        return false;
      }
    } else if (step === 3) {
      if (!formData.area.trim()) {
        setErrorMessage(t("errors.areaRequired"));
        return false;
      }
      if (!formData.streetAddress.trim()) {
        setErrorMessage(t("errors.addressRequired"));
        return false;
      }
      if (!formData.pincode.trim() || formData.pincode.trim().length < 6) {
        setErrorMessage(t("errors.pincodeRequired"));
        return false;
      }
    } else if (step === 4) {
      if (!formData.name.trim()) {
        setErrorMessage(t("errors.nameRequired"));
        return false;
      }
      const cleanPhone = formData.phone.replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        setErrorMessage(t("errors.phoneRequired"));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
        },
        device: {
          brand: formData.brand.trim() || "Smartphone",
          model: formData.model.trim(),
        },
        issueDescription: formData.issueDescription.trim(),
        serviceMode: formData.serviceMode,
        address: {
          area: formData.area.trim(),
          streetAddress: formData.streetAddress.trim(),
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim() || undefined,
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
        throw new Error(data.error?.message || t("errors.submissionFailed"));
      }

      setBookingSuccess({
        bookingReference: data.data.bookingReference,
        message: data.data.message,
      });
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : t("errors.submissionFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookingSuccess(null);
    setCurrentStep(1);
    setFormData({
      brand: "",
      model: "",
      issueDescription: "",
      serviceMode: "doorstep",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "Morning (10:00 AM - 1:00 PM)",
      area: "",
      streetAddress: "",
      pincode: "",
      landmark: "",
      city: "Pune",
      name: "",
      phone: "",
      email: "",
    });
  };

  if (bookingSuccess) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-clean-white border-2 border-flash-orange p-6 sm:p-12 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-flash-orange/10 text-flash-orange mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate">
          {t("success.title")}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-600 font-body">
          {t("success.subtitle")}
        </p>

        <div className="my-6 rounded-2xl bg-tech-slate p-6 text-clean-white">
          <span className="text-xs font-bold uppercase tracking-wider text-electric-amber">
            {t("success.refLabel")}
          </span>
          <p className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-clean-white">
            {bookingSuccess.bookingReference}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6">
          <a
            href={contactConfig.whatsapp.getBookingUrl(
              bookingSuccess.bookingReference
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-clean-white shadow-md hover:bg-[#20bd5a] transition-all"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{t("success.whatsappCta")}</span>
          </a>

          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-mist-gray px-6 py-3.5 text-sm font-bold text-tech-slate hover:bg-zinc-200 transition-all border border-zinc-200 cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>{t("success.bookAnother")}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-clean-white px-6 py-3.5 text-sm font-bold text-tech-slate hover:bg-zinc-100 transition-all border border-zinc-200"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>{t("success.backHome")}</span>
          </Link>
        </div>
      </div>
    );
  }

  const stepLabels = [
    { num: 1, label: t("steps.step1"), icon: Smartphone },
    { num: 2, label: t("steps.step2"), icon: Calendar },
    { num: 3, label: t("steps.step3"), icon: MapPin },
    { num: 4, label: t("steps.step4"), icon: User },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Visual Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-200 w-full -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-flash-orange transition-all duration-300 -z-0"
            style={{
              width: `${((currentStep - 1) / (stepLabels.length - 1)) * 100}%`,
            }}
          />

          {stepLabels.map((s) => {
            const isDone = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            const StepIcon = s.icon;

            return (
              <div
                key={s.num}
                className="flex flex-col items-center relative z-10 select-none"
              >
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    isDone
                      ? "bg-flash-orange text-clean-white ring-4 ring-orange-100"
                      : isCurrent
                      ? "bg-tech-slate text-clean-white ring-4 ring-zinc-200"
                      : "bg-clean-white border-2 border-zinc-300 text-zinc-400"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold tracking-tight ${
                    isCurrent
                      ? "text-tech-slate"
                      : isDone
                      ? "text-flash-orange"
                      : "text-zinc-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl bg-clean-white border border-zinc-200 p-5 sm:p-8 md:p-10 shadow-xl">
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-xs sm:text-sm text-red-700 font-medium">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Device & Issue */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-tech-slate">
                  {t("step1.title")}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-body">
                  {t("step1.description")}
                </p>
              </div>

              {/* Popular Brand Chips */}
              <div>
                <label className="block text-xs font-bold text-tech-slate mb-2">
                  {t("step1.brandLabel")} *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {popularBrands.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setFormData({ ...formData, brand: b })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        formData.brand === b
                          ? "bg-flash-orange text-clean-white shadow-xs"
                          : "bg-mist-gray text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder={t("step1.brandPlaceholder")}
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                />
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  {t("step1.modelLabel")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("step1.modelPlaceholder")}
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                />
              </div>

              {/* Common Issue Chips & Textarea */}
              <div>
                <label className="block text-xs font-bold text-tech-slate mb-2">
                  {t("step1.commonIssuesTitle")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {commonIssues.map((issue) => (
                    <button
                      type="button"
                      key={issue.key}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          issueDescription: issue.label,
                        })
                      }
                      className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-colors cursor-pointer ${
                        formData.issueDescription === issue.label
                          ? "border-flash-orange bg-flash-orange/10 text-flash-orange shadow-2xs"
                          : "border-zinc-200 bg-mist-gray/80 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {issue.label}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold text-tech-slate mb-1">
                  {t("step1.issueLabel")} *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={t("step1.issuePlaceholder")}
                  value={formData.issueDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issueDescription: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-tech-slate">
                  {t("step2.title")}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-body">
                  {t("step2.description")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1.5">
                  {t("step2.dateLabel")} *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tech-slate mb-2">
                  {t("step2.slotLabel")} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      val: "Morning (10:00 AM - 1:00 PM)",
                      label: t("step2.slotMorning"),
                    },
                    {
                      val: "Afternoon (1:00 PM - 4:00 PM)",
                      label: t("step2.slotAfternoon"),
                    },
                    {
                      val: "Evening (4:00 PM - 8:00 PM)",
                      label: t("step2.slotEvening"),
                    },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.val}
                      onClick={() =>
                        setFormData({ ...formData, timeSlot: s.val })
                      }
                      className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
                        formData.timeSlot === s.val
                          ? "border-flash-orange bg-flash-orange/5 text-tech-slate shadow-sm"
                          : "border-zinc-200 bg-clean-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-flash-orange">
                          {s.val.split(" ")[0]}
                        </span>
                        {formData.timeSlot === s.val && (
                          <Check className="h-4 w-4 text-flash-orange" />
                        )}
                      </div>
                      <p className="text-sm font-bold text-tech-slate">
                        {s.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-mist-gray p-4 flex items-center gap-3 text-xs text-zinc-600 font-medium">
                <ShieldCheck className="h-5 w-5 text-flash-orange shrink-0" />
                <span>{t("step2.expressNote")}</span>
              </div>
            </div>
          )}

          {/* STEP 3: Pune Address & Locality */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-tech-slate">
                  {t("step3.title")}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-body">
                  {t("step3.description")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  {t("step3.areaLabel")} *
                </label>
                <select
                  required
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
                >
                  <option value="">{t("step3.areaSelect")}</option>
                  {puneAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  {t("step3.addressLabel")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("step3.addressPlaceholder")}
                  value={formData.streetAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("step3.pincodeLabel")} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    placeholder={t("step3.pincodePlaceholder")}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("step3.landmarkLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("step3.landmarkPlaceholder")}
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details & Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-tech-slate">
                  {t("step4.title")}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-body">
                  {t("step4.description")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("step4.nameLabel")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("step4.namePlaceholder")}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("step4.phoneLabel")} *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    inputMode="tel"
                    placeholder={t("step4.phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  {t("step4.emailLabel")}
                </label>
                <input
                  type="email"
                  placeholder={t("step4.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-2xl bg-tech-slate p-5 text-clean-white shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-electric-amber mb-3">
                  {t("step4.reviewTitle")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block">
                      {t("step4.reviewDevice")}
                    </span>
                    <span className="font-bold text-clean-white text-sm">
                      {formData.brand} {formData.model}
                    </span>
                    <span className="block text-[11px] text-zinc-300 truncate">
                      {formData.issueDescription}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">
                      {t("step4.reviewSlot")}
                    </span>
                    <span className="font-bold text-clean-white text-sm">
                      {formData.date}
                    </span>
                    <span className="block text-[11px] text-zinc-300">
                      {formData.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">
                      {t("step4.reviewLocation")}
                    </span>
                    <span className="font-bold text-clean-white text-sm">
                      {formData.area || "Pune"}
                    </span>
                    <span className="block text-[11px] text-zinc-300 truncate">
                      {formData.streetAddress} {formData.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-zinc-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-xl bg-mist-gray px-5 py-3 text-xs sm:text-sm font-bold text-tech-slate hover:bg-zinc-200 transition-colors border border-zinc-200 cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>{t("navigation.btnBack")}</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-7 py-3 text-xs sm:text-sm font-extrabold text-clean-white shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{t("navigation.btnNext")}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-8 py-3.5 text-sm sm:text-base font-extrabold text-clean-white shadow-xl hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? t("navigation.btnSubmitting")
                    : t("navigation.btnSubmit")}
                </span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Trust Highlights Strip below form */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl bg-clean-white border border-zinc-200/80 p-3 shadow-2xs">
          <p className="text-[11px] font-bold text-tech-slate">
            {t("trustPoints.payAfter")}
          </p>
        </div>
        <div className="rounded-xl bg-clean-white border border-zinc-200/80 p-3 shadow-2xs">
          <p className="text-[11px] font-bold text-tech-slate">
            {t("trustPoints.warranty")}
          </p>
        </div>
        <div className="rounded-xl bg-clean-white border border-zinc-200/80 p-3 shadow-2xs">
          <p className="text-[11px] font-bold text-tech-slate">
            {t("trustPoints.privacy")}
          </p>
        </div>
        <div className="rounded-xl bg-clean-white border border-zinc-200/80 p-3 shadow-2xs">
          <p className="text-[11px] font-bold text-tech-slate">
            {t("trustPoints.freeDoorstep")}
          </p>
        </div>
      </div>
    </div>
  );
}
