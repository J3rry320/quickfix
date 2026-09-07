"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";

interface ContactItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  internalNotes?: string;
  createdAt: string;
}

const STATUS_TABS = [
  { label: "All Enquiries", value: "" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Edit fields for modal
  const [newStatus, setNewStatus] = useState<string>("new");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    async function fetchContacts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "50");

        const res = await fetch(`/api/admin/contacts?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.contacts)) {
            setContacts(data.data.contacts);
          } else {
            setContacts([]);
          }
        }
      } catch (err) {
        console.error("Failed to load contacts", err);
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
  }, [statusFilter, search, refreshIndex]);

  const openDetailModal = (contact: ContactItem) => {
    setSelectedContact(contact);
    setNewStatus(contact.status);
    setInternalNotes(contact.internalNotes || "");
    setUpdateError("");
  };

  const handleUpdate = async () => {
    if (!selectedContact) return;
    setIsUpdating(true);
    setUpdateError("");

    try {
      const res = await fetch(`/api/admin/contacts/${selectedContact._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-QuickFix-CSRF": "1",
        },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: internalNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedContact(null);
        setRefreshIndex((k) => k + 1);
      } else {
        setUpdateError(data.error?.message || "Failed to update inquiry");
      }
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Error updating inquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      if (res.ok) {
        setRefreshIndex((k) => k + 1);
      }
    } catch (err) {
      console.error("Failed to delete contact", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <AdminShell
      title="Customer Inquiries"
      subtitle="Manage callback requests, corporate bulk inquiries, and general support tickets"
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
        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, phone, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Subject & Preview</th>
                  <th className="px-5 py-3.5">Date</th>
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
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                      No customer inquiries found.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-tech-slate">
                        {c.name}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-zinc-700 font-medium">{c.phone}</div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-xs">{c.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-tech-slate">{c.subject || "General Inquiry"}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-sm">
                          {c.message}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                            c.status
                          )}`}
                        >
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openDetailModal(c)}
                          className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-tech-slate hover:text-clean-white transition-all cursor-pointer"
                        >
                          View & Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id, c.name)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Inquiry"
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

        {/* View & Update Contact Modal */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-tech-slate">
                    Inquiry from {selectedContact.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Received {new Date(selectedContact.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contact Information & Full Message */}
              <div className="space-y-3 text-xs">
                <div className="flex flex-wrap gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <a href={`tel:${selectedContact.phone}`} className="font-bold hover:underline">
                      {selectedContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <a href={`mailto:${selectedContact.email}`} className="hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">
                    Subject: {selectedContact.subject || "General Inquiry"}
                  </span>
                  <p className="text-tech-slate whitespace-pre-wrap leading-relaxed pt-1">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Status and Notes Update Form */}
              <div className="space-y-3 pt-2 border-t border-zinc-200 text-xs">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-tech-slate">
                  Resolution & Internal Notes
                </h4>

                {updateError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                    {updateError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Inquiry Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  >
                    <option value="new">New (Needs Callback)</option>
                    <option value="in_progress">In Progress (Contacted)</option>
                    <option value="resolved">Resolved (Closed)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Internal Staff Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Staff notes (e.g. Called customer on WhatsApp at 2 PM, scheduled doorstep technician)..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Update Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
