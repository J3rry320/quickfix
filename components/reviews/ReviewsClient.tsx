"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import {
  Star,
  CheckCircle2,
  Smartphone,
  Wrench,
  PenSquare,
  Loader2,
} from "lucide-react";
import ReviewSubmitModal from "./ReviewSubmitModal";

export interface ReviewItem {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  deviceModel?: string;
  serviceType?: string;
  area?: string;
  isFeatured?: boolean;
  createdAt: string;
}

interface ReviewsClientProps {
  initialReviews?: ReviewItem[];
  initialTotal?: number;
  initialAvgRating?: number;
  locale?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function ReviewsClient({
  initialReviews = [],
  initialTotal = 0,
  initialAvgRating = 4.9,
  locale = "en",
}: ReviewsClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [avgRating, setAvgRating] = useState(initialAvgRating);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const isMounted = useRef(false);

  const fetchReviews = (filterRating: number | null, targetPage: number = 1) => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(targetPage));
        params.set("limit", "12");
        if (filterRating) {
          params.set("rating", String(filterRating));
        }

        const res = await fetch(`/api/reviews?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setReviews(data.data.reviews || []);
          setTotalPages(data.data.pagination?.totalPages || 1);
          setTotalReviews(data.data.pagination?.total || 0);
          if (data.data.stats?.avgRating) {
            setAvgRating(data.data.stats.avgRating);
          }
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    fetchReviews(ratingFilter, page);
  }, [ratingFilter, page]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Controls & Aggregate Rating Banner */}
      <div className="bg-clean-white border border-border-default rounded-3xl p-6 sm:p-8 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl bg-mist-gray/70 border border-border-default shrink-0">
            <span className="font-heading text-3xl font-extrabold text-tech-slate">
              {avgRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-electric-amber text-electric-amber"
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-tech-slate">
              Verified Customer Ratings
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Based on {totalReviews} doorstep and lab repairs completed across Pune.
            </p>
          </div>
        </div>

        {/* Write a Review Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-heading font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
        >
          <PenSquare className="h-4 w-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setRatingFilter(null);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              ratingFilter === null
                ? "bg-tech-slate text-clean-white"
                : "bg-mist-gray text-text-secondary hover:bg-border-default/60"
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => {
                setRatingFilter(stars);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                ratingFilter === stars
                  ? "bg-tech-slate text-clean-white"
                  : "bg-mist-gray text-text-secondary hover:bg-border-default/60"
              }`}
            >
              <span>{stars}</span>
              <Star className="h-3 w-3 fill-electric-amber text-electric-amber" />
            </button>
          ))}
        </div>

        {isPending && (
          <div className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-flash-orange" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-2xl bg-clean-white border border-border-default p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:border-flash-orange/40 transition-all"
            >
              <div>
                {/* Device & Service Tag Badges */}
                {(rev.deviceModel || rev.serviceType) && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {rev.deviceModel && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-mist-gray/70 px-2.5 py-1 text-2xs font-bold text-tech-slate border border-border-default">
                        <Smartphone className="h-3 w-3 text-flash-orange" />
                        {rev.deviceModel}
                      </span>
                    )}
                    {rev.serviceType && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-mist-gray/70 px-2 py-1 text-2xs font-medium text-text-secondary border border-border-default">
                        <Wrench className="h-2.5 w-2.5 text-electric-amber" />
                        {rev.serviceType}
                      </span>
                    )}
                  </div>
                )}

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-2.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-electric-amber text-electric-amber"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Footer */}
              <div className="pt-3.5 border-t border-border-default flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tech-slate text-clean-white font-heading font-extrabold text-xs shrink-0">
                  {getInitials(rev.name)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-tech-slate">
                      {rev.name}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-flash-orange" />
                  </div>
                  <p className="text-[11px] text-text-muted font-medium leading-tight">
                    {rev.area ? `${rev.area} • ` : ""}
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-mist-gray/40 border border-border-default rounded-3xl p-8">
          <p className="text-sm font-bold text-tech-slate">No reviews found for this selection</p>
          <p className="text-xs text-text-muted mt-1">
            Be the first to share your experience with QuickFix!
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tech-slate text-clean-white font-heading font-bold text-xs hover:bg-tech-slate-hover transition-colors cursor-pointer"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            disabled={page <= 1 || isPending}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-clean-white border border-border-default hover:bg-mist-gray disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-text-muted px-2">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || isPending}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-clean-white border border-border-default hover:bg-mist-gray disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewSubmitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => {
          fetchReviews(ratingFilter, 1);
        }}
        locale={locale}
      />
    </div>
  );
}
