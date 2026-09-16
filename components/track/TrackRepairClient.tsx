"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Wrench,
  Smartphone,
  RotateCcw,
  Loader2,
} from "lucide-react";
import contactConfig from "@/config/contact";

interface TrackedRepair {
  bookingReference: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  device?: {
    brand?: string;
    model?: string;
  };
}

const STATUS_STEPS = [
  { id: "pending", label: "Booking Logged", desc: "Order registered in system" },
  { id: "confirmed", label: "Fleet Assigned", desc: "Technician assigned for pickup" },
  { id: "in_progress", label: "Lab Diagnostic & Repair", desc: "Under precision lab service" },
  { id: "completed", label: "Ready & Delivered", desc: "Device tested & handed over" },
];

function getStatusStepIndex(status: TrackedRepair["status"]): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "in_progress":
      return 2;
    case "completed":
      return 3;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

export default function TrackRepairClient() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [refInput, setRefInput] = useState(initialRef);
  const [tracking, setTracking] = useState<TrackedRepair | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleTrack = (codeToSearch?: string) => {
    const targetRef = (codeToSearch ?? refInput).trim().toUpperCase();
    if (!targetRef) {
      setErrorMessage("Please enter a valid tracking reference code (e.g., QF-2509-ABCDE)");
      setTracking(null);
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-quickfix-csrf": "quickfix-valid",
          },
          body: JSON.stringify({ reference: targetRef }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setTracking(null);
          setErrorMessage(
            data.error?.message ||
              `No repair booking found for "${targetRef}". Please check your code or contact support.`
          );
          return;
        }

        setTracking(data.data.tracking);
      } catch {
        setTracking(null);
        setErrorMessage("Unable to retrieve repair status. Please check your connection and try again.");
      }
    });
  };

  useEffect(() => {
    if (!initialRef) return;
    let isCancelled = false;

    async function checkInitial() {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-quickfix-csrf": "quickfix-valid",
          },
          body: JSON.stringify({ reference: initialRef.trim().toUpperCase() }),
        });
        const data = await res.json();
        if (!isCancelled) {
          if (res.ok && data.success) {
            setTracking(data.data.tracking);
          } else {
            setErrorMessage(
              data.error?.message ||
                `No repair booking found for "${initialRef}". Please check your code or contact support.`
            );
          }
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage(
            "Unable to retrieve repair status. Please check your connection and try again."
          );
        }
      }
    }

    checkInitial();
    return () => {
      isCancelled = true;
    };
  }, [initialRef]);

  const handleReset = () => {
    setRefInput("");
    setTracking(null);
    setErrorMessage("");
  };

  const currentStepIdx = tracking ? getStatusStepIndex(tracking.status) : 0;
  const isCancelled = tracking?.status === "cancelled";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Search Bar Card */}
      <div className="bg-clean-white border border-border-default rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="Enter Booking Reference (e.g. QF-2509-ABCDE)"
              className="w-full pl-10 pr-4 py-3 text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors"
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !refInput.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-heading font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Track Repair</span>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-error-light border border-error-border p-4 flex items-start gap-3 text-xs sm:text-sm text-error"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 border-t border-error-border/60">
                <a
                  href={`tel:${contactConfig.phone.value}`}
                  className="inline-flex items-center gap-1 font-bold hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Helpline</span>
                </a>
                <span className="text-error/60">•</span>
                <a
                  href={contactConfig.whatsapp.getDefaultUrl("Hi QuickFix, I need help checking my repair status.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold hover:underline"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Result Card */}
      {tracking && (
        <div className="bg-clean-white border border-border-default rounded-2xl p-5 sm:p-8 shadow-xs space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
            <div>
              <div className="text-xs font-medium text-text-muted">Booking Reference</div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-tech-slate tracking-tight">
                {tracking.bookingReference}
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {tracking.status === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-electric-amber/15 text-electric-amber border border-electric-amber/30">
                  Booking Received
                </span>
              )}
              {tracking.status === "confirmed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Pickup Fleet Assigned
                </span>
              )}
              {tracking.status === "in_progress" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Lab Repair In Progress
                </span>
              )}
              {tracking.status === "completed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Repaired & Delivered
                </span>
              )}
              {tracking.status === "cancelled" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-error-light text-error border border-error-border">
                  Booking Cancelled
                </span>
              )}
            </div>
          </div>

          {/* Progress Timeline (when not cancelled) */}
          {!isCancelled ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        isCurrent
                          ? "bg-mist-gray/80 border-flash-orange text-tech-slate"
                          : isDone
                          ? "bg-clean-white border-border-default text-tech-slate"
                          : "bg-clean-white border-border-default/60 text-text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isDone
                              ? "bg-flash-orange text-clean-white"
                              : "bg-mist-gray text-text-muted border border-border-default"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="text-xs font-bold font-heading">
                          Step {idx + 1}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold">{step.label}</div>
                      <div className="text-[11px] text-text-muted mt-1 leading-snug">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-error-light border border-error-border p-4 text-xs sm:text-sm text-error">
              This booking request was cancelled. If you believe this is an error or would like to reschedule, please contact our helpline.
            </div>
          )}

          {/* Details Row: Device & Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border-default text-xs">
            {tracking.device?.model && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Smartphone className="h-4 w-4 text-flash-orange shrink-0" />
                <span>
                  Device: <strong className="text-tech-slate">{tracking.device.brand} {tracking.device.model}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-text-secondary sm:justify-end">
              <Wrench className="h-4 w-4 text-text-muted shrink-0" />
              <span>
                Last Updated:{" "}
                <strong className="text-tech-slate">
                  {new Date(tracking.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border-default">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-tech-slate transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Track Another Device</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={contactConfig.whatsapp.getBookingUrl(tracking.bookingReference)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-clean-white border border-border-default hover:bg-mist-gray text-tech-slate transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-flash-orange" />
                <span>WhatsApp Dispatch</span>
              </a>
              <a
                href={`tel:${contactConfig.phone.value}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-flash-orange text-clean-white hover:bg-flash-orange-hover transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
