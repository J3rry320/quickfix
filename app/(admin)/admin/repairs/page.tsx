"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  Loader2,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";
import AdminImage from "@/components/admin/AdminImage";

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
  };
  service?: {
    _id?: string;
    name?: string;
    image?: string;
  };
  issueDescription: string;
  slot: {
    date: string;
    timeWindow: string;
  };
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  pricing?: {
    estimatedPrice?: number;
    finalPrice?: number;
    paymentStatus?: string;
    paymentMethod?: string;
  };
  technician?: {
    name?: string;
    phone?: string;
  };
  status: "pending" | "confirmed" | "technician_assigned" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

const STATUS_TABS = [
  { label: "All Bookings", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [selectedRepair, setSelectedRepair] = useState<RepairItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Edit fields for modal
  const [newStatus, setNewStatus] = useState<string>("pending");
  const [techName, setTechName] = useState("");
  const [techPhone, setTechPhone] = useState("");
  const [finalPrice, setFinalPrice] = useState<number | string>("");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  useEffect(() => {
    let isSubscribed = true;

    async function fetchRepairs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "50");

        const res = await fetch(`/api/admin/repair-requests?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.requests)) {
            setRepairs(data.data.requests);
          } else {
            setRepairs([]);
          }
        }
      } catch (err) {
        console.error("Failed to load repair requests", err);
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
  }, [statusFilter, search, refreshIndex]);

  const openDetailModal = (repair: RepairItem) => {
    setSelectedRepair(repair);
    setNewStatus(repair.status);
    setTechName(repair.technician?.name || "");
    setTechPhone(repair.technician?.phone || "");
    setFinalPrice(repair.pricing?.finalPrice ?? repair.pricing?.estimatedPrice ?? "");
    setPaymentStatus(repair.pricing?.paymentStatus || "unpaid");
    setUpdateError("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedRepair) return;
    setIsUpdating(true);
    setUpdateError("");

    try {
      const payload: Record<string, unknown> = {
        status: newStatus,
      };

      if (techName.trim() || techPhone.trim()) {
        payload.technician = {
          name: techName.trim(),
          phone: techPhone.trim(),
        };
      }

      const parsedPrice = Number(finalPrice);
      if (!isNaN(parsedPrice) && parsedPrice >= 0) {
        payload.pricing = {
          estimatedPrice: selectedRepair.pricing?.estimatedPrice,
          finalPrice: parsedPrice,
          paymentStatus,
        };
      }

      const res = await fetch(`/api/admin/repair-requests/${selectedRepair._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-QuickFix-CSRF": "1",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedRepair(null);
        setRefreshIndex((k) => k + 1);
      } else {
        setUpdateError(data.error?.message || "Failed to update repair request");
      }
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Error submitting updates");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "technician_assigned":
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <AdminShell
      title="Repair Management"
      subtitle="View, track and dispatch doorstep repair requests across Pune"
      actions={
        <button
          type="button"
          onClick={() => setRefreshIndex((k) => k + 1)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-3 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-clean-white border border-zinc-200 shadow-2xs">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-tech-slate text-clean-white shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-tech-slate"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by ref, phone, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Booking Ref</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Device & Service</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                ) : repairs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-zinc-400">
                      No repair requests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  repairs.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Booking Ref */}
                      <td className="px-5 py-4 font-mono font-bold text-tech-slate">
                        {r.bookingReference}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-tech-slate">{r.customer.name}</div>
                        <div className="text-[11px] text-zinc-500">{r.customer.phone}</div>
                      </td>

                      {/* Device & Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={r.service?.image}
                            alt={r.device.model}
                            fallbackIcon={Smartphone}
                            containerClassName="h-9 w-9 shrink-0 rounded-lg bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shadow-2xs text-tech-slate"
                            className="h-full w-full object-contain"
                          />
                          <div>
                            <div className="font-semibold text-tech-slate">
                              {r.device.brand} {r.device.model}
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                              {r.service?.name || "Standard Diagnostic"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-medium text-tech-slate">{r.slot.date}</div>
                        <div className="text-[11px] text-zinc-500 capitalize">{r.slot.timeWindow}</div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-tech-slate">{r.address.area}</div>
                        <div className="text-[11px] text-zinc-500">{r.address.pincode}</div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                            r.status
                          )}`}
                        >
                          {r.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-bold text-tech-slate whitespace-nowrap">
                        ₹{r.pricing?.finalPrice ?? r.pricing?.estimatedPrice ?? 0}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openDetailModal(r)}
                          className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-tech-slate hover:text-clean-white transition-all cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Request Detail Modal */}
        {selectedRepair && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl bg-clean-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-tech-slate">
                    Booking {selectedRepair.bookingReference}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Created on {new Date(selectedRepair.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRepair(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  <span className="font-bold text-zinc-500 uppercase text-[10px]">Customer Details</span>
                  <p className="font-bold text-tech-slate">{selectedRepair.customer.name}</p>
                  <p className="text-zinc-600">{selectedRepair.customer.phone}</p>
                  {selectedRepair.customer.email && (
                    <p className="text-zinc-500 text-[11px] truncate">{selectedRepair.customer.email}</p>
                  )}
                </div>

                <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  <span className="font-bold text-zinc-500 uppercase text-[10px]">Doorstep Address</span>
                  <p className="font-semibold text-tech-slate">{selectedRepair.address.street}</p>
                  <p className="text-zinc-600">
                    {selectedRepair.address.area}, Pune {selectedRepair.address.pincode}
                  </p>
                  {selectedRepair.address.landmark && (
                    <p className="text-[11px] text-zinc-500">Landmark: {selectedRepair.address.landmark}</p>
                  )}
                </div>

                <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  <span className="font-bold text-zinc-500 uppercase text-[10px]">Device & Issue</span>
                  <p className="font-bold text-tech-slate">
                    {selectedRepair.device.brand} {selectedRepair.device.model}
                  </p>
                  <p className="text-zinc-600 font-medium">{selectedRepair.service?.name}</p>
                  <p className="text-zinc-500 text-[11px] italic mt-1">&quot;{selectedRepair.issueDescription}&quot;</p>
                </div>

                <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  <span className="font-bold text-zinc-500 uppercase text-[10px]">Slot Window</span>
                  <p className="font-bold text-tech-slate">{selectedRepair.slot.date}</p>
                  <p className="text-zinc-600 capitalize">{selectedRepair.slot.timeWindow} slot</p>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-4 pt-2 border-t border-zinc-200">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-tech-slate">
                  Update Operational Status
                </h4>

                {updateError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                    {updateError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Status Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Booking Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="technician_assigned">Technician Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="unpaid">Unpaid (Post-repair)</option>
                      <option value="paid">Paid (UPI / Cash / Card)</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Technician Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Assigned Technician</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Shinde"
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  {/* Technician Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Technician Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={techPhone}
                      onChange={(e) => setTechPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  {/* Final Price */}
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-zinc-600">Total Price (₹ INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2499"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setSelectedRepair(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
