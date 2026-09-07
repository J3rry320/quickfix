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
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminImage from "@/components/admin/AdminImage";

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  displayOrder: number;
  isPopular: boolean;
  isActive: boolean;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | string>(0);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    async function fetchBrands() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "100");

        const res = await fetch(`/api/admin/brands?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.brands)) {
            setBrands(data.data.brands);
          } else {
            setBrands([]);
          }
        }
      } catch (err) {
        console.error("Failed to load brands", err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchBrands();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, refreshIndex]);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setLogoUrl("");
    setDisplayOrder(brands.length + 1);
    setIsPopular(false);
    setIsActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (b: BrandItem) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setLogoUrl(b.logoUrl || "");
    setDisplayOrder(b.displayOrder);
    setIsPopular(b.isPopular);
    setIsActive(b.isActive);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        displayOrder: Number(displayOrder),
        isPopular,
        isActive,
      };

      const url = editingBrand
        ? `/api/admin/brands/${editingBrand._id}`
        : "/api/admin/brands";
      const method = editingBrand ? "PATCH" : "POST";

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
        setFormError(data.error?.message || "Failed to save brand");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate/delete brand "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      const data = await res.json();
      if (res.ok) {
        setRefreshIndex((k) => k + 1);
      } else {
        alert(data.error?.message || "Failed to delete brand");
      }
    } catch (err) {
      console.error("Failed to delete brand", err);
    }
  };

  return (
    <AdminShell
      title="Smartphone Brands"
      subtitle="Manage manufacturer brands supported by QuickFix doorstep technicians"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            title="Refresh brands"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            title="Add Brand"
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Brand</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter & Search */}
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
              All Brands
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
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Brands Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Brand</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Display Order</th>
                  <th className="px-5 py-3.5">Popular</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                      No smartphone brands found.
                    </td>
                  </tr>
                ) : (
                  brands.map((b) => (
                    <tr key={b._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={b.logoUrl}
                            alt={b.name}
                            fallbackText={b.name[0]?.toUpperCase()}
                            containerClassName="h-9 w-9 shrink-0 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center shadow-2xs"
                            className="h-full w-full object-contain"
                          />
                          <span className="font-bold text-tech-slate">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-500">{b.slug}</td>
                      <td className="px-5 py-4 text-zinc-600 font-mono">#{b.displayOrder}</td>
                      <td className="px-5 py-4">
                        {b.isPopular ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Popular
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {b.isActive ? (
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
                          onClick={() => openEditModal(b)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-tech-slate cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(b._id, b.name)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete Brand"
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

        {/* Create / Edit Brand Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h3 className="font-heading text-lg font-bold text-tech-slate">
                  {editingBrand ? "Edit Brand" : "Add New Brand"}
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
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple, Samsung, OnePlus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Slug (optional auto-generated)</label>
                  <input
                    type="text"
                    placeholder="e.g. apple"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <ImageUploadField
                  label="Logo (Optional)"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  placeholder="https://.../brand-logo.svg or click Upload"
                  helperText="Upload transparent SVG or PNG logo to ImgBB or paste a direct image link"
                />

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                    />
                    <span>Popular Brand</span>
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
                    <span>{editingBrand ? "Update Brand" : "Create Brand"}</span>
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
