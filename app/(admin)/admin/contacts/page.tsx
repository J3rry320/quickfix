"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Mail, Phone, Trash2, MapPin } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar, { FilterTab } from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminConfirmModal from "@/components/admin/ui/AdminConfirmModal";

interface ContactItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  area?: string;
  status: "new" | "in_progress" | "contacted" | "resolved" | "archived";
  internalNotes?: string;
  locale?: string;
  createdAt: string;
}

const STATUS_TABS: FilterTab[] = [
  { label: "All Enquiries", value: "" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Contacted", value: "contacted" },
  { label: "Resolved", value: "resolved" },
  { label: "Archived", value: "archived" },
];

const COLUMNS: AdminTableColumn[] = [
  { key: "name", label: "Customer" },
  { key: "area", label: "Area / Locality" },
  { key: "subject", label: "Subject & Message" },
  { key: "status", label: "Status" },
  { key: "date", label: "Submitted" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Detail Modal State
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>("new");
  const [internalNotes, setInternalNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Delete Confirmation Modal State
  const [contactToDelete, setContactToDelete] = useState<ContactItem | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    async function fetchContacts() {
      setLoading(true);
      try {
        const data = await adminFetch<{
          contacts: ContactItem[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/contacts", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 20,
          },
        });

        if (isSubscribed) {
          setContacts(data.contacts || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Failed to load contacts", err);
        if (isSubscribed) {
          setContacts([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, page, refreshIndex]);

  const openDetailModal = (contact: ContactItem) => {
    setSelectedContact(contact);
    setNewStatus(contact.status);
    setInternalNotes(contact.internalNotes || "");
    setUpdateError("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    setIsUpdating(true);
    setUpdateError("");

    try {
      await adminFetch(`/api/admin/contacts/${selectedContact._id}`, {
        method: "PATCH",
        body: {
          status: newStatus,
          internalNotes: internalNotes.trim() || undefined,
        },
      });

      setSelectedContact(null);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Error updating inquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      await adminFetch(`/api/admin/contacts/${contactToDelete._id}`, {
        method: "DELETE",
      });
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      console.error("Failed to archive contact", err);
    }
  };

  return (
    <AdminShell
      title="Contact Inquiries"
      subtitle="View, follow up and resolve customer inquiries from website forms"
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
          searchPlaceholder="Search name, phone, subject..."
        />

        {/* Contacts Table */}
        <AdminTable
          columns={COLUMNS}
          loading={loading}
          empty={contacts.length === 0}
          emptyTitle="No contact inquiries found"
          emptyDescription="There are no inquiries matching your active filters."
        >
          {contacts.map((c) => (
            <tr key={c._id} className="hover:bg-zinc-50/80 transition-colors">
              {/* Customer */}
              <td className="px-5 py-4">
                <div className="font-bold text-tech-slate">{c.name}</div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 text-zinc-400" />
                    {c.phone}
                  </span>
                  {c.email && (
                    <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                      <Mail className="h-3 w-3 text-zinc-400" />
                      {c.email}
                    </span>
                  )}
                </div>
              </td>

              {/* Area */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 text-zinc-600 font-medium">
                  {c.area ? (
                    <>
                      <MapPin className="h-3 w-3 text-flash-orange" />
                      <span>{c.area}</span>
                    </>
                  ) : (
                    <span className="text-zinc-400">Pune</span>
                  )}
                </span>
              </td>

              {/* Subject & Message Preview */}
              <td className="px-5 py-4 max-w-xs">
                <div className="font-bold text-tech-slate truncate">
                  {c.subject || "General Inquiry"}
                </div>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5 max-w-sm">
                  {c.message}
                </p>
                {c.internalNotes && (
                  <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 inline-block mt-1 font-medium">
                    Note: {c.internalNotes}
                  </p>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={c.status} />
              </td>

              {/* Date */}
              <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                {new Date(c.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => openDetailModal(c)}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-tech-slate hover:text-clean-white transition-all cursor-pointer"
                >
                  Manage
                </button>
                <button
                  type="button"
                  onClick={() => setContactToDelete(c)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title="Archive Inquiry"
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
          limit={20}
          onPageChange={setPage}
        />

        {/* Manage Inquiry Modal */}
        {selectedContact && (
          <AdminModal
            isOpen={Boolean(selectedContact)}
            onClose={() => setSelectedContact(null)}
            title="Customer Inquiry"
            subtitle={`Submitted on ${new Date(selectedContact.createdAt).toLocaleString("en-IN")}`}
            maxWidth="lg"
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            error={updateError}
            submitText="Save Updates"
          >
            <div className="space-y-4">
              {/* Sender Details Box */}
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-tech-slate text-sm">
                    {selectedContact.name}
                  </span>
                  <span className="text-2xs text-zinc-500 uppercase font-bold">
                    Area: {selectedContact.area || "Pune"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-zinc-600">
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center gap-1.5 hover:text-flash-orange font-mono"
                  >
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{selectedContact.phone}</span>
                  </a>

                  {selectedContact.email && (
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="flex items-center gap-1.5 hover:text-flash-orange"
                    >
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{selectedContact.email}</span>
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-200">
                  <span className="font-bold text-zinc-700 block mb-1">
                    Subject: {selectedContact.subject || "General Inquiry"}
                  </span>
                  <p className="text-zinc-600 leading-relaxed bg-white p-3 rounded-lg border border-zinc-200/70 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Inquiry Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                >
                  <option value="new">New Inquiry</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Internal Staff Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">
                  Internal Staff Notes (Private)
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Called customer at 3pm, confirmed screen model..."
                  className="w-full rounded-xl border border-zinc-200 bg-clean-white p-3 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>
            </div>
          </AdminModal>
        )}

        {/* Delete / Archive Confirmation Modal */}
        {contactToDelete && (
          <AdminConfirmModal
            isOpen={Boolean(contactToDelete)}
            onClose={() => setContactToDelete(null)}
            onConfirm={handleDelete}
            title="Archive Inquiry"
            message={`Are you sure you want to archive the inquiry from "${contactToDelete.name}"? You can view it later under the Archived tab.`}
            confirmText="Archive"
            isDestructive={false}
          />
        )}
      </div>
    </AdminShell>
  );
}
