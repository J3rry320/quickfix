"use client";

import { useState } from "react";
import { X, Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  locale?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Poor",
  2: "2 - Fair",
  3: "3 - Good",
  4: "4 - Very Good",
  5: "5 - Excellent",
};

export default function ReviewSubmitModal({
  isOpen,
  onClose,
  onSubmitted,
  locale = "en",
}: ReviewSubmitModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [area, setArea] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setRating(5);
    setHoverRating(0);
    setComment("");
    setDeviceModel("");
    setServiceType("");
    setArea("");
    setErrorMessage("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage("Please share at least 10 characters describing your experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-quickfix-csrf": "quickfix-valid",
        },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          comment: comment.trim(),
          deviceModel: deviceModel.trim() || undefined,
          serviceType: serviceType.trim() || undefined,
          area: area.trim() || undefined,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit review. Please try again.");
      }

      setIsSuccess(true);
      onSubmitted();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit review.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarCount = hoverRating || rating;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tech-slate/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-clean-white border border-border-default rounded-3xl p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-tech-slate hover:bg-mist-gray transition-colors cursor-pointer"
          aria-label="Close review dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-tech-slate">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
              Your review has been submitted for moderation. Once verified by our team, it will appear on the public reviews page.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-tech-slate text-clean-white font-heading font-bold text-xs hover:bg-tech-slate-hover transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-tech-slate">
                Share Your Experience
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Tell us about your phone repair experience with QuickFix Pune.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl bg-error-light border border-error-border p-3 text-xs text-error flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tech-slate">
                Your Rating <span className="text-error">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 -m-1 focus:outline-none cursor-pointer"
                    aria-label={`Rate ${starVal} stars`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        starVal <= activeStarCount
                          ? "fill-electric-amber text-electric-amber"
                          : "text-border-default"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-text-muted ml-2">
                  {RATING_LABELS[activeStarCount] || ""}
                </span>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-tech-slate mb-1">
                Your Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors"
              />
            </div>

            {/* Locality & Device Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  Pune Area / Locality
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Kothrud, Baner"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-tech-slate mb-1">
                  Device Model
                </label>
                <input
                  type="text"
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g. iPhone 14, OnePlus 11"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors"
                />
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs font-bold text-tech-slate mb-1">
                Repair Service Done
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="e.g. Screen Replacement, Battery Replacement"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors"
              />
            </div>

            {/* Review Comment */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-tech-slate">
                  Your Review <span className="text-error">*</span>
                </label>
                <span className="text-2xs text-text-muted">
                  {comment.length}/1000
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your device repair experience with our technician and lab?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-mist-gray/60 border border-border-default rounded-xl text-tech-slate placeholder:text-text-muted focus:outline-none focus:border-flash-orange focus:bg-clean-white transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-tech-slate transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-heading font-bold text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
