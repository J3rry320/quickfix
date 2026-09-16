"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Edit2, Trash2, Smartphone, Wrench } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminImage from "@/components/admin/AdminImage";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminConfirmModal from "@/components/admin/ui/AdminConfirmModal";
import ModelServicePricingModal, {
  ModelWithServices,
  ServiceItem,
} from "@/components/admin/models/ModelServicePricingModal";

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
}

export interface ModelItem extends ModelWithServices {
  releaseYear?: number;
  isPopular: boolean;
  isActive: boolean;
}

const COLUMNS: AdminTableColumn[] = [
  { key: "model", label: "Device Model" },
  { key: "brand", label: "Brand" },
  { key: "slug", label: "Slug" },
  { key: "year", label: "Year" },
  { key: "services", label: "Configured Services" },
  { key: "popular", label: "Popular" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Model Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Model Form Fields
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | string>(2026);
  const [imageUrl, setImageUrl] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Service Pricing Matrix Modal State
  const [pricingModalModel, setPricingModalModel] = useState<ModelItem | null>(null);

  // Delete Confirmation State
  const [modelToDelete, setModelToDelete] = useState<ModelItem | null>(null);

  // 1. Load Brands list
  useEffect(() => {
    adminFetch<{ brands: BrandItem[] }>("/api/admin/brands", {
      params: { limit: 100 },
    })
      .then((data) => {
        if (Array.isArray(data?.brands)) {
          setBrands(data.brands);
        }
      })
      .catch((err) => console.error("Failed to load brands", err));
  }, []);

  // 2. Load Available Repair Services catalogue
  useEffect(() => {
    adminFetch<{ services: ServiceItem[] }>("/api/admin/services", {
      params: { limit: 100, status: "active" },
    })
      .then((data) => {
        if (Array.isArray(data?.services)) {
          setAvailableServices(data.services);
        }
      })
      .catch((err) => console.error("Failed to load services", err));
  }, []);

  // 3. Load Models
  useEffect(() => {
    let isSubscribed = true;

    async function fetchModels() {
      setLoading(true);
      try {
        const data = await adminFetch<{
          models: ModelItem[];
          pagination?: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/models", {
          params: {
            brand: selectedBrand,
            search,
            page,
            limit: 50,
          },
        });

        if (isSubscribed) {
          setModels(data.models || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || data.models?.length || 0);
        }
      } catch (err) {
        console.error("Failed to load models", err);
        if (isSubscribed) {
          setModels([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchModels();

    return () => {
      isSubscribed = false;
    };
  }, [selectedBrand, search, page, refreshIndex]);

  const openCreateModal = () => {
    setEditingModel(null);
    setBrandId(selectedBrand || (brands[0]?._id ?? ""));
    setName("");
    setSlug("");
    setReleaseYear(new Date().getFullYear());
    setImageUrl("");
    setIsPopular(false);
    setIsActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (m: ModelItem) => {
    setEditingModel(m);
    setBrandId(m.brand?._id || "");
    setName(m.name);
    setSlug(m.slug);
    setReleaseYear(m.releaseYear || new Date().getFullYear());
    setImageUrl(m.imageUrl || "");
    setIsPopular(m.isPopular);
    setIsActive(m.isActive);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        brand: brandId,
        name: name.trim(),
        slug: slug.trim() || undefined,
        releaseYear: Number(releaseYear) || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isPopular,
        isActive,
      };

      const url = editingModel
        ? `/api/admin/models/${editingModel._id}`
        : "/api/admin/models";
      const method = editingModel ? "PATCH" : "POST";

      await adminFetch(url, {
        method,
        body: payload,
      });

      setIsModalOpen(false);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving model");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!modelToDelete) return;
    try {
      await adminFetch(`/api/admin/models/${modelToDelete._id}`, {
        method: "DELETE",
      });
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      console.error("Failed to delete model", err);
    }
  };

  return (
    <AdminShell
      title="Device Models Catalogue"
      subtitle="Manage smartphone device models, release years, and service pricing"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Model</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter & Search Bar with Brand Selector */}
        <AdminFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search models..."
        >
          {/* Brand Filter Dropdown */}
          <div className="w-full sm:w-56">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden shadow-2xs"
            >
              <option value="">All Smartphone Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </AdminFilterBar>

        {/* Models Table */}
        <AdminTable
          columns={COLUMNS}
          tableClassName="min-w-[760px]"
          loading={loading}
          empty={models.length === 0}
          emptyTitle="No device models found"
          emptyDescription="There are no smartphone models matching your selected brand or search query."
        >
          {models.map((m) => (
            <tr key={m._id} className="hover:bg-zinc-50/80 transition-colors">
              {/* Model Name & Image */}
              <td className="px-5 py-4 font-bold text-tech-slate">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={m.imageUrl}
                    alt={m.name}
                    fallbackIcon={Smartphone}
                    containerClassName="h-9 w-9 shrink-0 rounded-lg bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shadow-2xs text-tech-slate"
                  />
                  <span>{m.name}</span>
                </div>
              </td>

              {/* Brand */}
              <td className="px-5 py-4">
                <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-bold text-tech-slate">
                  {m.brand?.name || "Unknown"}
                </span>
              </td>

              {/* Slug */}
              <td className="px-5 py-4 font-mono text-zinc-500">{m.slug}</td>

              {/* Year */}
              <td className="px-5 py-4 text-zinc-600">{m.releaseYear || "-"}</td>

              {/* Configured Services (Clickable to manage) */}
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPricingModalModel(m)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-2xs font-bold text-flash-orange hover:bg-flash-orange hover:text-white transition-colors cursor-pointer border border-flash-orange/30 shadow-2xs"
                  title="Configure Service Pricing"
                >
                  <Wrench className="h-3 w-3" />
                  <span>{m.servicePricing?.length || 0} services configured</span>
                </button>
              </td>

              {/* Popular */}
              <td className="px-5 py-4">
                {m.isPopular ? (
                  <AdminStatusBadge status="popular" label="Popular" />
                ) : (
                  <span className="text-zinc-300">-</span>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={m.isActive ? "active" : "inactive"} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => openEditModal(m)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-tech-slate cursor-pointer"
                  title="Edit Model"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setModelToDelete(m)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  title="Delete Model"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>

        {/* Pagination */}
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={totalRecords}
          limit={50}
          onPageChange={setPage}
        />

        {/* Create / Edit Model Modal */}
        {isModalOpen && (
          <AdminModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingModel ? "Edit Device Model" : "Add Device Model"}
            subtitle="Configure smartphone model specifications and catalog image"
            maxWidth="md"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={formError}
            submitText={editingModel ? "Update Model" : "Create Model"}
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Manufacturer Brand *</label>
                <select
                  required
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                >
                  <option value="">Select a brand...</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 15 Pro, Galaxy S24"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">
                    Slug (optional auto-generated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. iphone-15-pro"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Release Year</label>
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Device Image"
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="https://.../phone.png or click Upload"
                helperText="Upload transparent PNG or WebP device mockup"
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                  />
                  <span>Popular Device</span>
                </label>

                <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                  />
                  <span>Active in Catalogue</span>
                </label>
              </div>
            </div>
          </AdminModal>
        )}

        {/* Delete Confirmation Modal */}
        {modelToDelete && (
          <AdminConfirmModal
            isOpen={Boolean(modelToDelete)}
            onClose={() => setModelToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Model"
            message={`Are you sure you want to delete "${modelToDelete.name}"? This action will remove its pricing configurations.`}
            confirmText="Delete Model"
            isDestructive={true}
          />
        )}

        {/* Extracted Service Pricing Matrix Modal */}
        {pricingModalModel && (
          <ModelServicePricingModal
            key={pricingModalModel._id}
            isOpen={Boolean(pricingModalModel)}
            onClose={() => setPricingModalModel(null)}
            model={pricingModalModel}
            availableServices={availableServices}
            onSaved={(updated) => {
              setModels((prev) =>
                prev.map((m) => (m._id === updated._id ? { ...m, ...updated } : m))
              );
              setRefreshIndex((k) => k + 1);
            }}
          />
        )}
      </div>
    </AdminShell>
  );
}
