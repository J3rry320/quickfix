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
  referenceLabel = "Booking Reference",
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
      className={`mx-auto w-full max-w-lg rounded-3xl bg-clean-white border border-border-default/90 p-5 sm:p-7 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {/* Visual Success Icon */}
      <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200/70 shadow-2xs">
        <CheckCircle2 className="h-7 w-7 stroke-[2.2]" aria-hidden="true" />
      </div>

      {badgeLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200/80 mb-2">
          <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
          <span>{badgeLabel}</span>
        </span>
      )}

      <h2 className="font-heading text-xl sm:text-2xl font-black text-tech-slate tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Reference Code Card */}
      {referenceCode && (
        <div className="my-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block leading-tight">
              {referenceLabel}
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-tech-slate tracking-wider block truncate select-all leading-tight mt-0.5">
              {referenceCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy reference code"
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
              copiedRef
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            {copiedRef ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Summary Box */}
      {summaryDetails && summaryDetails.length > 0 && (
        <div className="rounded-2xl bg-zinc-50/70 border border-zinc-200/70 p-3.5 sm:p-4 text-left space-y-2.5 my-4 text-xs">
          {summaryDetails.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start gap-3 border-b border-zinc-200/40 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-zinc-500 font-medium shrink-0 pt-0.5">{item.label}:</span>
              <span className="font-bold text-zinc-900 text-right break-words max-w-[70%]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 space-y-2.5">
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-[0.99]"
        >
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{whatsappLabel}</span>
        </a>

        {(phoneValue || onReset) && (
          <div className={`grid gap-2.5 ${phoneValue && onReset ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {phoneValue && (
              <a
                href={`tel:${phoneValue}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-tech-slate hover:bg-tech-slate/90 px-3 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-[0.99]"
              >
                <Phone className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
                <span className="truncate">Call {phoneDisplay}</span>
              </a>
            )}

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 px-3 py-2.5 text-xs sm:text-sm font-bold text-zinc-700 hover:text-zinc-900 shadow-2xs transition-all cursor-pointer active:scale-[0.99]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{resetLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
