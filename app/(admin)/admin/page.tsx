"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Smartphone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Layers,
  BookOpen,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatsData {
  repairs: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    today: number;
  };
  catalogue: {
    brands: { total: number; active: number };
    models: { total: number };
    services: { total: number; active: number };
  };
  contacts: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  recentRequests: Array<{
    _id: string;
    bookingReference: string;
    customer: { name: string; phone: string };
    device: { brand: string; model: string };
    service: { name: string };
    pricing?: { estimatedPrice?: number; finalPrice?: number };
    status: string;
    createdAt: string;
  }>;
  recentContacts: Array<{
    _id: string;
    name: string;
    phone: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
}

interface AdminUser {
  name: string;
  email: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch authenticated user info
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch live stats from protected API
    fetch("/api/admin/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data?.stats) {
          setStats(data.data.stats);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch admin stats", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
      case "in_progress":
      case "technician_assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
      case "resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <AdminShell
      title="Operations Overview"
      subtitle={`System metrics & activity as of ${todayFormatted}`}
    >
      <div className="space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="rounded-2xl bg-tech-slate p-6 sm:p-8 text-clean-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs border border-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live • Pune Central Control</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || user?.email?.split("@")[0] || "User"}!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Monitor incoming doorstep repair bookings, manage your device catalog, and respond to customer enquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/repairs"
              className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Wrench className="h-4 w-4" />
              <span>Manage Bookings</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-zinc-500">
              Key Performance Indicators
            </h3>
            {stats && (
              <span className="text-xs text-zinc-400 font-medium">
                {stats.repairs.today} new bookings today
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200 bg-clean-white p-5 space-y-3"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Total Repairs */}
              <Link
                href="/admin/repairs"
                className="group rounded-2xl border border-zinc-200 bg-clean-white p-5 shadow-xs hover:border-flash-orange/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Repair Requests
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-flash-orange group-hover:scale-110 transition-transform">
                    <Wrench className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-heading text-3xl font-extrabold text-tech-slate">
                  {stats?.repairs.total ?? 0}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                    <Clock className="h-3 w-3" />
                    {stats?.repairs.pending ?? 0} Pending
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {stats?.repairs.completed ?? 0} Done
                  </span>
                </div>
              </Link>

              {/* Stat 2: Active Services */}
              <Link
                href="/admin/catalogue/services"
                className="group rounded-2xl border border-zinc-200 bg-clean-white p-5 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Active Services
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-heading text-3xl font-extrabold text-tech-slate">
                  {stats?.catalogue.services.active ?? 0}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {stats?.catalogue.services.total ?? 0} catalogued services
                </p>
              </Link>

              {/* Stat 3: Device Models & Brands */}
              <Link
                href="/admin/catalogue/models"
                className="group rounded-2xl border border-zinc-200 bg-clean-white p-5 shadow-xs hover:border-purple-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Device Catalog
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                    <Smartphone className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-heading text-3xl font-extrabold text-tech-slate">
                  {stats?.catalogue.models.total ?? 0}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Across {stats?.catalogue.brands.active ?? 0} smartphone brands
                </p>
              </Link>

              {/* Stat 4: Contact Inquiries */}
              <Link
                href="/admin/contacts"
                className="group rounded-2xl border border-zinc-200 bg-clean-white p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Contact Enquiries
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-heading text-3xl font-extrabold text-tech-slate">
                  {stats?.contacts.total ?? 0}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    {stats?.contacts.new ?? 0} New
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-500">
                    {stats?.contacts.resolved ?? 0} Resolved
                  </span>
                </div>
              </Link>
            </div>
          )}
        </section>

        {/* Quick Action Shortcuts */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-zinc-500">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/repairs?status=pending"
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-clean-white p-3.5 text-xs font-bold text-tech-slate hover:bg-zinc-50 hover:border-flash-orange/40 transition-all shadow-2xs"
            >
              <span>Review Pending Repairs</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link
              href="/admin/catalogue/services"
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-clean-white p-3.5 text-xs font-bold text-tech-slate hover:bg-zinc-50 hover:border-flash-orange/40 transition-all shadow-2xs"
            >
              <span>Add / Edit Services</span>
              <Plus className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link
              href="/admin/catalogue/models"
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-clean-white p-3.5 text-xs font-bold text-tech-slate hover:bg-zinc-50 hover:border-flash-orange/40 transition-all shadow-2xs"
            >
              <span>Configure Model Pricing</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-clean-white p-3.5 text-xs font-bold text-tech-slate hover:bg-zinc-50 hover:border-flash-orange/40 transition-all shadow-2xs"
            >
              <span>Write Blog Article</span>
              <BookOpen className="h-4 w-4 text-zinc-400" />
            </Link>
          </div>
        </section>

        {/* Recent Activity Sections (Two Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Repair Requests */}
          <section className="rounded-2xl border border-zinc-200 bg-clean-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-tech-slate">
                  Recent Repair Bookings
                </h3>
                <p className="text-xs text-zinc-500">
                  Latest customer repair requests
                </p>
              </div>
              <Link
                href="/admin/repairs"
                className="text-xs font-bold text-flash-orange hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !stats?.recentRequests?.length ? (
              <div className="text-center py-8 text-xs text-zinc-400">
                No repair bookings recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.recentRequests.map((req) => (
                  <div
                    key={req._id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-tech-slate font-mono">
                          {req.bookingReference}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-600 truncate">
                          {req.customer.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {req.device.brand} {req.device.model} ({req.service.name})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Contact Inquiries */}
          <section className="rounded-2xl border border-zinc-200 bg-clean-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-tech-slate">
                  Recent Inquiries
                </h3>
                <p className="text-xs text-zinc-500">
                  Landing page general contact submissions
                </p>
              </div>
              <Link
                href="/admin/contacts"
                className="text-xs font-bold text-flash-orange hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !stats?.recentContacts?.length ? (
              <div className="text-center py-8 text-xs text-zinc-400">
                No contact enquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.recentContacts.map((c) => (
                  <div
                    key={c._id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-tech-slate truncate">
                          {c.name}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500 text-[11px]">
                          {c.phone}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {c.subject || "General Inquiry"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
