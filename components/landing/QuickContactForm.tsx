"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Loader2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import SectionHeader from "@/components/landing/SectionHeader";
import contactConfig from "@/config/contact";
import GoogleMapEmbed from "@/components/contact/GoogleMapEmbed";
import { FormLoadingState, FormSuccessState } from "@/components/ui/form-states";
import { quickContactSchema } from "@/lib/validations/contact";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

    const result = quickContactSchema.safeParse({
      name: name.trim(),
      phone: cleanPhone,
      area: area.trim() || undefined,
      message: message.trim() || undefined,
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
      setErrorMessage(result.error.issues[0]?.message || "Please check the highlighted fields.");
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
          area: area.trim() || undefined,
          message: message.trim() || "5-Minute Callback Request from Landing Page",
          source: "landing_callback_card",
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
        throw new Error(data.error?.message || "Failed to submit request.");
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
      setArea("");
      setMessage("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred. Please call or WhatsApp us.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-mist-gray/30 border-b border-border-default/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Header, Quick Direct Contact & Interactive Google Map */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <SectionHeader
                title={t("title")}
                subtitle={t("subtitle")}
                align="left"
                className="mb-0"
              />
            </div>

            {/* Quick Action Contact Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Helpline Call Card */}
              <a
                href={`tel:${contactConfig.phone.value}`}
                className="group flex items-center gap-3.5 p-4 rounded-2xl border border-border-default/80 bg-clean-white hover:border-flash-orange/40 hover:shadow-xs transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange group-hover:bg-flash-orange group-hover:text-clean-white transition-colors shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    {t("directCall")}
                  </div>
                  <div className="text-sm font-black text-tech-slate truncate font-mono">
                    {contactConfig.phone.display}
                  </div>
                  <div className="text-2xs text-text-muted mt-0.5">
                    {contactConfig.hours.time}
                  </div>
                </div>
              </a>

              {/* WhatsApp Support Card */}
              <a
                href={contactConfig.whatsapp.getDefaultUrl("Hello QuickFix, I need advice regarding a mobile repair in Pune.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 rounded-2xl border border-border-default bg-clean-white hover:border-whatsapp/40 hover:shadow-xs transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist-gray text-whatsapp group-hover:bg-whatsapp group-hover:text-clean-white transition-colors shrink-0 border border-border-default">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    WhatsApp Chat
                  </div>
                  <div className="text-sm font-black text-tech-slate truncate">
                    Instant Quote
                  </div>
                  <div className="text-2xs text-whatsapp font-semibold mt-0.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                    Online Now
                  </div>
                </div>
              </a>
            </div>

            {/* Google Maps Hub Embed Card */}
            <div className="rounded-2xl border border-border-default bg-clean-white p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-flash-orange" />
                  <span className="font-extrabold text-tech-slate">
                    Sadashiv Peth Central Hub
                  </span>
                </div>
                <span className="text-2xs text-text-muted font-medium">
                  Doorstep Dispatch: 30-45 Mins
                </span>
              </div>

              <GoogleMapEmbed
                heightClass="h-44 sm:h-52"
                showCardHeader={false}
                title="QuickFix Sadashiv Peth Hub Google Map"
              />

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-border-default/60 text-xs">
                <span className="text-2xs text-text-muted font-medium truncate pr-2">
                  📍 {contactConfig.address.short} ({contactConfig.address.landmark})
                </span>
                <a
                  href={contactConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-2xs font-bold text-flash-orange hover:text-flash-orange-hover hover:underline shrink-0"
                >
                  <span>Open in Maps</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, High-Conversion Callback Form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-border-default/90 bg-clean-white p-6 sm:p-8 lg:p-9 shadow-sm">
              {isSubmitting ? (
                <FormLoadingState
                  title="Requesting Quick Callback…"
                  subtitle="Connecting with Pune on-call technician. Please wait."
                />
              ) : isSuccess ? (
                <FormSuccessState
                  title="Callback Request Received!"
                  subtitle={t("successMsg")}
                  badgeLabel="Logged for Instant Callback"
                  onReset={() => setIsSuccess(false)}
                  resetLabel="Send Another Request"
                  whatsappUrl={contactConfig.whatsapp.getDefaultUrl("Hi QuickFix, I just requested a 5-minute callback on your website.")}
                  whatsappLabel="Chat on WhatsApp with Support"
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h3 className="font-heading text-lg sm:text-xl font-black text-tech-slate">
                      Request a 5-Minute Callback
                    </h3>
                    <p className="text-xs text-text-muted font-body mt-0.5">
                      Share your issue and our certified technician will call you back shortly.
                    </p>
                  </div>

                  {errorMessage && Object.keys(fieldErrors).length === 0 && (
                    <div className="rounded-xl bg-error-light border border-error-border p-3.5 flex items-center gap-2.5 text-xs text-error font-medium animate-in fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-tech-slate mb-1.5">
                        {t("nameLabel")} <span className="text-flash-orange">*</span>
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
                        aria-describedby={fieldErrors.name ? "quick-name-error" : undefined}
                        className={`w-full rounded-xl border bg-surface-hover/50 px-3.5 py-2.5 text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.name
                            ? "border-error focus:ring-error/15"
                            : "border-border-default focus:border-flash-orange focus:ring-flash-orange/15"
                        }`}
                      />
                      {fieldErrors.name && (
                        <p id="quick-name-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>{fieldErrors.name}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-tech-slate mb-1.5">
                        {t("phoneLabel")} <span className="text-flash-orange">*</span>
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
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ""));
                          clearFieldError("phone");
                        }}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={fieldErrors.phone ? "quick-phone-error" : undefined}
                        className={`w-full rounded-xl border bg-surface-hover/50 px-3.5 py-2.5 text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.phone
                            ? "border-error focus:ring-error/15"
                            : "border-border-default focus:border-flash-orange focus:ring-flash-orange/15"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p id="quick-phone-error" className="mt-1 text-2xs text-error flex items-center gap-1 font-medium animate-in fade-in duration-150">
                          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>{fieldErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tech-slate mb-1.5">
                      {t("areaLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("areaPlaceholder", {
                        areas: contactConfig.serviceAreas.popular.slice(0, 2).join(", "),
                      })}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-border-default bg-surface-hover/50 px-3.5 py-2.5 text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tech-slate mb-1.5">
                      {t("messageLabel")}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={t("messagePlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-border-default bg-surface-hover/50 px-3.5 py-2.5 text-sm font-medium text-tech-slate placeholder:text-text-muted focus:bg-clean-white focus:border-flash-orange focus:outline-hidden focus:ring-2 focus:ring-flash-orange/15 resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-6 py-3.5 text-sm font-black text-clean-white shadow-md shadow-flash-orange/20 hover:bg-flash-orange-hover active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
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

                  {/* Trust Signals Footer */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-2xs text-text-muted font-medium">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-electric-amber" />
                      <span>15-Min Response</span>
                    </span>
                    <span className="text-border-default">•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-success-green" />
                      <span>Zero Obligation Quote</span>
                    </span>
                    <span className="text-border-default">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-flash-orange" />
                      <span>Pune 9 AM - 9 PM</span>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
