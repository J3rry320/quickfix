"use client";

import React, { useState } from "react";
import { CheckCircle2, Check, Copy, MessageSquare, ArrowRight } from "lucide-react";
import { useBookingWizard } from "./BookingWizardContext";
import contactConfig from "@/config/contact";

export default function BookingSuccess() {
  const { bookingSuccess, formData, resetWizard } = useBookingWizard();
  const [copiedRef, setCopiedRef] = useState(false);

  if (!bookingSuccess) return null;

  const handleCopyReference = () => {
    if (!bookingSuccess.bookingReference) return;
    navigator.clipboard.writeText(bookingSuccess.bookingReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-clean-white border border-border-default p-6 sm:p-10 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-success-green mb-4 border border-emerald-200">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-success-green border border-emerald-200 mb-2">
        <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
        <span>Technician Assigned & Confirmed</span>
      </span>

      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
        Doorstep Repair Scheduled!
      </h2>

      <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body max-w-md mx-auto">
        Our dispatch team has received your request. The technician will call you 30 minutes before arrival.
      </p>

      {/* Tracking Reference with 1-Click Copy */}
      <div className="my-6 inline-flex flex-col items-center justify-center rounded-2xl bg-tech-slate px-7 py-4 text-center shadow-md">
        <span className="text-2xs font-bold uppercase tracking-wider text-electric-amber block mb-1">
          Booking Reference Code
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xl sm:text-3xl font-black text-clean-white tracking-widest">
            {bookingSuccess.bookingReference}
          </span>
          <button
            type="button"
            onClick={handleCopyReference}
            aria-label="Copy booking reference"
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

      {/* Appointment Summary Box */}
      <div className="rounded-2xl bg-zinc-50 border border-border-default/90 p-4 max-w-md mx-auto text-left space-y-2 text-xs text-tech-slate mb-6">
        <div className="flex justify-between">
          <span className="text-text-muted">Device:</span>
          <span className="font-bold text-tech-slate">
            {formData.brand} {formData.model}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Repair:</span>
          <span className="font-bold text-tech-slate">{formData.issueDescription}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Scheduled Slot:</span>
          <span className="font-bold text-tech-slate">
            {formData.date} • {formData.timeSlot}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Doorstep Address:</span>
          <span className="font-bold text-tech-slate truncate max-w-[200px]">
            {formData.streetAddress} {formData.area ? `(${formData.area})` : ""}
          </span>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={contactConfig.whatsapp.getBookingUrl(bookingSuccess.bookingReference)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-6 py-3.5 text-xs sm:text-sm font-bold text-clean-white hover:bg-whatsapp-hover transition-all shadow-sm"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          <span>Chat on WhatsApp for Live ETA</span>
        </a>

        <button
          type="button"
          onClick={resetWizard}
          className="inline-flex items-center justify-center rounded-2xl border border-border-default bg-clean-white px-6 py-3.5 text-xs sm:text-sm font-bold text-tech-slate hover:bg-zinc-50 transition-all cursor-pointer"
        >
          Book Another Repair
        </button>
      </div>
    </div>
  );
}
