"use client";

import React, { useState, useEffect, useRef } from "react";
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
  autoScroll?: boolean;
}

export default function FormSuccessState({
  title = "Request Received Successfully!",
  subtitle = "Thank you! We have received your request and will contact you shortly.",
  badgeLabel,
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
  autoScroll = true,
}: FormSuccessStateProps) {
  const [copiedRef, setCopiedRef] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [autoScroll]);

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
      ref={containerRef}
      role="status"
      aria-live="polite"
      className={`mx-auto w-full max-w-lg rounded-3xl bg-clean-white border border-border-default/90 p-6 sm:p-8 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200 scroll-mt-24 ${className}`}
    >
      {/* Visual Success Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-light text-success mb-3.5 border border-success-border shadow-2xs">
        <CheckCircle2 className="h-8 w-8 stroke-[2.2]" aria-hidden="true" />
      </div>

      {badgeLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-2xs font-bold uppercase tracking-wider text-success-text border border-success-border mb-2">
          <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
          <span>{badgeLabel}</span>
        </span>
      )}

      <h2 className="font-heading text-xl sm:text-2xl font-bold text-tech-slate tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Reference Code Card */}
      {referenceCode && (
        <div className="my-4 rounded-2xl bg-mist-gray border border-border-default p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block leading-tight">
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
                ? "bg-success-light text-success-text border border-success-border"
                : "bg-clean-white text-text-secondary border border-border-default hover:bg-surface-hover hover:text-tech-slate"
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
        <div className="rounded-2xl bg-elevated-surface border border-border-default p-3.5 sm:p-4 text-left space-y-2.5 my-4 text-xs">
          {summaryDetails.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start gap-3 border-b border-border-default/60 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-text-muted font-medium shrink-0 pt-0.5">{item.label}:</span>
              <span className="font-bold text-tech-slate text-right break-words max-w-[70%]">
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-whatsapp hover:bg-whatsapp-hover px-4 py-3 text-xs sm:text-sm font-bold text-clean-white shadow-xs transition-all active:scale-[0.99]"
        >
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{whatsappLabel}</span>
        </a>

        {(phoneValue || onReset) && (
          <div className={`grid gap-2.5 ${phoneValue && onReset ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {phoneValue && (
              <a
                href={`tel:${phoneValue}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-tech-slate hover:bg-tech-slate-hover px-3 py-2.5 text-xs sm:text-sm font-bold text-clean-white shadow-xs transition-all active:scale-[0.99]"
              >
                <Phone className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
                <span className="truncate">Call {phoneDisplay}</span>
              </a>
            )}

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border-default bg-clean-white hover:bg-surface-hover px-3 py-2.5 text-xs sm:text-sm font-bold text-text-secondary hover:text-tech-slate shadow-2xs transition-all cursor-pointer active:scale-[0.99]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="truncate">{resetLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
