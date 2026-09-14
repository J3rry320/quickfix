"use client";

import React, { useState } from "react";
import { CheckCircle2, Check, Copy, MessageSquare, Phone, RotateCcw } from "lucide-react";
import contactConfig from "@/config/contact";

export interface FormSuccessSummaryItem {
  label: string;
  value: string;
}

export interface FormSuccessStateProps {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  referenceCode?: string;
  referenceLabel?: string;
  summaryDetails?: FormSuccessSummaryItem[];
  onReset?: () => void;
  resetLabel?: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
  phoneValue?: string;
  phoneDisplay?: string;
  className?: string;
}

export default function FormSuccessState({
  title = "Request Received Successfully!",
  subtitle = "Our Pune dispatch desk has logged your request and will contact you promptly.",
  badgeLabel = "Confirmed & Dispatched",
  referenceCode,
  referenceLabel = "Booking Reference Code",
  summaryDetails,
  onReset,
  resetLabel = "Submit Another Request",
  whatsappUrl,
  whatsappLabel = "Chat on WhatsApp for Live ETA",
  phoneValue = contactConfig.phone.value,
  phoneDisplay = contactConfig.phone.display,
  className = "",
}: FormSuccessStateProps) {
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopy = () => {
    if (!referenceCode) return;
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const defaultWhatsappUrl =
    whatsappUrl ||
    (referenceCode
      ? contactConfig.whatsapp.getBookingUrl(referenceCode)
      : contactConfig.whatsapp.getDefaultUrl("Hi QuickFix, I just submitted an inquiry on your website."));

  return (
    <div
      className={`mx-auto max-w-2xl rounded-3xl bg-clean-white border border-border-default p-6 sm:p-10 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300 ${className}`}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-success-green mb-4 border border-emerald-200">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>

      {badgeLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-success-green border border-emerald-200 mb-2">
          <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
          <span>{badgeLabel}</span>
        </span>
      )}

      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Reference Code Card (if available) */}
      {referenceCode && (
        <div className="my-6 inline-flex flex-col items-center justify-center rounded-2xl bg-tech-slate px-7 py-4 text-center shadow-md">
          <span className="text-2xs font-bold uppercase tracking-wider text-electric-amber block mb-1">
            {referenceLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-clean-white tracking-widest">
              {referenceCode}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy reference code"
              className="p-1.5 rounded-lg bg-zinc-800 text-clean-white hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {copiedRef ? (
                <Check className="h-4 w-4 text-success-green" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-400" />
              )}
            </button>
          </div>
          {copiedRef && (
            <span className="text-2xs text-success-green font-bold mt-1">Copied to clipboard!</span>
          )}
        </div>
      )}

      {/* Summary Box (if details passed) */}
      {summaryDetails && summaryDetails.length > 0 && (
        <div className="rounded-2xl bg-zinc-50 border border-border-default/90 p-4 max-w-md mx-auto text-left space-y-2 text-xs text-tech-slate mb-6">
          {summaryDetails.map((item, index) => (
            <div key={index} className="flex justify-between gap-4">
              <span className="text-text-muted shrink-0">{item.label}:</span>
              <span className="font-bold text-tech-slate text-right truncate">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mt-6">
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-6 py-3.5 text-xs sm:text-sm font-bold text-clean-white hover:bg-whatsapp-hover transition-all shadow-sm"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          <span>{whatsappLabel}</span>
        </a>

        {phoneValue && (
          <a
            href={`tel:${phoneValue}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-tech-slate px-5 py-3.5 text-xs sm:text-sm font-bold text-clean-white hover:bg-tech-slate/90 transition-all shadow-sm"
          >
            <Phone className="h-4 w-4 text-flash-orange" aria-hidden="true" />
            <span>Call {phoneDisplay}</span>
          </a>
        )}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border-default bg-clean-white px-5 py-3.5 text-xs sm:text-sm font-bold text-tech-slate hover:bg-zinc-50 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
            <span>{resetLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
