"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function BookingLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-lg rounded-3xl bg-clean-white border border-border-default p-8 sm:p-12 text-center shadow-lg animate-in fade-in duration-300"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-flash-orange/10 text-flash-orange mb-4">
        <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl sm:text-2xl font-black text-tech-slate">
        Confirming Your Booking…
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-text-muted font-body max-w-sm mx-auto">
        Reserving your appointment slot and assigning technician details.
      </p>
    </div>
  );
}
