"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Zap,
  Sun,
  Moon,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useBookingWizard, QUICK_SLOTS } from "./BookingWizardContext";

function getSlotIcon(slotId: string) {
  switch (slotId) {
    case "today-express":
      return Zap;
    case "today-afternoon":
      return Sun;
    case "today-evening":
      return Moon;
    case "tomorrow-morning":
      return Calendar;
    default:
      return Clock;
  }
}

export default function StageConfirmBooking() {
  const t = useTranslations("RepairPage.stage3");
  const tSlots = useTranslations("RepairPage.slots");

  const {
    formData,
    updateFormData,
    selectedSlotId,
    useCustomSlot,
    setUseCustomSlot,
    handleSelectQuickSlot,
    todayStr,
    minSelectableDate,
    maxSelectableDate,
    isSlotAvailable,
    getSlotDisabledReason,
    isTimeWindowAvailableForDate,
    goToPrevStage,
    submitBooking,
    isSubmitting,
    fieldErrors,
  } = useBookingWizard();

  // Zod-backed field errors
  const nameError = fieldErrors.name;
  const phoneError = fieldErrors.phone;
  const addressError = fieldErrors.streetAddress;
  const dateError = fieldErrors.date;
  const timeSlotError = fieldErrors.timeSlot;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length >= 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    updateFormData({ phone: digits.slice(0, 10) });
  };

  const getSlotLabel = (slotId: string) => {
    switch (slotId) {
      case "today-express":
        return { label: tSlots("todayExpress"), sub: tSlots("todayExpressSub") };
      case "today-afternoon":
        return { label: tSlots("todayAfternoon"), sub: tSlots("todayAfternoonSub") };
      case "today-evening":
        return { label: tSlots("todayEvening"), sub: tSlots("todayEveningSub") };
      case "tomorrow-morning":
        return { label: tSlots("tomorrowMorning"), sub: tSlots("tomorrowMorningSub") };
      default:
        return { label: slotId, sub: "" };
    }
  };

  const formatDisabledReason = (reason: string | null) => {
    if (!reason) return null;
    if (reason.toLowerCase().includes("closed")) return t("closedToday");
    if (reason.toLowerCase().includes("passed")) return t("slotPassed");
    return reason;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Header */}
      <div>
        <h2
          id="stage-heading"
          tabIndex={-1}
          className="font-heading text-lg sm:text-xl font-black text-tech-slate tracking-tight outline-hidden"
        >
          {t("title")}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          {t("description")}
        </p>
      </div>

      {/* Section 1: Time Slot Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold text-tech-slate">
              {t("slotQuestion")} <span className="text-flash-orange">*</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextVal = !useCustomSlot;
              setUseCustomSlot(nextVal);
              if (nextVal && formData.date < minSelectableDate) {
                updateFormData({ date: minSelectableDate });
              }
            }}
            className="text-xs font-bold text-flash-orange hover:underline cursor-pointer"
          >
            {useCustomSlot ? t("quickSlotsBtn") : t("customSlotBtn")}
          </button>
        </div>

        {!useCustomSlot ? (
          <div>
            <div
              role="radiogroup"
              aria-label={t("slotQuestion")}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {QUICK_SLOTS.map((slotItem) => {
                const isSelected = selectedSlotId === slotItem.id;
                const IconComp = getSlotIcon(slotItem.id);
                const isAvailable = isSlotAvailable(slotItem.id);
                const disabledReason = getSlotDisabledReason(slotItem.id);
                const { label, sub } = getSlotLabel(slotItem.id);

                return (
                  <button
                    type="button"
                    key={slotItem.id}
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) handleSelectQuickSlot(slotItem);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[76px] ${
                      !isAvailable
                        ? "border-border-default bg-surface-hover/60 text-text-muted cursor-not-allowed select-none opacity-60"
                        : isSelected
                        ? "border-flash-orange bg-flash-orange/5 text-tech-slate shadow-xs ring-2 ring-flash-orange/20 cursor-pointer"
                        : "border-border-default bg-clean-white text-tech-slate hover:border-border-strong hover:bg-surface-hover cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                            !isAvailable
                              ? "bg-surface-disabled text-text-muted"
                              : isSelected
                              ? "bg-flash-orange text-clean-white"
                              : "bg-mist-gray text-tech-slate"
                          }`}
                        >
                          <IconComp className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight truncate ${
                            !isAvailable
                              ? "text-text-muted"
                              : isSelected
                              ? "text-flash-orange"
                              : "text-tech-slate"
                          }`}
                        >
                          {label}
                        </span>
                      </div>

                      {!isAvailable && disabledReason && (
                        <span className="text-[10px] font-semibold text-text-muted bg-surface-disabled px-1.5 py-0.5 rounded-md shrink-0">
                          {formatDisabledReason(disabledReason)}
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-2xs font-semibold mt-2 pl-8 ${
                        !isAvailable ? "text-text-muted line-through decoration-border-strong" : "text-text-muted"
                      }`}
                    >
                      {sub}
                    </div>
                  </button>
                );
              })}
            </div>
            {(dateError || timeSlotError) && (
              <p role="alert" className="mt-2 text-2xs text-error flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{dateError || timeSlotError}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-elevated-surface border border-border-default">
              <div>
                <label
                  htmlFor="customDate"
                  className="block text-2xs font-semibold text-text-muted mb-1.5"
                >
                  {t("selectDateLabel")}
                </label>
                <input
                  id="customDate"
                  type="date"
                  min={minSelectableDate}
                  max={maxSelectableDate}
                  value={formData.date}
                  aria-invalid={Boolean(dateError)}
                  aria-describedby={dateError ? "custom-date-error" : undefined}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    let nextSlot = formData.timeSlot;
                    if (newDate === todayStr && !isTimeWindowAvailableForDate(formData.timeSlot, todayStr)) {
                      if (isTimeWindowAvailableForDate("Morning (10:00 AM - 1:00 PM)", todayStr)) {
                        nextSlot = "Morning (10:00 AM - 1:00 PM)";
                      } else if (isTimeWindowAvailableForDate("Afternoon (1:00 PM - 4:00 PM)", todayStr)) {
                        nextSlot = "Afternoon (1:00 PM - 4:00 PM)";
                      } else if (isTimeWindowAvailableForDate("Evening (4:00 PM - 8:00 PM)", todayStr)) {
                        nextSlot = "Evening (4:00 PM - 8:00 PM)";
                      }
                    }
                    updateFormData({ date: newDate, timeSlot: nextSlot });
                  }}
                  className={`w-full h-11 rounded-xl border px-3 text-xs font-semibold text-tech-slate focus-visible:ring-2 focus-visible:outline-hidden ${
                    dateError
                      ? "border-error bg-error-light/40 focus-visible:ring-error"
                      : "border-border-default bg-clean-white focus-visible:ring-flash-orange"
                  }`}
                />
                {dateError && (
                  <p id="custom-date-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                    <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{dateError}</span>
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="customSlot"
                  className="block text-2xs font-semibold text-text-muted mb-1.5"
                >
                  {t("timeWindowLabel")}
                </label>
                <select
                  id="customSlot"
                  value={formData.timeSlot}
                  aria-invalid={Boolean(timeSlotError)}
                  aria-describedby={timeSlotError ? "custom-slot-error" : undefined}
                  onChange={(e) => updateFormData({ timeSlot: e.target.value })}
                  className={`w-full h-11 rounded-xl border px-3 text-xs font-semibold text-tech-slate cursor-pointer focus-visible:ring-2 focus-visible:outline-hidden ${
                    timeSlotError
                      ? "border-error bg-error-light/40 focus-visible:ring-error"
                      : "border-border-default bg-clean-white focus-visible:ring-flash-orange"
                  }`}
                >
                  <option
                    value="Morning (10:00 AM - 1:00 PM)"
                    disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Morning (10:00 AM - 1:00 PM)", todayStr)}
                  >
                    Morning (10:00 AM – 1:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Morning (10:00 AM - 1:00 PM)", todayStr) ? t("passedBadge") : ""}
                  </option>
                  <option
                    value="Afternoon (1:00 PM - 4:00 PM)"
                    disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Afternoon (1:00 PM - 4:00 PM)", todayStr)}
                  >
                    Afternoon (1:00 PM – 4:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Afternoon (1:00 PM - 4:00 PM)", todayStr) ? t("passedBadge") : ""}
                  </option>
                  <option
                    value="Evening (4:00 PM - 8:00 PM)"
                    disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Evening (4:00 PM - 8:00 PM)", todayStr)}
                  >
                    Evening (4:00 PM – 8:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Evening (4:00 PM - 8:00 PM)", todayStr) ? t("passedBadge") : ""}
                  </option>
                </select>
                {timeSlotError && (
                  <p id="custom-slot-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                    <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{timeSlotError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Doorstep Address in Pune (Simplified & Optional) */}
      <div className="space-y-3 pt-5 border-t border-border-default/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold text-tech-slate">
              {t("addressHeading")}
            </span>
          </div>
          <span className="text-2xs font-semibold text-text-muted bg-surface-hover px-2 py-0.5 rounded-md">
            {t("optionalBadge")}
          </span>
        </div>

        <div>
          <label
            htmlFor="streetAddress"
            className="block text-2xs font-semibold text-text-muted mb-1.5"
          >
            {t("singleLineAddressLabel")}
          </label>
          <input
            id="streetAddress"
            type="text"
            autoComplete="street-address"
            placeholder={t("singleLineAddressPlaceholder")}
            value={formData.streetAddress}
            onChange={(e) => updateFormData({ streetAddress: e.target.value })}
            aria-invalid={Boolean(addressError)}
            aria-describedby={addressError ? "address-error" : "address-hint"}
            className={`w-full h-11 rounded-xl border px-3.5 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus-visible:ring-2 focus-visible:outline-hidden transition-colors ${
              addressError
                ? "border-error bg-error-light/40 focus-visible:ring-error"
                : "border-border-default bg-elevated-surface focus-visible:ring-flash-orange"
            }`}
          />
          {addressError ? (
            <p id="address-error" className="mt-1.5 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{addressError}</span>
            </p>
          ) : (
            <p id="address-hint" className="mt-1.5 text-2xs text-text-muted leading-relaxed">
              {t("singleLineAddressHint")}
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Contact Details */}
      <div className="space-y-3 pt-5 border-t border-border-default/70">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold text-tech-slate">
            {t("contactHeading")} <span className="text-flash-orange">*</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="name"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              {t("nameLabel")} <span className="text-flash-orange">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "name-error" : undefined}
              className={`w-full h-11 rounded-xl border px-3.5 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus-visible:ring-2 focus-visible:outline-hidden transition-colors ${
                nameError
                  ? "border-error bg-error-light/40 focus-visible:ring-error"
                  : "border-border-default bg-elevated-surface focus-visible:ring-flash-orange"
              }`}
            />
            {nameError && (
              <p id="name-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              {t("phoneLabel")} <span className="text-flash-orange">*</span>
            </label>
            <div
              className={`relative flex h-11 rounded-xl border transition-colors focus-within:bg-clean-white focus-within:ring-2 ${
                phoneError
                  ? "border-error bg-error-light/40 focus-within:ring-error"
                  : "border-border-default bg-elevated-surface focus-within:ring-flash-orange"
              }`}
            >
              <span className="inline-flex items-center px-3 text-xs font-bold text-text-muted border-r border-border-default select-none">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                spellCheck={false}
                maxLength={10}
                placeholder={t("phonePlaceholder")}
                value={formData.phone}
                onChange={handlePhoneChange}
                aria-invalid={Boolean(phoneError)}
                aria-describedby={phoneError ? "phone-error" : undefined}
                className="w-full bg-transparent px-3 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-text-muted focus:outline-hidden"
              />
            </div>
            {phoneError && (
              <p id="phone-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{phoneError}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Action Buttons (Sticky on Mobile) */}
      <div className="sticky bottom-0 -mx-5 -mb-5 sm:mb-0 sm:mx-0 p-4 sm:p-0 sm:pt-6 sm:static bg-clean-white/95 backdrop-blur-md sm:bg-transparent border-t border-border-default/70 flex items-center justify-between gap-3 z-10 transition-all">
        <button
          type="button"
          onClick={goToPrevStage}
          className="h-11 inline-flex items-center gap-1.5 rounded-xl border border-border-default px-4 text-xs sm:text-sm font-bold text-tech-slate hover:bg-surface-hover cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("backBtn")}</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-6 sm:px-8 text-xs sm:text-sm font-black text-clean-white shadow-md shadow-flash-orange/20 hover:bg-flash-orange-hover hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? t("confirmingBtn") : t("confirmBtn")}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}


