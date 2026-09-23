"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Smartphone, FileText, Plus } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminImage from "@/components/admin/AdminImage";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar, { FilterTab } from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import JobSheetModal from "@/components/admin/repairs/JobSheetModal";
import { formatIstDisplayDate } from "@/lib/date";

interface RepairItem {
  _id: string;
  bookingReference: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  device: {
    brand: string;
    model: string;
    color?: string;
  };
  service?: {
    _id?: string;
    name?: string;
    image?: string;
  };
  issueDescription: string;
  serviceMode?: "doorstep" | "pickup_drop" | "walk_in";
  preferredSlot: {
    date: string;
    timeSlot: string;
  };
  address: {
    streetAddress: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  pricing?: {
    estimatedPrice?: number;
    finalPrice?: number;
    paymentStatus?: "unpaid" | "paid" | "cod";
    paymentMethod?: string;
  };
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled";
  createdAt: string;
}

const STATUS_TABS: FilterTab[] = [
  { label: "All Bookings", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const COLUMNS: AdminTableColumn[] = [
  { key: "ref", label: "Booking Ref" },
  { key: "customer", label: "Customer" },
  { key: "device", label: "Device & Service" },
  { key: "schedule", label: "Schedule & Mode" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "price", label: "Price" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Manage Repair Modal State
  const [selectedRepair, setSelectedRepair] = useState<RepairItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Job Sheet Modal State
  const [isJobSheetOpen, setIsJobSheetOpen] = useState(false);
  const [jobSheetRepair, setJobSheetRepair] = useState<RepairItem | null>(null);

  // Edit fields for modal
  const [newStatus, setNewStatus] = useState<string>("pending");
  const [finalPrice, setFinalPrice] = useState<number | string>("");
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid" | "cod">("unpaid");

  useEffect(() => {
    let isSubscribed = true;

    async function fetchRepairs() {
      setLoading(true);
      try {
        const data = await adminFetch<{
          requests: RepairItem[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/repair-requests", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 20,
          },
        });

        if (isSubscribed) {
          setRepairs(data.requests || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Failed to load repair requests", err);
        if (isSubscribed) {
          setRepairs([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchRepairs();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, page, refreshIndex]);

  const openDetailModal = (repair: RepairItem) => {
    setSelectedRepair(repair);
    setNewStatus(repair.status);
    setFinalPrice(repair.pricing?.finalPrice ?? repair.pricing?.estimatedPrice ?? "");
    setPaymentStatus(repair.pricing?.paymentStatus || "unpaid");
    setUpdateError("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair) return;
    setIsUpdating(true);
    setUpdateError("");

    try {
      const payload: Record<string, unknown> = {
        status: newStatus,
      };

      const parsedPrice = Number(finalPrice);
      if (!isNaN(parsedPrice) && parsedPrice >= 0) {
        payload.pricing = {
          estimatedPrice: selectedRepair.pricing?.estimatedPrice,
          finalPrice: parsedPrice,
          paymentStatus,
        };
      }

      await adminFetch(`/api/admin/repair-requests/${selectedRepair._id}`, {
        method: "PATCH",
        body: payload,
      });

      setSelectedRepair(null);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Error submitting updates");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatSlotDate = (dateVal?: string) => {
    if (!dateVal) return "-";
    return formatIstDisplayDate(dateVal, "en") || dateVal;
  };

  return (
    <AdminShell
      title="Repair Management"
      subtitle="View, track and dispatch doorstep repair requests across Pune"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setJobSheetRepair(null);
              setIsJobSheetOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-flash-orange px-3 py-1.5 text-xs font-bold text-clean-white hover:bg-flash-orange-hover shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Job Sheet</span>
            <span className="sm:hidden">Job Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-clean-white px-3 py-1.5 text-xs font-bold text-text-secondary hover:bg-mist-gray cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls & Search */}
        <AdminFilterBar
          tabs={STATUS_TABS}
          activeTab={statusFilter}
          onTabChange={(tab) => {
            setStatusFilter(tab);
            setPage(1);
          }}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search ref, phone, model..."
        />

        {/* Requests Table */}
        <AdminTable
          columns={COLUMNS}
          tableClassName="min-w-[840px]"
          loading={loading}
          empty={repairs.length === 0}
          emptyTitle="No repair requests found"
          emptyDescription="There are no repair requests matching your active filters."
        >
          {repairs.map((r) => (
            <tr key={r._id} className="hover:bg-mist-gray/80 transition-colors">
              {/* Booking Ref */}
              <td className="px-5 py-4 font-mono font-bold text-tech-slate">
                {r.bookingReference}
              </td>

              {/* Customer */}
              <td className="px-5 py-4">
                <div className="font-bold text-tech-slate">{r.customer?.name}</div>
                <div className="text-[11px] text-text-muted">{r.customer?.phone}</div>
              </td>

              {/* Device & Service */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={r.service?.image}
                    alt={r.device?.model || "Device"}
                    fallbackIcon={Smartphone}
                    containerClassName="h-9 w-9 shrink-0 rounded-lg bg-mist-gray border border-border-default p-1 flex items-center justify-center shadow-2xs text-tech-slate"
                  />
                  <div>
                    <div className="font-semibold text-tech-slate">
                      {r.device?.brand} {r.device?.model}
                    </div>
                    <div className="text-[11px] text-text-muted truncate max-w-[180px]">
                      {r.service?.name || "Diagnostic Check"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Schedule & Service Mode */}
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="font-medium text-tech-slate">
                  {formatSlotDate(r.preferredSlot?.date)}
                </div>
                <div className="text-[11px] text-text-muted capitalize">
                  {r.preferredSlot?.timeSlot || "Standard Window"} •{" "}
                  <span className="font-semibold text-flash-orange">
                    {r.serviceMode?.replace("_", " ") || "Doorstep"}
                  </span>
                </div>
              </td>

              {/* Location */}
              <td className="px-5 py-4">
                <div className="font-semibold text-tech-slate">{r.address?.area}</div>
                <div className="text-[11px] text-text-muted">{r.address?.pincode}</div>
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={r.status} />
              </td>

              {/* Price */}
              <td className="px-5 py-4 font-bold text-tech-slate whitespace-nowrap">
                ₹{r.pricing?.finalPrice ?? r.pricing?.estimatedPrice ?? 0}
              </td>

              {/* Action */}
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setJobSheetRepair(r);
                      setIsJobSheetOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-clean-white px-2.5 py-1.5 text-xs font-bold text-tech-slate hover:bg-flash-orange/10 hover:text-flash-orange hover:border-flash-orange/40 transition-all cursor-pointer shadow-2xs"
                    title="Generate Job Sheet PDF"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Job Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openDetailModal(r)}
                    className="rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-bold text-text-secondary hover:bg-tech-slate hover:text-clean-white transition-all cursor-pointer"
                  >
                    Manage
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

        {/* Manage Request Detail Modal */}
        {selectedRepair && (
          <AdminModal
            isOpen={Boolean(selectedRepair)}
            onClose={() => setSelectedRepair(null)}
            title={`Booking ${selectedRepair.bookingReference}`}
            subtitle={`Created on ${new Date(selectedRepair.createdAt).toLocaleString("en-IN")}`}
            maxWidth="xl"
            onSubmit={handleUpdateStatus}
            isSubmitting={isUpdating}
            error={updateError}
            submitText="Save Changes"
          >
            <div className="space-y-4">
              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 bg-mist-gray p-3 rounded-xl border border-border-default/80">
                  <span className="font-bold text-text-muted uppercase text-[10px]">
                    Customer Details
                  </span>
                  <p className="font-bold text-tech-slate">{selectedRepair.customer.name}</p>
                  <p className="text-text-secondary font-mono">{selectedRepair.customer.phone}</p>
                  {selectedRepair.customer.email && (
                    <p className="text-text-muted text-[11px] truncate">
                      {selectedRepair.customer.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1 bg-mist-gray p-3 rounded-xl border border-border-default/80">
                  <span className="font-bold text-text-muted uppercase text-[10px]">
                    Doorstep Address
                  </span>
                  <p className="font-semibold text-tech-slate">
                    {selectedRepair.address.streetAddress}
                  </p>
                  <p className="text-text-secondary">
                    {selectedRepair.address.area}, Pune {selectedRepair.address.pincode}
                  </p>
                  {selectedRepair.address.landmark && (
                    <p className="text-[11px] text-text-muted">
                      Landmark: {selectedRepair.address.landmark}
                    </p>
                  )}
                </div>

                <div className="space-y-1 bg-mist-gray p-3 rounded-xl border border-border-default/80">
                  <span className="font-bold text-text-muted uppercase text-[10px]">
                    Device & Issue
                  </span>
                  <p className="font-bold text-tech-slate">
                    {selectedRepair.device.brand} {selectedRepair.device.model}
                  </p>
                  <p className="text-text-secondary font-medium">
                    {selectedRepair.service?.name || "Standard Diagnostic"}
                  </p>
                  <p className="text-text-muted text-[11px] italic mt-1">
                    &quot;{selectedRepair.issueDescription}&quot;
                  </p>
                </div>

                <div className="space-y-1 bg-mist-gray p-3 rounded-xl border border-border-default/80">
                  <span className="font-bold text-text-muted uppercase text-[10px]">
                    Schedule & Mode
                  </span>
                  <p className="font-bold text-tech-slate">
                    {formatSlotDate(selectedRepair.preferredSlot?.date)}
                  </p>
                  <p className="text-text-secondary capitalize">
                    {selectedRepair.preferredSlot?.timeSlot || "Standard window"} (
                    <span className="font-semibold text-flash-orange">
                      {selectedRepair.serviceMode?.replace("_", " ") || "Doorstep"}
                    </span>
                    )
                  </p>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-3 pt-3 border-t border-border-default">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-tech-slate">
                  Operational Status & Dispatch
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-text-secondary">Booking Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-text-secondary">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) =>
                        setPaymentStatus(e.target.value as "unpaid" | "paid" | "cod")
                      }
                      className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="unpaid">Unpaid (Post-repair)</option>
                      <option value="paid">Paid (Online / Cash)</option>
                      <option value="cod">Cash on Delivery (COD)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-text-secondary">Final Price (₹ INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2499"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-border-default">
                    <button
                      type="button"
                      onClick={() => {
                        setJobSheetRepair(selectedRepair);
                        setIsJobSheetOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-default bg-mist-gray px-3 py-2 text-xs font-bold text-tech-slate hover:bg-flash-orange-subtle hover:text-flash-orange hover:border-flash-orange/30 transition-all cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-flash-orange" />
                      <span>Generate Job Sheet PDF</span>
                    </button>
                    <span className="text-[11px] text-text-muted text-center sm:text-left">
                      Printable Pune mobile service sheet
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </AdminModal>
        )}

        {/* Job Sheet Generator Modal */}
        <JobSheetModal
          isOpen={isJobSheetOpen}
          onClose={() => {
            setIsJobSheetOpen(false);
            setJobSheetRepair(null);
          }}
          repair={jobSheetRepair}
          onUpdate={() => setRefreshIndex((k) => k + 1)}
        />
      </div>
    </AdminShell>
  );
}
