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
  IndianRupee,
  Smartphone,
  Wrench,
  Clock,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminImage from "@/components/admin/AdminImage";

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
}

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice: number;
  estimatedTimeMinutes: number;
  warrantyDays: number;
  image?: string;
  isActive?: boolean;
}

interface ServicePricingItem {
  service: {
    _id: string;
    name: string;
    slug?: string;
    startingPrice?: number;
    image?: string;
  };
  price: number;
  estimatedTimeMinutes?: number;
}

interface ModelItem {
  _id: string;
  name: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
    slug: string;
  };
  releaseYear?: number;
  imageUrl?: string;
  isPopular: boolean;
  isActive: boolean;
  servicePricing?: ServicePricingItem[];
}

interface WorkingServicePricingEntry {
  serviceId: string;
  price: number | string;
  estimatedTimeMinutes: number | string;
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
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
  const [releaseYear, setReleaseYear] = useState<number | string>(
    new Date().getFullYear()
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Model Services Association Modal State
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedModelForServices, setSelectedModelForServices] =
    useState<ModelItem | null>(null);
  const [modelServiceList, setModelServiceList] = useState<
    WorkingServicePricingEntry[]
  >([]);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [servicesModalError, setServicesModalError] = useState("");
  const [servicesModalSuccess, setServicesModalSuccess] = useState("");

  // Add Service Form State
  const [addServiceId, setAddServiceId] = useState("");
  const [addServicePrice, setAddServicePrice] = useState<number | string>("");
  const [addServiceTime, setAddServiceTime] = useState<number | string>(30);

  // 1. Load Brands list
  useEffect(() => {
    fetch("/api/admin/brands?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.brands)) {
          setBrands(data.data.brands);
        }
      })
      .catch((err) => console.error("Failed to load brands", err));
  }, []);

  // 2. Load Available Repair Services catalogue
  useEffect(() => {
    fetch("/api/admin/services?limit=100&status=active")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.services)) {
          setAvailableServices(data.data.services);
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
        const params = new URLSearchParams();
        if (selectedBrand) params.set("brand", selectedBrand);
        if (search) params.set("search", search);
        params.set("limit", "100");

        const res = await fetch(`/api/admin/models?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.models)) {
            setModels(data.data.models);
          } else {
            setModels([]);
          }
        }
      } catch (err) {
        console.error("Failed to load models", err);
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
  }, [selectedBrand, search, refreshIndex]);

  // Model Modal Handlers
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
      const payload: Record<string, unknown> = {
        brand: brandId,
        name: name.trim(),
        slug: slug.trim() || undefined,
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        imageUrl: imageUrl.trim() || undefined,
        isPopular,
        isActive,
      };

      const url = editingModel
        ? `/api/admin/models/${editingModel._id}`
        : "/api/admin/models";
      const method = editingModel ? "PATCH" : "POST";

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
        setFormError(data.error?.message || "Failed to save model");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving model");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`Are you sure you want to deactivate/delete model "${name}"?`)
    )
      return;

    try {
      const res = await fetch(`/api/admin/models/${id}`, {
        method: "DELETE",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      if (res.ok) {
        setRefreshIndex((k) => k + 1);
      }
    } catch (err) {
      console.error("Failed to delete model", err);
    }
  };

  // -------------------------------------------------------------
  // Model Services Management Handlers
  // -------------------------------------------------------------

  const openServicesModal = (m: ModelItem) => {
    setSelectedModelForServices(m);

    // Map existing populated service pricing into working entries
    const existingEntries: WorkingServicePricingEntry[] = (
      m.servicePricing || []
    )
      .map((sp) => ({
        serviceId: sp.service?._id || (sp.service as unknown as string),
        price: sp.price,
        estimatedTimeMinutes: sp.estimatedTimeMinutes || 30,
      }))
      .filter((sp) => Boolean(sp.serviceId));

    setModelServiceList(existingEntries);
    setServicesModalError("");
    setServicesModalSuccess("");
    setAddServiceId("");
    setAddServicePrice("");
    setAddServiceTime(30);
    setIsServicesModalOpen(true);
  };

  const handleSelectServiceToAdd = (svcId: string) => {
    setAddServiceId(svcId);
    const svc = availableServices.find((s) => s._id === svcId);
    if (svc) {
      setAddServicePrice(svc.startingPrice);
      setAddServiceTime(svc.estimatedTimeMinutes || 30);
    }
  };

  const handleAddServiceToList = () => {
    if (!addServiceId) {
      setServicesModalError("Please select a repair service to add");
      return;
    }

    const priceNum = Number(addServicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setServicesModalError("Please specify a valid price for this service");
      return;
    }

    const timeNum = Number(addServiceTime) || 30;

    // Check if already in list
    const existingIndex = modelServiceList.findIndex(
      (item) => item.serviceId === addServiceId
    );

    if (existingIndex >= 0) {
      // Update existing entry
      const updated = [...modelServiceList];
      updated[existingIndex] = {
        serviceId: addServiceId,
        price: priceNum,
        estimatedTimeMinutes: timeNum,
      };
      setModelServiceList(updated);
      setServicesModalSuccess("Updated pricing for existing service");
    } else {
      // Add new entry
      setModelServiceList((prev) => [
        ...prev,
        {
          serviceId: addServiceId,
          price: priceNum,
          estimatedTimeMinutes: timeNum,
        },
      ]);
      setServicesModalSuccess("Service added to model");
    }

    setAddServiceId("");
    setAddServicePrice("");
    setAddServiceTime(30);
    setServicesModalError("");
  };

  const handleQuickAddAllServices = () => {
    const existingIds = new Set(modelServiceList.map((item) => item.serviceId));
    const newItems: WorkingServicePricingEntry[] = [];

    availableServices.forEach((svc) => {
      if (!existingIds.has(svc._id)) {
        newItems.push({
          serviceId: svc._id,
          price: svc.startingPrice,
          estimatedTimeMinutes: svc.estimatedTimeMinutes || 30,
        });
      }
    });

    if (newItems.length === 0) {
      setServicesModalError(
        "All available repair services are already configured for this model."
      );
      return;
    }

    setModelServiceList((prev) => [...prev, ...newItems]);
    setServicesModalSuccess(
      `Added ${newItems.length} services at default starting prices.`
    );
    setServicesModalError("");
  };

  const handleRemoveServiceFromList = (serviceId: string) => {
    setModelServiceList((prev) =>
      prev.filter((item) => item.serviceId !== serviceId)
    );
  };

  const handleUpdateEntryPrice = (serviceId: string, val: string) => {
    setModelServiceList((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId ? { ...item, price: val } : item
      )
    );
  };

  const handleUpdateEntryTime = (serviceId: string, val: string) => {
    setModelServiceList((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId
          ? { ...item, estimatedTimeMinutes: val }
          : item
      )
    );
  };

  const handleSaveModelServices = async () => {
    if (!selectedModelForServices) return;

    setIsSavingServices(true);
    setServicesModalError("");
    setServicesModalSuccess("");

    try {
      const payload = {
        servicePricing: modelServiceList.map((item) => ({
          service: item.serviceId,
          price: Number(item.price) || 0,
          estimatedTimeMinutes: Number(item.estimatedTimeMinutes) || 30,
        })),
      };

      const res = await fetch(
        `/api/admin/models/${selectedModelForServices._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-QuickFix-CSRF": "1",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setServicesModalSuccess(
          "Model repair services and pricing updated successfully!"
        );
        // Update local model in models list
        if (data.data?.model) {
          const updated = data.data.model;
          setModels((prev) =>
            prev.map((m) =>
              m._id === selectedModelForServices._id ? updated : m
            )
          );
          setSelectedModelForServices(updated);
        }
        setRefreshIndex((k) => k + 1);
      } else {
        setServicesModalError(
          data.error?.message || "Failed to update repair services"
        );
      }
    } catch (err) {
      setServicesModalError(
        err instanceof Error ? err.message : "Error saving repair services"
      );
    } finally {
      setIsSavingServices(false);
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
            title="Refresh models"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            title="Add Model"
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Model</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Brand Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full sm:w-56 rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
            >
              <option value="">All Smartphone Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Models Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Device Model</th>
                  <th className="px-5 py-3.5">Brand</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Year</th>
                  <th className="px-5 py-3.5">Configured Services</th>
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
                ) : models.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-zinc-400"
                    >
                      No device models found for selected criteria.
                    </td>
                  </tr>
                ) : (
                  models.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Model Name & Image */}
                      <td className="px-5 py-4 font-bold text-tech-slate">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={m.imageUrl}
                            alt={m.name}
                            fallbackIcon={Smartphone}
                            containerClassName="h-9 w-9 shrink-0 rounded-lg bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shadow-2xs text-tech-slate"
                            className="h-full w-full object-contain"
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
                      <td className="px-5 py-4 font-mono text-zinc-500">
                        {m.slug}
                      </td>

                      {/* Year */}
                      <td className="px-5 py-4 text-zinc-600">
                        {m.releaseYear || "-"}
                      </td>

                      {/* Configured Services (Clickable to manage) */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openServicesModal(m)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 py-1 text-xs font-semibold text-tech-slate hover:border-flash-orange hover:text-flash-orange hover:bg-orange-50/40 transition-all cursor-pointer group"
                          title="Click to view & edit repair services for this model"
                        >
                          <IndianRupee className="h-3 w-3 text-zinc-400 group-hover:text-flash-orange" />
                          <span>
                            {m.servicePricing?.length || 0} services
                          </span>
                          <Wrench className="h-3 w-3 text-zinc-400 group-hover:text-flash-orange ml-0.5" />
                        </button>
                      </td>

                      {/* Popular */}
                      <td className="px-5 py-4">
                        {m.isPopular ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Popular
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {m.isActive ? (
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

                      {/* Actions */}
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openServicesModal(m)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-orange-50 hover:text-flash-orange cursor-pointer"
                          title="Manage Repair Services & Pricing"
                        >
                          <Wrench className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(m)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-tech-slate cursor-pointer"
                          title="Edit Model Details"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m._id, m.name)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete Model"
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

        {/* ------------------------------------------------------------- */}
        {/* Create / Edit Model Modal */}
        {/* ------------------------------------------------------------- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h3 className="font-heading text-lg font-bold text-tech-slate">
                  {editingModel ? "Edit Device Model" : "Add New Device Model"}
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
                  <label className="font-bold text-zinc-700">
                    Smartphone Brand *
                  </label>
                  <select
                    required
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  >
                    <option value="">Select Brand...</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 16 Pro Max, Galaxy S24 Ultra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">
                    Slug (optional auto-generated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. iphone-16-pro-max"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">
                    Release Year
                  </label>
                  <input
                    type="number"
                    min={2010}
                    max={2030}
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <ImageUploadField
                  label="Device Image (Optional)"
                  value={imageUrl}
                  onChange={setImageUrl}
                  placeholder="https://... or click Upload"
                  helperText="Upload phone photo to ImgBB or paste a direct image URL"
                />

                <div className="flex items-center gap-6 pt-2">
                  <label className="inline-flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded border-zinc-300 text-flash-orange focus:ring-flash-orange"
                    />
                    <span>Popular Model</span>
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

                {editingModel && (
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-zinc-500 text-2xs">
                      {editingModel.servicePricing?.length || 0} repair services
                      configured
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        openServicesModal(editingModel);
                      }}
                      className="inline-flex items-center gap-1.5 text-flash-orange font-bold hover:underline cursor-pointer"
                    >
                      <Wrench className="h-3.5 w-3.5" />
                      <span>Configure Services</span>
                    </button>
                  </div>
                )}

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
                    {isSubmitting && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    <span>
                      {editingModel ? "Update Model" : "Create Model"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Model Repair Services Association & Pricing Modal */}
        {/* ------------------------------------------------------------- */}
        {isServicesModalOpen && selectedModelForServices && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-zinc-200 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={selectedModelForServices.imageUrl}
                    alt={selectedModelForServices.name}
                    fallbackIcon={Smartphone}
                    containerClassName="h-11 w-11 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-tech-slate">
                        {selectedModelForServices.name}
                      </h3>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-2xs font-bold text-tech-slate">
                        {selectedModelForServices.brand?.name}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Configure custom repair prices and turnaround times for
                      this phone model.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsServicesModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Feedback Alerts */}
              {servicesModalError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium flex items-center gap-2 shrink-0">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{servicesModalError}</span>
                </div>
              )}

              {servicesModalSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 font-medium flex items-center gap-2 shrink-0">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{servicesModalSuccess}</span>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs shrink-0">
                <span className="font-bold text-tech-slate">
                  {modelServiceList.length} Repair Services Configured
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleQuickAddAllServices}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-tech-slate px-3 py-1.5 text-xs font-bold text-clean-white hover:bg-black transition-all cursor-pointer"
                    title="Populate all active catalogue services with default starting rates"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-electric-amber" />
                    <span>Quick Add All Active Services</span>
                  </button>

                  {modelServiceList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setModelServiceList([])}
                      className="rounded-lg border border-zinc-200 bg-clean-white px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Add New Service Form Row */}
              <div className="p-4 rounded-xl border border-flash-orange/30 bg-flash-orange/5 space-y-3 shrink-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-flash-orange">
                  + Add / Associate Repair Service
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-2xs font-bold text-zinc-600">
                      Select Service
                    </label>
                    <select
                      value={addServiceId}
                      onChange={(e) =>
                        handleSelectServiceToAdd(e.target.value)
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-clean-white px-3 py-2 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="">Choose service...</option>
                      {availableServices.map((svc) => {
                        const isAlreadyAdded = modelServiceList.some(
                          (item) => item.serviceId === svc._id
                        );
                        return (
                          <option key={svc._id} value={svc._id}>
                            {svc.name}{" "}
                            {isAlreadyAdded ? "(Already added)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-2xs font-bold text-zinc-600">
                      Model Price (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="number"
                        min={0}
                        placeholder="2499"
                        value={addServicePrice}
                        onChange={(e) => setAddServicePrice(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-clean-white pl-8 pr-2 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-2xs font-bold text-zinc-600">
                      Est. Time (Mins)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="number"
                        min={5}
                        placeholder="30"
                        value={addServiceTime}
                        onChange={(e) => setAddServiceTime(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-clean-white pl-8 pr-2 py-2 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddServiceToList}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-flash-orange px-3 py-2 text-xs font-bold text-clean-white hover:bg-orange-600 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Configured Services Table (Scrollable) */}
              <div className="flex-1 overflow-y-auto min-h-[160px] rounded-xl border border-zinc-200 bg-clean-white">
                {modelServiceList.length === 0 ? (
                  <div className="text-center py-10 px-4 text-zinc-400 space-y-2">
                    <Wrench className="h-8 w-8 mx-auto text-zinc-300" />
                    <p className="text-xs font-medium">
                      No repair services associated with this model yet.
                    </p>
                    <p className="text-2xs text-zinc-400">
                      Use the &quot;Quick Add All Active Services&quot; button
                      above or add individual services manually.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-zinc-50 border-b border-zinc-200 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                      <tr>
                        <th className="px-4 py-2.5">Service</th>
                        <th className="px-4 py-2.5">Price (₹)</th>
                        <th className="px-4 py-2.5">Est. Time</th>
                        <th className="px-4 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {modelServiceList.map((entry) => {
                        const svc = availableServices.find(
                          (s) => s._id === entry.serviceId
                        );
                        return (
                          <tr
                            key={entry.serviceId}
                            className="hover:bg-zinc-50/80 transition-colors"
                          >
                            {/* Service Details */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <AdminImage
                                  src={svc?.image}
                                  alt={svc?.name || "Service"}
                                  fallbackIcon={Wrench}
                                  containerClassName="h-7 w-7 rounded-md bg-flash-orange/10 text-flash-orange border border-flash-orange/20 p-0.5 flex items-center justify-center shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-tech-slate block">
                                    {svc?.name || "Unknown Service"}
                                  </span>
                                  {svc?.startingPrice !== undefined && (
                                    <span className="text-2xs text-zinc-400">
                                      Catalogue Default: ₹{svc.startingPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Editable Price */}
                            <td className="px-4 py-3 w-36">
                              <div className="relative">
                                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                <input
                                  type="number"
                                  min={0}
                                  value={entry.price}
                                  onChange={(e) =>
                                    handleUpdateEntryPrice(
                                      entry.serviceId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-lg border border-zinc-200 bg-clean-white pl-7 pr-2 py-1.5 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                                />
                              </div>
                            </td>

                            {/* Editable Time */}
                            <td className="px-4 py-3 w-32">
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                <input
                                  type="number"
                                  min={5}
                                  value={entry.estimatedTimeMinutes}
                                  onChange={(e) =>
                                    handleUpdateEntryTime(
                                      entry.serviceId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-lg border border-zinc-200 bg-clean-white pl-7 pr-2 py-1.5 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
                                />
                              </div>
                            </td>

                            {/* Delete Action */}
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveServiceFromList(entry.serviceId)
                                }
                                className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                title="Remove service association"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 shrink-0">
                <span className="text-2xs text-zinc-500 font-medium">
                  Changes must be saved to update pricing for this device model.
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsServicesModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModelServices}
                    disabled={isSavingServices}
                    className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSavingServices ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {isSavingServices
                        ? "Saving Pricing..."
                        : "Save Pricing Rules"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
