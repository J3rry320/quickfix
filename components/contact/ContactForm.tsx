"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import contactConfig from "@/config/contact";
import { contactFormSchema } from "@/lib/validations/contact";

import { FormLoadingState, FormSuccessState } from "@/components/ui/form-states";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const puneAreas = contactConfig.serviceAreas.all;

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const cleanPhone = phone.replace(/\D/g, "");

    // Client-side Zod validation
    const result = contactFormSchema.safeParse({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim() || undefined,
      subject: subject.trim(),
      area: area.trim() || undefined,
      message: message.trim(),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[issue.path.length - 1] as string;
        if (key && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      setErrorMessage(result.error.issues[0]?.message || "Please correct the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

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
        if (data.error?.details && typeof data.error.details === "object") {
          const sErrors: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.error.details)) {
            const field = k.split(".").pop() || k;
            sErrors[field] = String(v);
          }
          setFieldErrors(sErrors);
        }
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

  if (isSubmitting) {
    return (
      <FormLoadingState
        title="Submitting Your Inquiry…"
        subtitle="Connecting with QuickFix Pune support desk. Please hold on."
      />
    );
  }

  if (isSuccess) {
    return (
      <FormSuccessState
        title={t("successTitle")}
        subtitle={t("successMsg")}
        badgeLabel="Inquiry Dispatched to Pune Desk"
        summaryDetails={[
          { label: "Name", value: name },
          { label: "Phone", value: phone },
          ...(area ? [{ label: "Pune Locality", value: area }] : []),
          { label: "Inquiry Type", value: subject },
        ]}
        onReset={handleReset}
        resetLabel={t("sendAnother")}
        whatsappUrl={contactConfig.whatsapp.getDefaultUrl(`Hi QuickFix, I just submitted an inquiry from ${name} regarding ${subject}.`)}
        whatsappLabel="Chat on WhatsApp with Support"
      />
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

      {errorMessage && Object.keys(fieldErrors).length === 0 && (
        <div className="mb-6 rounded-xl bg-error-light border border-error-border p-4 flex items-center gap-3 text-xs sm:text-sm text-error font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 text-error" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
              className={`w-full rounded-xl border bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:outline-hidden focus:ring-2 ${
                fieldErrors.name
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-zinc-300 focus:border-flash-orange focus:ring-flash-orange/20"
              }`}
            />
            {fieldErrors.name && (
              <p id="contact-name-error" className="mt-1 text-2xs text-red-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{fieldErrors.name}</span>
              </p>
            )}
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
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                clearFieldError("phone");
              }}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
              className={`w-full rounded-xl border bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:outline-hidden focus:ring-2 ${
                fieldErrors.phone
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-zinc-300 focus:border-flash-orange focus:ring-flash-orange/20"
              }`}
            />
            {fieldErrors.phone && (
              <p id="contact-phone-error" className="mt-1 text-2xs text-red-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{fieldErrors.phone}</span>
              </p>
            )}
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
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
              className={`w-full rounded-xl border bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:outline-hidden focus:ring-2 ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-zinc-300 focus:border-flash-orange focus:ring-flash-orange/20"
              }`}
            />
            {fieldErrors.email && (
              <p id="contact-email-error" className="mt-1 text-2xs text-red-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-tech-slate mb-1">
              {t("areaLabel")}
            </label>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                clearFieldError("area");
              }}
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
            onChange={(e) => {
              setMessage(e.target.value);
              clearFieldError("message");
            }}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
            className={`w-full rounded-xl border bg-clean-white px-4 py-2.5 text-sm font-medium text-tech-slate shadow-2xs focus:outline-hidden focus:ring-2 resize-none ${
              fieldErrors.message
                ? "border-red-500 focus:ring-red-500/20"
                : "border-zinc-300 focus:border-flash-orange focus:ring-flash-orange/20"
            }`}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" className="mt-1 text-2xs text-red-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{fieldErrors.message}</span>
            </p>
          )}
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
