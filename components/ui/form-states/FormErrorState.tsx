"use client";

import React from "react";
import { AlertCircle, AlertTriangle, MessageSquare, Phone, RotateCcw } from "lucide-react";
import contactConfig from "@/config/contact";

export interface FormErrorStateProps {
  title?: string;
  subtitle?: string;
  message?: string;
  badgeLabel?: string;
  errorCode?: string;
  errorDetails?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
  phoneValue?: string;
  phoneDisplay?: string;
  className?: string;
}

export default function FormErrorState({
  title = "Submission Failed",
  subtitle = "We couldn't process your request. Please try again or reach out to our Pune support team directly.",
  message,
  badgeLabel = "Action Required",
  errorCode,
  errorDetails,
  onRetry,
  retryLabel = "Try Again",
  onReset,
  resetLabel,
  whatsappUrl,
  whatsappLabel = "Chat on WhatsApp Support",
  phoneValue = contactConfig.phone.value,
  phoneDisplay = contactConfig.phone.display,
  className = "",
}: FormErrorStateProps) {
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
      role="alert"
      aria-live="assertive"
      className={`mx-auto max-w-2xl rounded-3xl bg-clean-white border border-error-border/60 p-6 sm:p-10 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300 ${className}`}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error-light text-error mb-4 border border-error-border">
        <AlertCircle className="h-9 w-9" aria-hidden="true" />
      </div>

      {badgeLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-error-light px-3.5 py-1 text-xs font-bold text-error border border-error-border mb-2">
          <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{badgeLabel}</span>
        </span>
      )}

      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
        {title}
      </h2>

      {displaySubtitle && (
        <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body max-w-md mx-auto leading-relaxed">
          {displaySubtitle}
        </p>
      )}

      {/* Error Code Tag */}
      {errorCode && (
        <div className="my-4 inline-flex items-center gap-2 rounded-xl bg-mist-gray px-3.5 py-1.5 font-mono text-2xs text-text-muted border border-border-subtle">
          <span className="text-zinc-400">Reference / Code:</span>
          <span className="font-bold text-tech-slate">{errorCode}</span>
        </div>
      )}

      {/* Diagnostic / Error Details */}
      {errorDetails && (
        <div className="my-4 rounded-2xl bg-error-light/60 border border-error-border p-4 max-w-md mx-auto text-left text-xs text-error leading-relaxed">
          <p className="font-semibold mb-1 text-2xs uppercase tracking-wider text-error/80">Diagnostic Info</p>
          <p className="text-zinc-700 font-mono text-2xs break-all">{errorDetails}</p>
        </div>
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-tech-slate px-5 py-3.5 text-xs sm:text-sm font-bold text-clean-white hover:bg-tech-slate/90 transition-all shadow-sm"
          >
            <Phone className="h-4 w-4 text-flash-orange" aria-hidden="true" />
            <span>Call {phoneDisplay}</span>
          </a>
        )}
      </div>
    </div>
  );
}
