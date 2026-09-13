"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Calendar,
  Edit3,
  Check,
} from "lucide-react";
import { useBookingWizard, QUICK_SLOTS } from "./BookingWizardContext";
import contactConfig from "@/config/contact";

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
  const {
    formData,
    updateFormData,
    selectedSlotId,
    useCustomSlot,
    setUseCustomSlot,
    handleSelectQuickSlot,
    todayStr,
    minSelectableDate,
    isSlotAvailable,
    getSlotDisabledReason,
    isTimeWindowAvailableForDate,
    dynamicPrice,
    selectedService,
    goToPrevStage,
    setStage,
    submitBooking,
    isSubmitting,
  } = useBookingWizard();

  const puneAreas = contactConfig.serviceAreas.all;
  const popularAreas = contactConfig.serviceAreas.popular;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking();
  };

  const estimatedTotal =
    dynamicPrice || selectedService?.startingPrice || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-tech-slate tracking-tight">
          3. Confirm & Schedule Doorstep Repair
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          Enter your doorstep address and contact number. Our technician will call 30 minutes before arrival.
        </p>
      </div>

      {/* Appointment Summary Box */}
      <div className="rounded-2xl bg-zinc-50/80 border border-border-default/80 p-4 sm:p-5">
        <div className="pb-3 border-b border-border-default/80">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-flash-orange">
            Booking Summary
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          {/* Device */}
          <div className="flex items-start justify-between sm:block">
            <span className="text-text-muted text-2xs block font-medium">Device</span>
            <div className="font-heading font-extrabold text-tech-slate mt-0.5 flex items-center gap-1.5">
              <span>
                {formData.brand} {formData.model}
              </span>
              <button
                type="button"
                onClick={() => setStage(1)}
                aria-label="Change device"
                className="text-flash-orange hover:underline inline-flex items-center text-2xs font-bold cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-start justify-between sm:block">
            <span className="text-text-muted text-2xs block font-medium">Repair Needed</span>
            <div className="font-heading font-extrabold text-tech-slate mt-0.5 flex items-center gap-1.5">
              <span>{formData.issueDescription}</span>
              <button
                type="button"
                onClick={() => setStage(2)}
                aria-label="Change service"
                className="text-flash-orange hover:underline inline-flex items-center text-2xs font-bold cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Estimated Cost */}
          <div className="flex items-start justify-between sm:block">
            <span className="text-text-muted text-2xs block font-medium">Total Estimate</span>
            <div className="font-heading text-base font-black text-tech-slate mt-0.5 tabular-nums">
              {estimatedTotal > 0 ? `₹${estimatedTotal.toLocaleString("en-IN")}` : "Free Inspection"}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Time Slot Selection */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold text-tech-slate uppercase tracking-wider">
              Preferred Arrival Slot <span className="text-flash-orange">*</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseCustomSlot(!useCustomSlot)}
            className="text-xs font-bold text-flash-orange hover:underline cursor-pointer"
          >
            {useCustomSlot ? "← Use quick slots" : "Pick custom date/time →"}
          </button>
        </div>

        {!useCustomSlot ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {QUICK_SLOTS.map((slotItem) => {
              const isSelected = selectedSlotId === slotItem.id;
              const IconComp = getSlotIcon(slotItem.id);
              const isAvailable = isSlotAvailable(slotItem.id);
              const disabledReason = getSlotDisabledReason(slotItem.id);

              return (
                <button
                  type="button"
                  key={slotItem.id}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (isAvailable) handleSelectQuickSlot(slotItem);
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[76px] ${
                    !isAvailable
                      ? "border-zinc-200/80 bg-zinc-100/60 text-zinc-400 cursor-not-allowed select-none opacity-60"
                      : isSelected
                      ? "border-flash-orange bg-flash-orange/5 text-tech-slate shadow-xs ring-2 ring-flash-orange/20 cursor-pointer"
                      : "border-border-default bg-clean-white text-tech-slate hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                          !isAvailable
                            ? "bg-zinc-200 text-zinc-400"
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
                            ? "text-zinc-400"
                            : isSelected
                            ? "text-flash-orange"
                            : "text-tech-slate"
                        }`}
                      >
                        {slotItem.label}
                      </span>
                    </div>

                    {!isAvailable && disabledReason && (
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-200/80 px-1.5 py-0.5 rounded-md shrink-0">
                        {disabledReason}
                      </span>
                    )}
                  </div>

                  <div
                    className={`text-2xs font-semibold mt-2 pl-8 ${
                      !isAvailable ? "text-zinc-400 line-through decoration-zinc-300" : "text-text-muted"
                    }`}
                  >
                    {slotItem.sub}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50/80 border border-border-default">
            <div>
              <label
                htmlFor="customDate"
                className="block text-2xs font-semibold text-text-muted mb-1.5"
              >
                Select Date
              </label>
              <input
                id="customDate"
                type="date"
                min={minSelectableDate}
                value={formData.date}
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
                className="w-full h-11 rounded-xl border border-border-default bg-clean-white px-3 text-xs font-semibold text-tech-slate focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden"
              />
            </div>
            <div>
              <label
                htmlFor="customSlot"
                className="block text-2xs font-semibold text-text-muted mb-1.5"
              >
                Time Window
              </label>
              <select
                id="customSlot"
                value={formData.timeSlot}
                onChange={(e) => updateFormData({ timeSlot: e.target.value })}
                className="w-full h-11 rounded-xl border border-border-default bg-clean-white px-3 text-xs font-semibold text-tech-slate cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden"
              >
                <option
                  value="Morning (10:00 AM - 1:00 PM)"
                  disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Morning (10:00 AM - 1:00 PM)", todayStr)}
                >
                  Morning (10:00 AM – 1:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Morning (10:00 AM - 1:00 PM)", todayStr) ? "(Passed)" : ""}
                </option>
                <option
                  value="Afternoon (1:00 PM - 4:00 PM)"
                  disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Afternoon (1:00 PM - 4:00 PM)", todayStr)}
                >
                  Afternoon (1:00 PM – 4:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Afternoon (1:00 PM - 4:00 PM)", todayStr) ? "(Passed)" : ""}
                </option>
                <option
                  value="Evening (4:00 PM - 8:00 PM)"
                  disabled={formData.date === todayStr && !isTimeWindowAvailableForDate("Evening (4:00 PM - 8:00 PM)", todayStr)}
                >
                  Evening (4:00 PM – 8:00 PM) {formData.date === todayStr && !isTimeWindowAvailableForDate("Evening (4:00 PM - 8:00 PM)", todayStr) ? "(Passed)" : ""}
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Doorstep Address in Pune */}
      <div className="space-y-3.5 pt-6 border-t border-border-default/70">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold text-tech-slate uppercase tracking-wider">
            Doorstep Location in Pune <span className="text-flash-orange">*</span>
          </span>
        </div>

        {/* Popular Locality Chips */}
        <div className="space-y-2">
          <span className="block text-2xs font-semibold text-text-muted">
            Quick Locality Select:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {popularAreas.map((areaName) => {
              const isSelected = formData.area === areaName;
              return (
                <button
                  type="button"
                  key={areaName}
                  onClick={() => updateFormData({ area: areaName })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-flash-orange text-clean-white shadow-2xs font-bold"
                      : "bg-zinc-100/90 text-tech-slate hover:bg-zinc-200/80"
                  }`}
                >
                  {areaName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locality Dropdown + Street Address */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-1">
            <label
              htmlFor="areaSelect"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              Area / Locality
            </label>
            <select
              id="areaSelect"
              aria-label="Select Pune Locality"
              value={formData.area}
              onChange={(e) => updateFormData({ area: e.target.value })}
              className="w-full h-11 rounded-xl border border-border-default bg-zinc-50/70 px-3 text-xs font-medium text-tech-slate focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden cursor-pointer transition-colors"
            >
              <option value="">Select Pune area…</option>
              {puneAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="streetAddress"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              Doorstep Address (Flat, Society, Street)
            </label>
            <input
              id="streetAddress"
              type="text"
              required
              autoComplete="street-address"
              placeholder="Flat/House no., building/society name, street…"
              value={formData.streetAddress}
              onChange={(e) => updateFormData({ streetAddress: e.target.value })}
              className="w-full h-11 rounded-xl border border-border-default bg-zinc-50/70 px-3.5 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-zinc-400 focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Contact Details */}
      <div className="space-y-3.5 pt-6 border-t border-border-default/70">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-flash-orange shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold text-tech-slate uppercase tracking-wider">
            Contact Details for Technician <span className="text-flash-orange">*</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customerName"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              Your Full Name
            </label>
            <input
              id="customerName"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Rohit Patil"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full h-11 rounded-xl border border-border-default bg-zinc-50/70 px-3.5 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-zinc-400 focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="customerPhone"
              className="block text-2xs font-semibold text-text-muted mb-1.5"
            >
              10-Digit Mobile Number (Call before arrival)
            </label>
            <div className="relative flex h-11 rounded-xl border border-border-default bg-zinc-50/70 focus-within:bg-clean-white focus-within:ring-2 focus-within:ring-flash-orange transition-colors">
              <span className="inline-flex items-center px-3.5 text-xs font-bold text-zinc-500 border-r border-border-default select-none">
                +91
              </span>
              <input
                id="customerPhone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                spellCheck={false}
                maxLength={10}
                placeholder="10-digit mobile number…"
                value={formData.phone}
                onChange={(e) =>
                  updateFormData({
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full bg-transparent px-3.5 text-xs sm:text-sm font-medium text-tech-slate placeholder:text-zinc-400 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-6 border-t border-border-default/70 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goToPrevStage}
          className="h-11 inline-flex items-center gap-1.5 rounded-xl border border-border-default px-4 text-xs sm:text-sm font-bold text-tech-slate hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Services</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-6 sm:px-8 text-xs sm:text-sm font-black text-clean-white shadow-md shadow-flash-orange/20 hover:bg-flash-orange-hover hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden"
        >
          <span>Confirm Booking</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
