"use client";

import React, { useEffect, useRef } from "react";
import { AlertCircle, MessageSquare, Phone, RotateCcw } from "lucide-react";
import contactConfig from "@/config/contact";

export interface FormErrorStateProps {
  title?: string;
  subtitle?: string;
  message?: string;
  badgeLabel?: string;
  errorCode?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
  phoneValue?: string;
  phoneDisplay?: string;
  className?: string;
  autoScroll?: boolean;
}

export default function FormErrorState({
  title = "Submission Failed",
  subtitle = "We were unable to process your request. Please try again or reach out to our support team directly.",
  message,
  badgeLabel,
  errorCode,
  onRetry,
  retryLabel = "Try Again",
  onReset,
  resetLabel,
  whatsappUrl,
  whatsappLabel = "Chat on WhatsApp Support",
  phoneValue = contactConfig.phone.value,
  phoneDisplay = contactConfig.phone.display,
  className = "",
  autoScroll = true,
}: FormErrorStateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [autoScroll]);

  const handleAction = onRetry || onReset;
  const actionLabel = retryLabel || resetLabel || "Try Again";
  const displaySubtitle = message || subtitle;

  const defaultWhatsappUrl =
    whatsappUrl ||
    contactConfig.whatsapp.getDefaultUrl(
      errorCode
        ? `Hi QuickFix, I encountered an issue (${errorCode}) while submitting my form on your website. Please assist me.`
        : "Hi QuickFix, I encountered an issue while submitting a request on your website. Please assist me."
    );

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="assertive"
      className={`mx-auto max-w-xl rounded-3xl bg-clean-white border border-error-border p-6 sm:p-8 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200 scroll-mt-24 ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error-light text-error mb-4 border border-error-border shadow-2xs">
        <AlertCircle className="h-8 w-8" aria-hidden="true" />
      </div>

      {badgeLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-error-light px-3 py-1 text-2xs font-bold text-error-text border border-error-border mb-2">
          <span>{badgeLabel}</span>
        </span>
      )}

      <h2 className="font-heading text-xl sm:text-2xl font-bold text-tech-slate tracking-tight">
        {title}
      </h2>

      {displaySubtitle && (
        <p className="mt-2 text-xs sm:text-sm text-text-muted font-body max-w-md mx-auto leading-relaxed">
          {displaySubtitle}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mt-6">
        {handleAction && (
          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-flash-orange px-6 py-3.5 text-xs sm:text-sm font-extrabold text-clean-white hover:bg-flash-orange-hover active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{actionLabel}</span>
          </button>
        )}

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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-tech-slate px-5 py-3.5 text-xs sm:text-sm font-bold text-clean-white hover:bg-tech-slate-hover transition-all shadow-sm"
          >
            <Phone className="h-4 w-4 text-flash-orange" aria-hidden="true" />
            <span>Call {phoneDisplay}</span>
          </a>
        )}
      </div>
    </div>
  );
}
