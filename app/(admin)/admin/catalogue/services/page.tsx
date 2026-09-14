"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Edit2, Trash2, Clock, ShieldCheck, Wrench } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminImage from "@/components/admin/AdminImage";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar, { FilterTab } from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminConfirmModal from "@/components/admin/ui/AdminConfirmModal";

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

const STATUS_TABS: FilterTab[] = [
  { label: "All Services", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const COLUMNS: AdminTableColumn[] = [
  { key: "service", label: "Repair Service" },
  { key: "price", label: "Starting Price" },
  { key: "time", label: "Est. Time" },
  { key: "warranty", label: "Warranty" },
  { key: "popular", label: "Popular" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Confirmation State
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

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
        const data = await adminFetch<{
          services: ServiceItem[];
          pagination?: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/services", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 50,
          },
        });

        if (isSubscribed) {
          setServices(data.services || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || data.services?.length || 0);
        }
      } catch (err) {
        console.error("Failed to load services", err);
        if (isSubscribed) {
          setServices([]);
        }
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
  }, [statusFilter, search, page, refreshIndex]);

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

      await adminFetch(url, {
        method,
        body: payload,
      });

      setIsModalOpen(false);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await adminFetch(`/api/admin/services/${serviceToDelete._id}`, {
        method: "DELETE",
      });
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <AdminShell
      title="Repair Services Catalogue"
      subtitle="Configure doorstep repair services, warranty windows, and base prices"
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
            <span className="hidden sm:inline">Add Service</span>
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
          searchPlaceholder="Search services..."
        />

        {/* Services Table */}
        <AdminTable
          columns={COLUMNS}
          tableClassName="min-w-[680px]"
          loading={loading}
          empty={services.length === 0}
          emptyTitle="No services found"
          emptyDescription="There are no repair services matching your active filters."
        >
          {services.map((s) => (
            <tr key={s._id} className="hover:bg-zinc-50/80 transition-colors">
              {/* Service Details */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={s.image}
                    alt={s.name}
                    fallbackIcon={Wrench}
                    containerClassName="h-9 w-9 rounded-lg bg-orange-50 text-flash-orange border border-orange-200 p-1 flex items-center justify-center shrink-0 shadow-2xs"
                  />
                  <div>
                    <span className="font-bold text-tech-slate block">{s.name}</span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-xs block">
                      {s.description}
                    </span>
                  </div>
                </div>
              </td>

              {/* Price */}
              <td className="px-5 py-4 font-bold text-tech-slate whitespace-nowrap">
                ₹{s.startingPrice}
              </td>

              {/* Estimated Time */}
              <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <span>{s.estimatedTimeMinutes} mins</span>
                </span>
              </td>

              {/* Warranty */}
              <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{s.warrantyDays} days</span>
                </span>
              </td>

              {/* Popular */}
              <td className="px-5 py-4">
                {s.isPopular ? (
                  <AdminStatusBadge status="popular" label="Popular" />
                ) : (
                  <span className="text-zinc-300">-</span>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={s.isActive ? "active" : "inactive"} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
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
                  onClick={() => setServiceToDelete(s)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  title="Delete Service"
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

        {/* Create / Edit Service Modal */}
        {isModalOpen && (
          <AdminModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingService ? "Edit Repair Service" : "Add New Service"}
            subtitle="Configure doorstep service turnaround time and base pricing"
            maxWidth="xl"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={formError}
            submitText={editingService ? "Update Service" : "Create Service"}
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Screen Replacement, Battery Replacement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Starting Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Est. Time (Mins) *</label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={estimatedTimeMinutes}
                    onChange={(e) => setEstimatedTimeMinutes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Warranty (Days) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">
                  Slug (optional auto-generated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. screen-replacement"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <ImageUploadField
                label="Service Illustration / Icon"
                value={image}
                onChange={setImage}
                placeholder="https://.../screen.png or click Upload"
                helperText="Upload transparent PNG or WebP icon"
              />

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Service Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short description of the repair service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white p-3 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">
                  Common Issues (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Cracked glass&#10;Touch not responsive&#10;Black screen"
                  value={commonIssuesText}
                  onChange={(e) => setCommonIssuesText(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white p-3 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
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
                  <span>Popular Service</span>
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
            </div>
          </AdminModal>
        )}

        {/* Delete Confirmation Modal */}
        {serviceToDelete && (
          <AdminConfirmModal
            isOpen={Boolean(serviceToDelete)}
            onClose={() => setServiceToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Service"
            message={`Are you sure you want to deactivate/delete service "${serviceToDelete.name}"?`}
            confirmText="Delete Service"
            isDestructive={true}
          />
        )}
      </div>
    </AdminShell>
  );
}
