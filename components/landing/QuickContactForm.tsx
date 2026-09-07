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

            {/* WhatsApp Quick Chat & Hub Info */}
            <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5 max-w-md">
              <a
                href={contactConfig.whatsapp.getDefaultUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-clean-white hover:bg-emerald-700 shadow-sm transition-all"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.19 1.564 5.946l-1.664 6.082 6.221-1.632c1.707.935 3.666 1.465 5.751 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                </svg>
                <span>WhatsApp Support</span>
              </a>
              <div className="flex-1 rounded-xl bg-clean-white border border-zinc-200 px-3 py-2 text-2xs font-semibold text-zinc-600 flex items-center justify-center text-center">
                📍 {contactConfig.address.locality}, {contactConfig.address.city}
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
                        placeholder={t("phonePlaceholder", {
                          phone: contactConfig.phone.tenDigit,
                        })}
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
                      placeholder={t("areaPlaceholder", {
                        areas: contactConfig.serviceAreas.popular.slice(0, 2).join(", "),
                      })}
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
