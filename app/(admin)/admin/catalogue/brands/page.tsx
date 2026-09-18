"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Edit2, Trash2 } from "lucide-react";
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

interface BrandItem {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  displayOrder: number;
  isPopular: boolean;
  isActive: boolean;
}

const STATUS_TABS: FilterTab[] = [
  { label: "All Brands", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const COLUMNS: AdminTableColumn[] = [
  { key: "brand", label: "Brand" },
  { key: "slug", label: "Slug" },
  { key: "order", label: "Display Order" },
  { key: "popular", label: "Popular" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Confirmation State
  const [brandToDelete, setBrandToDelete] = useState<BrandItem | null>(null);

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
        const data = await adminFetch<{
          brands: BrandItem[];
          pagination?: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/brands", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 50,
          },
        });

        if (isSubscribed) {
          setBrands(data.brands || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || data.brands?.length || 0);
        }
      } catch (err) {
        console.error("Failed to load brands", err);
        if (isSubscribed) {
          setBrands([]);
        }
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
  }, [statusFilter, search, page, refreshIndex]);

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

      await adminFetch(url, {
        method,
        body: payload,
      });

      setIsModalOpen(false);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    try {
      await adminFetch(`/api/admin/brands/${brandToDelete._id}`, {
        method: "DELETE",
      });
      setRefreshIndex((k) => k + 1);
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-text-secondary hover:bg-mist-gray cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-flash-orange-hover shadow-md shadow-flash-orange/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Brand</span>
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
          searchPlaceholder="Search brands..."
        />

        {/* Brands Table */}
        <AdminTable
          columns={COLUMNS}
          tableClassName="min-w-[560px]"
          loading={loading}
          empty={brands.length === 0}
          emptyTitle="No brands found"
          emptyDescription="There are no smartphone brands matching your active filters."
        >
          {brands.map((b) => (
            <tr key={b._id} className="hover:bg-mist-gray/80 transition-colors">
              {/* Brand Logo & Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={b.logoUrl}
                    alt={b.name}
                    fallbackText={b.name[0]?.toUpperCase()}
                    containerClassName="h-9 w-9 shrink-0 rounded-lg bg-clean-white border border-border-default p-1 flex items-center justify-center shadow-2xs"
                  />
                  <span className="font-bold text-tech-slate">{b.name}</span>
                </div>
              </td>

              {/* Slug */}
              <td className="px-5 py-4 font-mono text-text-muted">{b.slug}</td>

              {/* Display Order */}
              <td className="px-5 py-4 text-text-secondary font-mono">#{b.displayOrder}</td>

              {/* Popular */}
              <td className="px-5 py-4">
                {b.isPopular ? (
                  <AdminStatusBadge status="popular" label="Popular" />
                ) : (
                  <span className="text-border-strong">-</span>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={b.isActive ? "active" : "inactive"} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => openEditModal(b)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-mist-gray hover:text-tech-slate cursor-pointer"
                  title="Edit Brand"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setBrandToDelete(b)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-error-light hover:text-error cursor-pointer"
                  title="Delete Brand"
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

        {/* Create / Edit Brand Modal */}
        {isModalOpen && (
          <AdminModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingBrand ? "Edit Brand" : "Add New Brand"}
            subtitle="Configure smartphone manufacturer brand and logo"
            maxWidth="md"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={formError}
            submitText={editingBrand ? "Update Brand" : "Create Brand"}
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple, Samsung, OnePlus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary">
                  Slug (optional auto-generated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. apple"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <ImageUploadField
                label="Brand Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                placeholder="https://.../brand-logo.svg or click Upload"
                helperText="Upload transparent SVG or PNG logo to ImgBB or paste a direct image link"
              />

              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 font-bold text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded border-border-strong text-flash-orange focus:ring-flash-orange"
                  />
                  <span>Popular Brand</span>
                </label>

                <label className="inline-flex items-center gap-2 font-bold text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-border-strong text-flash-orange focus:ring-flash-orange"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
          </AdminModal>
        )}

        {/* Delete Confirmation Modal */}
        {brandToDelete && (
          <AdminConfirmModal
            isOpen={Boolean(brandToDelete)}
            onClose={() => setBrandToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Brand"
            message={`Are you sure you want to deactivate/delete brand "${brandToDelete.name}"?`}
            confirmText="Delete Brand"
            isDestructive={true}
          />
        )}
      </div>
    </AdminShell>
  );
}
