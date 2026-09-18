"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Check,
  X,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  Wrench,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar, { FilterTab } from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminConfirmModal from "@/components/admin/ui/AdminConfirmModal";

interface AdminReviewItem {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  deviceModel?: string;
  serviceType?: string;
  area?: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  adminNotes?: string;
  locale?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewCounts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

const COLUMNS: AdminTableColumn[] = [
  { key: "customer", label: "Customer" },
  { key: "rating", label: "Rating" },
  { key: "comment", label: "Review Comment" },
  { key: "device", label: "Device / Service" },
  { key: "status", label: "Status" },
  { key: "date", label: "Submitted" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [counts, setCounts] = useState<ReviewCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Detail Modal State
  const [selectedReview, setSelectedReview] = useState<AdminReviewItem | null>(null);
  const [modalStatus, setModalStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [modalFeatured, setModalFeatured] = useState(false);
  const [modalNotes, setModalNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Delete Confirmation Modal State
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isSubscribed = true;

    async function loadReviews() {
      try {
        const data = await adminFetch<{
          reviews: AdminReviewItem[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
          counts: ReviewCounts;
        }>("/api/admin/reviews", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 20,
          },
        });

        if (isSubscribed) {
          setReviews(data.reviews || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || 0);
          if (data.counts) {
            setCounts(data.counts);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch admin reviews:", err);
        if (isSubscribed) {
          setReviews([]);
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, page, refreshIndex]);

  const triggerRefresh = () => {
    setLoading(true);
    setRefreshIndex((prev) => prev + 1);
  };

  const handleQuickStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await adminFetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        body: { status },
      });
      triggerRefresh();
    } catch (err) {
      console.error("Quick status update failed:", err);
    }
  };

  const openDetailModal = (rev: AdminReviewItem) => {
    setSelectedReview(rev);
    setModalStatus(rev.status);
    setModalFeatured(Boolean(rev.isFeatured));
    setModalNotes(rev.adminNotes || "");
    setUpdateError("");
  };

  const handleSaveModal = async () => {
    if (!selectedReview) return;
    setIsUpdating(true);
    setUpdateError("");

    try {
      await adminFetch(`/api/admin/reviews/${selectedReview._id}`, {
        method: "PATCH",
        body: {
          status: modalStatus,
          isFeatured: modalFeatured,
          adminNotes: modalNotes.trim() || undefined,
        },
      });

      setSelectedReview(null);
      triggerRefresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update review";
      setUpdateError(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);

    try {
      await adminFetch(`/api/admin/reviews/${reviewToDelete._id}?permanent=true`, {
        method: "DELETE",
      });
      setReviewToDelete(null);
      triggerRefresh();
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filterTabs: FilterTab[] = [
    { label: "All Reviews", value: "", count: counts.total },
    { label: "Pending Moderation", value: "pending", count: counts.pending },
    { label: "Approved", value: "approved", count: counts.approved },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  return (
    <AdminShell
      title="Customer Reviews"
      subtitle="Moderate customer feedback, approve verified testimonials, and manage ratings."
      actions={
        <button
          type="button"
          onClick={triggerRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-clean-white border border-border-default text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      }
    >
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-clean-white border border-border-default rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
            <Clock className="h-4 w-4 text-electric-amber" />
            <span>Pending Moderation</span>
          </div>
          <div className="font-heading text-2xl font-extrabold text-tech-slate mt-2">
            {counts.pending}
          </div>
        </div>

        <div className="bg-clean-white border border-border-default rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Approved</span>
          </div>
          <div className="font-heading text-2xl font-extrabold text-tech-slate mt-2">
            {counts.approved}
          </div>
        </div>

        <div className="bg-clean-white border border-border-default rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
            <XCircle className="h-4 w-4 text-text-muted" />
            <span>Rejected</span>
          </div>
          <div className="font-heading text-2xl font-extrabold text-tech-slate mt-2">
            {counts.rejected}
          </div>
        </div>

        <div className="bg-clean-white border border-border-default rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
            <Star className="h-4 w-4 text-flash-orange" />
            <span>Total Submitted</span>
          </div>
          <div className="font-heading text-2xl font-extrabold text-tech-slate mt-2">
            {counts.total}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <AdminFilterBar
        tabs={filterTabs}
        activeTab={statusFilter}
        onTabChange={(tab) => {
          setStatusFilter(tab);
          setPage(1);
        }}
        search={search}
        onSearchChange={(query) => {
          setSearch(query);
          setPage(1);
        }}
        searchPlaceholder="Search customer, comments, device model..."
      />

      {/* Reviews Table */}
      <div className="mt-4 bg-clean-white border border-border-default rounded-2xl overflow-hidden shadow-2xs">
        <AdminTable
          columns={COLUMNS}
          loading={loading}
          empty={reviews.length === 0}
          emptyTitle="No customer reviews found"
          emptyDescription="There are no reviews matching the current filter criteria."
        >
          {reviews.map((rev) => (
            <tr key={rev._id} className="hover:bg-mist-gray/40 transition-colors">
              {/* Customer */}
              <td className="px-4 py-3.5 text-xs">
                <div className="font-bold text-tech-slate">{rev.name}</div>
                <div className="text-text-muted text-2xs mt-0.5">
                  {rev.area || "Pune Customer"}
                </div>
              </td>

              {/* Rating */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rev.rating
                            ? "fill-electric-amber text-electric-amber"
                            : "text-border-default"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-tech-slate ml-1">{rev.rating}★</span>
                </div>
              </td>

              {/* Comment */}
              <td className="px-4 py-3.5 text-xs max-w-xs">
                <p className="line-clamp-2 text-text-secondary leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                {rev.isFeatured && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-flash-orange bg-flash-orange/10 px-1.5 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </td>

              {/* Device / Service */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                {rev.deviceModel && (
                  <div className="flex items-center gap-1 text-tech-slate font-medium">
                    <Smartphone className="h-3 w-3 text-flash-orange shrink-0" />
                    <span>{rev.deviceModel}</span>
                  </div>
                )}
                {rev.serviceType && (
                  <div className="flex items-center gap-1 text-text-muted text-2xs mt-0.5">
                    <Wrench className="h-2.5 w-2.5 text-electric-amber shrink-0" />
                    <span>{rev.serviceType}</span>
                  </div>
                )}
                {!rev.deviceModel && !rev.serviceType && (
                  <span className="text-text-muted text-2xs">—</span>
                )}
              </td>

              {/* Status */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                <AdminStatusBadge status={rev.status} showIcon />
              </td>

              {/* Date */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-text-muted">
                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-right">
                <div className="inline-flex items-center gap-1.5">
                  {rev.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(rev._id, "approved")}
                        title="Approve Review"
                        className="p-1.5 rounded-lg bg-success-light text-success hover:bg-success-border/50 transition-colors cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(rev._id, "rejected")}
                        title="Reject Review"
                        className="p-1.5 rounded-lg bg-mist-gray text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => openDetailModal(rev)}
                    title="View & Edit Details"
                    className="p-1.5 rounded-lg bg-mist-gray text-text-secondary hover:text-tech-slate hover:bg-border-default/60 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewToDelete(rev)}
                    title="Delete Review"
                    className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        {/* Pagination */}
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={totalRecords}
          limit={20}
          onPageChange={setPage}
        />
      </div>

      {/* Review Detail / Moderation Modal */}
      {selectedReview && (
        <AdminModal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title="Moderate Customer Review"
          subtitle={`Review by ${selectedReview.name}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-tech-slate hover:bg-mist-gray transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-heading font-bold text-xs transition-colors cursor-pointer"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {updateError && (
              <div className="rounded-xl bg-error-light border border-error-border p-3 text-error">
                {updateError}
              </div>
            )}

            {/* Customer & Rating Card */}
            <div className="bg-mist-gray/60 border border-border-default rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-tech-slate text-sm">
                    {selectedReview.name}
                  </span>
                  {selectedReview.area && (
                    <span className="text-text-muted ml-2">
                      ({selectedReview.area})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-bold text-tech-slate">
                  <span>{selectedReview.rating} / 5</span>
                  <Star className="h-3.5 w-3.5 fill-electric-amber text-electric-amber" />
                </div>
              </div>

              {(selectedReview.deviceModel || selectedReview.serviceType) && (
                <div className="flex flex-wrap gap-2 text-text-secondary pt-1 border-t border-border-default/60">
                  {selectedReview.deviceModel && (
                    <span>Device: <strong>{selectedReview.deviceModel}</strong></span>
                  )}
                  {selectedReview.serviceType && (
                    <span>• Service: <strong>{selectedReview.serviceType}</strong></span>
                  )}
                </div>
              )}
            </div>

            {/* Review Comment Full */}
            <div>
              <label className="block font-bold text-tech-slate mb-1">
                Customer Feedback
              </label>
              <div className="p-3 bg-clean-white border border-border-default rounded-xl text-text-secondary leading-relaxed select-text">
                &ldquo;{selectedReview.comment}&rdquo;
              </div>
            </div>

            {/* Moderation Status Control */}
            <div>
              <label className="block font-bold text-tech-slate mb-1">
                Moderation Status
              </label>
              <select
                value={modalStatus}
                onChange={(e) =>
                  setModalStatus(e.target.value as "pending" | "approved" | "rejected")
                }
                className="w-full px-3 py-2 bg-clean-white border border-border-default rounded-xl text-tech-slate focus:outline-none focus:border-flash-orange"
              >
                <option value="pending">Pending Moderation</option>
                <option value="approved">Approved (Visible on public website)</option>
                <option value="rejected">Rejected (Hidden from public)</option>
              </select>
            </div>

            {/* Feature Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeaturedToggle"
                checked={modalFeatured}
                onChange={(e) => setModalFeatured(e.target.checked)}
                className="rounded border-border-default text-flash-orange focus:ring-flash-orange h-4 w-4"
              />
              <label
                htmlFor="isFeaturedToggle"
                className="text-xs font-semibold text-tech-slate cursor-pointer"
              >
                Mark as Featured (Prioritized on testimonials section)
              </label>
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block font-bold text-tech-slate mb-1">
                Internal Admin Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Add notes for internal records..."
                className="w-full px-3 py-2 bg-clean-white border border-border-default rounded-xl text-tech-slate focus:outline-none focus:border-flash-orange resize-none"
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <AdminConfirmModal
          isOpen={Boolean(reviewToDelete)}
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer Review"
          message={`Are you sure you want to permanently delete the review from "${reviewToDelete.name}"? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Permanently Delete"}
          isDestructive
        />
      )}
    </AdminShell>
  );
}
