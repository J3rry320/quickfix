"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PhoneCall, Send, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import contactConfig from "@/config/contact";

export default function QuickContactForm() {
  const t = useTranslations("ContactSection");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-quickfix-csrf": "quickfix-valid",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim() || undefined,
          message: message.trim() || "5-Minute Callback Request from Landing Page",
          source: "landing_callback_card",
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit request.");
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
      setArea("");
      setMessage("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
              <PhoneCall className="h-3.5 w-3.5" />
              {t("badge")}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="mt-6 sm:mt-8 p-5 sm:p-6 rounded-2xl bg-tech-slate text-clean-white shadow-xl max-w-md">
              <p className="text-xs font-bold uppercase tracking-wider text-electric-amber">
                {t("directCall")}
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-flash-orange text-clean-white shadow-md shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <a
                    href={`tel:${contactConfig.phone.value}`}
                    className="font-heading text-xl sm:text-2xl font-black text-clean-white hover:text-flash-orange transition-colors"
                  >
                    {contactConfig.phone.display}
                  </a>
                  <p className="text-[11px] sm:text-xs text-zinc-400 font-medium">
                    {contactConfig.hours.display}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-mist-gray/90 border border-zinc-200/90 p-5 sm:p-8 shadow-lg">
              {isSuccess ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-flash-orange/10 text-flash-orange mb-4">
                    <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-tech-slate">
                    Request Received!
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 font-body max-w-sm mx-auto">
                    {t("successMsg")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-xl bg-tech-slate px-6 py-2.5 text-xs font-bold text-clean-white hover:bg-black transition-all cursor-pointer"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {errorMessage && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-2 text-xs text-red-700 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-tech-slate mb-1">
                        {t("nameLabel")} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("namePlaceholder")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-clean-white px-3.5 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-tech-slate mb-1">
                        {t("phoneLabel")} *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="tel"
                        placeholder={t("phonePlaceholder")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-clean-white px-3.5 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tech-slate mb-1">
                      {t("areaLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("areaPlaceholder")}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-clean-white px-3.5 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tech-slate mb-1">
                      {t("messageLabel")}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={t("messagePlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-clean-white px-3.5 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-flash-orange px-6 py-3.5 text-sm font-extrabold text-clean-white shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isSubmitting ? t("submitting") : t("submitBtn")}</span>
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
