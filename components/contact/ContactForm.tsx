"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import contactConfig from "@/config/contact";

export default function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [subject, setSubject] = useState("Phone Repair Quote / Inquiry");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const puneAreas = contactConfig.serviceAreas.all;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number (e.g. 8308686454)");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-quickfix-csrf": "quickfix-valid",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          subject: subject.trim(),
          area: area.trim() || undefined,
          message: message.trim(),
          source: "contact_page",
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to send your inquiry. Please try calling directly.");
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please call or WhatsApp us.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleReset = () => {
    setIsSuccess(false);
    setName("");
    setPhone("");
    setEmail("");
    setArea("");
    setMessage("");
    setErrorMessage("");
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl border-2 border-success-green/20 bg-clean-white p-6 sm:p-10 shadow-xl text-center animate-in fade-in-50 zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mist-gray text-success-green mb-5 border border-border-default">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h3 className="font-heading text-2xl font-extrabold text-tech-slate">
          {t("successTitle")}
        </h3>

        <p className="mt-2 text-sm text-text-secondary font-body max-w-md mx-auto leading-relaxed">
          {t("successMsg")}
        </p>

        {/* Immediate Direct Contact Box */}
        <div className="my-6 rounded-2xl bg-tech-slate p-5 text-left text-clean-white">
          <div className="flex items-center justify-between mb-3 border-b border-tech-slate/60 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-electric-amber">
              Need Instant Answer?
            </span>
            <span className="text-xs text-clean-white/70">Available 9am - 9pm</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${contactConfig.phone.value}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-bold text-clean-white hover:bg-flash-orange-hover transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Call Helpline: {contactConfig.phone.display}</span>
            </a>
            <a
              href={contactConfig.whatsapp.getDefaultUrl(`Hi QuickFix, I just submitted an inquiry on your contact page.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-xs font-bold text-clean-white hover:bg-whatsapp-hover transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-bold text-flash-orange hover:underline cursor-pointer"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border-default bg-clean-white p-6 sm:p-10 shadow-xl">
      <div className="mb-6">
        <span className="inline-flex items-center rounded-full bg-flash-orange/10 px-3 py-1 text-xs font-bold text-flash-orange border border-flash-orange/20 mb-2">
          {t("badge")}
        </span>
        <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-tech-slate">
          {t("title")}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          {t("subtitle")}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-error-light border border-error-border p-4 flex items-center gap-3 text-xs sm:text-sm text-error font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 text-error" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Phone in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
            />
          </div>
        </div>

        {/* Email & Pune Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-tech-slate mb-1">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-tech-slate mb-1">
              {t("areaLabel")}
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
            >
              <option value="">{t("areaSelect")}</option>
              {puneAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inquiry Subject */}
        <div>
          <label className="block text-xs font-bold text-tech-slate mb-1">
            {t("subjectLabel")}
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 cursor-pointer"
          >
            <option value="Phone Repair Quote / Inquiry">Phone Repair Quote / Inquiry</option>
            <option value="Warranty & After-Sales Support">Warranty & After-Sales Support</option>
            <option value="Corporate / Bulk Device Repairs">Corporate / Bulk Device Repairs</option>
            <option value="General Question / Other">General Question / Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-tech-slate mb-1">
            {t("messageLabel")} *
          </label>
          <textarea
            required
            rows={3}
            placeholder={t("messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/20 resize-none"
          />
        </div>

        {/* Submit Button with Loader */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-6 py-3.5 text-sm font-extrabold text-clean-white shadow-md hover:bg-flash-orange-hover active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("submitting")}</span>
            </>
          ) : (
            <>
              <span>{t("submitBtn")}</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-zinc-400 font-medium">
          🔒 No passcodes requested. 100% data confidentiality guaranteed.
        </p>
      </form>
    </div>
  );
}
