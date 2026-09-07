"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminImage from "@/components/admin/AdminImage";

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  startingPrice: number;
  estimatedTimeMinutes: number;
  warrantyDays: number;
  image?: string;
  isPopular: boolean;
  isActive: boolean;
  commonIssues?: string[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState<number | string>(999);
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState<number | string>(30);
  const [warrantyDays, setWarrantyDays] = useState<number | string>(90);
  const [image, setImage] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [commonIssuesText, setCommonIssuesText] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    async function fetchServices() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "100");

        const res = await fetch(`/api/admin/services?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.services)) {
            setServices(data.data.services);
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, refreshIndex]);

  const openCreateModal = () => {
    setEditingService(null);
    setName("");
    setSlug("");
    setDescription("");
    setStartingPrice(999);
    setEstimatedTimeMinutes(30);
    setWarrantyDays(90);
    setImage("");
    setIsPopular(false);
    setIsActive(true);
    setCommonIssuesText("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setName(s.name);
    setSlug(s.slug);
    setDescription(s.description);
    setStartingPrice(s.startingPrice);
    setEstimatedTimeMinutes(s.estimatedTimeMinutes);
    setWarrantyDays(s.warrantyDays);
    setImage(s.image || "");
    setIsPopular(s.isPopular);
    setIsActive(s.isActive);
    setCommonIssuesText((s.commonIssues || []).join("\n"));
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const commonIssues = commonIssuesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        startingPrice: Number(startingPrice),
        estimatedTimeMinutes: Number(estimatedTimeMinutes),
        warrantyDays: Number(warrantyDays),
        image: image.trim() || undefined,
        isPopular,
        isActive,
        commonIssues,
      };

      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";
      const method = editingService ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-QuickFix-CSRF": "1",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setRefreshIndex((k) => k + 1);
      } else {
        setFormError(data.error?.message || "Failed to save service");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate/delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      if (res.ok) {
        setRefreshIndex((k) => k + 1);
      }
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <AdminShell
      title="Repair Services Catalogue"
      subtitle="Manage smartphone repair offerings, starting prices, warranties, and turnaround times"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            title="Refresh services"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            title="Add Service"
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === ""
                  ? "bg-tech-slate text-clean-white"
                  : "bg-clean-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              All Services
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-tech-slate text-clean-white"
                  : "bg-clean-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-tech-slate text-clean-white"
                  : "bg-clean-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Services Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Service Name</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Starting Rate</th>
                  <th className="px-5 py-3.5">Est. Time</th>
                  <th className="px-5 py-3.5">Warranty</th>
                  <th className="px-5 py-3.5">Popular</th>
                  <th className="px-5 py-3.5">Status</th>
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
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-zinc-400">
                      No repair services configured yet.
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-tech-slate">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={s.image}
                            alt={s.name}
                            fallbackIcon={Wrench}
                            containerClassName="h-9 w-9 shrink-0 rounded-lg bg-flash-orange/10 text-flash-orange border border-flash-orange/20 p-1 flex items-center justify-center shadow-2xs"
                            className="h-full w-full object-contain"
                          />
                          <div className="min-w-0">
                            <div>{s.name}</div>
                            <div className="text-[11px] text-zinc-400 font-normal truncate max-w-xs">
                              {s.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-500">{s.slug}</td>
                      <td className="px-5 py-4 font-bold text-tech-slate">₹{s.startingPrice}</td>
                      <td className="px-5 py-4 text-zinc-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          {s.estimatedTimeMinutes}m
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-emerald-500" />
                          {s.warrantyDays} Days
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {s.isPopular ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Popular
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-400 font-semibold">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(s)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-tech-slate cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s._id, s.name)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete / Deactivate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Service Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h3 className="font-heading text-lg font-bold text-tech-slate">
                  {editingService ? "Edit Repair Service" : "Add New Repair Service"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700">Service Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Touchscreen & OLED Display Replacement"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700">Slug (optional auto-generated)</label>
                    <input
                      type="text"
                      placeholder="e.g. screen-replacement"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700">Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detailed SEO-optimized customer description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Starting Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Turnaround Time (Mins)</label>
                    <input
                      type="number"
                      min={5}
                      value={estimatedTimeMinutes}
                      onChange={(e) => setEstimatedTimeMinutes(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Warranty (Days)</label>
                    <input
                      type="number"
                      min={0}
                      value={warrantyDays}
                      onChange={(e) => setWarrantyDays(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="col-span-2">
                    <ImageUploadField
                      label="Service Graphic / Icon (Optional)"
                      value={image}
                      onChange={setImage}
                      placeholder="https://... or click Upload"
                      helperText="Upload service graphic to ImgBB or paste a direct image URL"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-6 pt-2">
                    <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                        className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                      />
                      <span>Popular Feature</span>
                    </label>

                    <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="font-bold text-zinc-700">
                      Common Symptoms / Issues (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Cracked outer glass&#10;Ghost touches&#10;Green vertical lines"
                      value={commonIssuesText}
                      onChange={(e) => setCommonIssuesText(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{editingService ? "Update Service" : "Create Service"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
