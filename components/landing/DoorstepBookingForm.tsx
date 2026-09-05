"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Wrench,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import contactConfig from "@/config/contact";

export default function DoorstepBookingForm() {
  const t = useTranslations("BookingSection");
  const locale = useLocale();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingReference: string;
    message: string;
  } | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        throw new Error(data.error?.message || "Failed to book repair. Please try again.");
      }

      setBookingSuccess({
        bookingReference: data.data.bookingReference,
        message: data.data.message,
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="book" className="py-16 lg:py-24 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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
        </div>

        {/* Success Card */}
        {bookingSuccess ? (
          <div className="mx-auto max-w-2xl rounded-3xl bg-clean-white border-2 border-flash-orange p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-flash-orange/10 text-flash-orange mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate">
              {t("successTitle")}
            </h3>

            <p className="mt-3 text-sm text-zinc-600 font-body">
              {t("successNote")}
            </p>

            <div className="my-6 rounded-2xl bg-tech-slate p-6 text-clean-white">
              <span className="text-xs font-bold uppercase tracking-wider text-electric-amber">
                {t("successRef")}
              </span>
              <p className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-clean-white">
                {bookingSuccess.bookingReference}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <a
                href={contactConfig.whatsapp.getBookingUrl(
                  bookingSuccess.bookingReference
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-tech-slate px-6 py-3.5 text-sm font-bold text-clean-white shadow-md hover:bg-black transition-all"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{t("chatWhatsApp")}</span>
              </a>

              <button
                type="button"
                onClick={() => setBookingSuccess(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-mist-gray px-6 py-3.5 text-sm font-bold text-tech-slate hover:bg-zinc-200 transition-all border border-zinc-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>{t("bookAnother")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl rounded-3xl bg-mist-gray border border-zinc-200 p-6 sm:p-10 shadow-xl space-y-8"
          >
            {errorMessage && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-sm text-red-700 font-medium">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Block 1: Device Info */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-4">
                <Wrench className="h-5 w-5 text-flash-orange" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-tech-slate">
                  {t("stepDevice")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("brand")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Apple, Samsung, OnePlus"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("model")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("modelPlaceholder")}
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("issue")} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder={t("issuePlaceholder")}
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
            </div>

            {/* Block 2: Slot & Date */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-4">
                <Calendar className="h-5 w-5 text-flash-orange" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-tech-slate">
                  {t("stepSlot")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("date")} *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("slot")} *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) =>
                      setFormData({ ...formData, timeSlot: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">
                      {t("slotMorning")}
                    </option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">
                      {t("slotAfternoon")}
                    </option>
                    <option value="Evening (4:00 PM - 8:00 PM)">
                      {t("slotEvening")}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block 3: Address & Area in Pune */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-4">
                <MapPin className="h-5 w-5 text-flash-orange" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-tech-slate">
                  {t("stepLocation")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("area")} *
                  </label>
                  <select
                    required
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  >
                    <option value="">{t("areaSelect")}</option>
                    {puneAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("address")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("addressPlaceholder")}
                    value={formData.streetAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, streetAddress: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("pincode")} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="411xxx"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("landmark")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("landmarkPlaceholder")}
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
              </div>
            </div>

            {/* Block 4: Customer Details */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-4">
                <User className="h-5 w-5 text-flash-orange" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-tech-slate">
                  {t("stepContact")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("name")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("namePlaceholder")}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder={t("phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-tech-slate mb-1">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-3 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-500 font-medium text-center sm:text-left">
                ✓ Pay only after repair • 90-day warranty card issued on spot
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-flash-orange px-8 py-4 text-base font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>{isSubmitting ? t("submitting") : t("submitBtn")}</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
