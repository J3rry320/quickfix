"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  SearchX,
  X,
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
  { id: "pending", labelKey: "steps.step1Label", descKey: "steps.step1Desc" },
  { id: "confirmed", labelKey: "steps.step2Label", descKey: "steps.step2Desc" },
  { id: "in_progress", labelKey: "steps.step3Label", descKey: "steps.step3Desc" },
  { id: "completed", labelKey: "steps.step4Label", descKey: "steps.step4Desc" },
] as const;

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

function isValidTrackingFormat(code: string): boolean {
  const clean = code.trim().toUpperCase();
  return clean.length >= 5 && clean.length <= 30 && /^[A-Z0-9-]+$/.test(clean);
}

export default function TrackRepairClient() {
  const t = useTranslations("TrackPage");
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [refInput, setRefInput] = useState(initialRef);
  const [tracking, setTracking] = useState<TrackedRepair | null>(null);
  const [notFoundRef, setNotFoundRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeLookupRef = useRef<string | null>(null);

  // Sync URL search param with the current input value without triggering page re-render
  const updateUrlParam = (value: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const clean = value.trim();
    if (clean) {
      url.searchParams.set("ref", clean);
    } else {
      url.searchParams.delete("ref");
    }
    window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
  };

  const executeTrack = (targetRef: string) => {
    const cleanRef = targetRef.trim().toUpperCase();
    if (!cleanRef) return;

    // Prevent duplicate in-flight requests for the exact same reference
    if (activeLookupRef.current === cleanRef && isPending) return;
    activeLookupRef.current = cleanRef;

    startTransition(async () => {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-quickfix-csrf": "quickfix-valid",
          },
          body: JSON.stringify({ reference: cleanRef }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setTracking(null);
          if (res.status === 404 || data.error?.code === "REPAIR_NOT_FOUND") {
            setNotFoundRef(cleanRef);
            setErrorMessage("");
          } else {
            setNotFoundRef(null);
            setErrorMessage(
              data.error?.message ||
                t("errors.unableToRetrieve", { reference: cleanRef })
            );
          }
          return;
        }

        setNotFoundRef(null);
        setErrorMessage("");
        setTracking(data.data.tracking);
      } catch {
        setTracking(null);
        setNotFoundRef(null);
        setErrorMessage(t("errors.networkError"));
      }
    });
  };

  const handleInputChange = (val: string) => {
    setRefInput(val);
    updateUrlParam(val);

    const clean = val.trim().toUpperCase();

    if (!clean) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setTracking(null);
      setNotFoundRef(null);
      setErrorMessage("");
      return;
    }

    // Reset not found / error state if user changes the input
    if (notFoundRef && notFoundRef !== clean) {
      setNotFoundRef(null);
    }
    if (errorMessage) {
      setErrorMessage("");
    }

    // Debounced automatic lookup if the format is valid
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (isValidTrackingFormat(clean)) {
      debounceTimerRef.current = setTimeout(() => {
        executeTrack(clean);
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const clean = refInput.trim().toUpperCase();
    if (!clean) {
      setErrorMessage(t("errors.enterCode"));
      return;
    }
    if (!isValidTrackingFormat(clean)) {
      setErrorMessage(t("errors.invalidFormat"));
      return;
    }
    executeTrack(clean);
  };

  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setRefInput("");
    setTracking(null);
    setNotFoundRef(null);
    setErrorMessage("");
    updateUrlParam("");
  };

  // Initial load check
  useEffect(() => {
    if (!initialRef) return;
    const clean = initialRef.trim().toUpperCase();
    if (isValidTrackingFormat(clean)) {
      const timer = setTimeout(() => {
        executeTrack(clean);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || "";
      setRefInput(ref);
      const clean = ref.trim().toUpperCase();
      if (clean && isValidTrackingFormat(clean)) {
        executeTrack(clean);
      } else {
        setTracking(null);
        setNotFoundRef(null);
        setErrorMessage("");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const currentStepIdx = tracking ? getStatusStepIndex(tracking.status) : 0;
  const isCancelled = tracking?.status === "cancelled";

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Search Bar Card */}
      <div className="bg-clean-white border border-border-default rounded-2xl p-3 sm:p-4 shadow-xs mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm bg-mist-gray/50 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors uppercase font-medium"
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
            />
            {refInput && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-text-muted hover:text-tech-slate hover:bg-mist-gray transition-colors cursor-pointer"
                aria-label={t("clearSearch")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending || !refInput.trim()}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-heading font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("checkingButton")}</span>
              </>
            ) : (
              <span>{t("trackButton")}</span>
            )}
          </button>
        </form>

        {/* Error Alert (non-404, e.g. validation or server error) */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-3 rounded-xl bg-error-light border border-error-border p-3 sm:p-4 flex items-start gap-3 text-xs sm:text-sm text-error"
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
                  <span>{t("callHelpline")}</span>
                </a>
                <span className="text-error/60">•</span>
                <a
                  href={contactConfig.whatsapp.getDefaultUrl("Hi QuickFix, I need help checking my repair status.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold hover:underline"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t("notFound.whatsappSupport")}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. Not Found Card with Icon */}
      {notFoundRef && !tracking && !isPending && (
        <div className="bg-clean-white border border-border-default rounded-2xl p-6 sm:p-8 shadow-xs text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist-gray border border-border-default text-text-muted mb-4">
            <SearchX className="h-7 w-7 text-text-secondary" />
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-bold text-tech-slate tracking-tight">
            {t("notFound.title")}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            {t("notFound.description")}{" "}
            <span className="font-mono font-bold text-tech-slate bg-mist-gray px-2 py-0.5 rounded border border-border-default">
              {notFoundRef}
            </span>
            .
          </p>

          <p className="mt-1 text-xs text-text-muted/80 max-w-md mx-auto">
            {t("notFound.tip")}
          </p>

          <div className="mt-6 pt-6 border-t border-border-default flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={contactConfig.whatsapp.getDefaultUrl(
                `Hi QuickFix, I couldn't find my repair status for reference: ${notFoundRef}. Please help!`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-clean-white border border-border-default hover:bg-mist-gray text-tech-slate transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-flash-orange" />
              <span>{t("notFound.whatsappSupport")}</span>
            </a>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-flash-orange text-clean-white hover:bg-flash-orange-hover transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{t("notFound.callHelpline")} ({contactConfig.phone.display})</span>
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-tech-slate hover:bg-mist-gray transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t("clearSearch")}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Tracking Result Details Card */}
      {tracking && (
        <div className="bg-clean-white border border-border-default rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
            <div>
              <div className="text-xs font-medium text-text-muted">{t("bookingReference")}</div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-tech-slate tracking-tight">
                {tracking.bookingReference}
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {tracking.status === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-electric-amber/15 text-electric-amber border border-electric-amber/30">
                  {t("status.pending")}
                </span>
              )}
              {tracking.status === "confirmed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {t("status.confirmed")}
                </span>
              )}
              {tracking.status === "in_progress" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {t("status.inProgress")}
                </span>
              )}
              {tracking.status === "completed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("status.completed")}
                </span>
              )}
              {tracking.status === "cancelled" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-error-light text-error border border-error-border">
                  {t("status.cancelled")}
                </span>
              )}
            </div>
          </div>

          {/* Progress Stepper Timeline */}
          {!isCancelled ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-colors ${
                        isCurrent
                          ? "bg-mist-gray/80 border-flash-orange text-tech-slate"
                          : isDone
                          ? "bg-clean-white border-border-default text-tech-slate"
                          : "bg-clean-white border-border-default/60 text-text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                            isDone
                              ? "bg-flash-orange text-clean-white"
                              : "bg-mist-gray text-text-muted border border-border-default"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="text-xs font-bold font-heading">
                          {t("steps.step")} {idx + 1}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold">{t(step.labelKey)}</div>
                      <div className="text-[11px] text-text-muted mt-1 leading-snug">
                        {t(step.descKey)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-error-light border border-error-border p-4 text-xs sm:text-sm text-error">
              {t("cancelledNotice")}
            </div>
          )}

          {/* Details Row: Device & Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3.5 border-t border-border-default text-xs">
            {tracking.device?.model && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Smartphone className="h-4 w-4 text-flash-orange shrink-0" />
                <span>
                  {t("device")}: <strong className="text-tech-slate">{tracking.device.brand} {tracking.device.model}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-text-secondary sm:justify-end">
              <Wrench className="h-4 w-4 text-text-muted shrink-0" />
              <span>
                {t("lastUpdated")}:{" "}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-tech-slate transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t("trackAnother")}</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={contactConfig.whatsapp.getBookingUrl(tracking.bookingReference)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-clean-white border border-border-default hover:bg-mist-gray text-tech-slate transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-flash-orange" />
                <span>{t("whatsappDispatch")}</span>
              </a>
              <a
                href={`tel:${contactConfig.phone.value}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-flash-orange text-clean-white hover:bg-flash-orange-hover transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t("callHelpline")}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
