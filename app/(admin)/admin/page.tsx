"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Smartphone,
  ClipboardList,
  MessageSquare,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { clientSignOut } from "@/lib/firebase/client";

interface AdminUser {
  email: string;
  name: string;
  picture?: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Check current admin session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await clientSignOut();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-clean-white px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flash-orange text-clean-white shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-extrabold text-tech-slate">
                Quick<span className="text-flash-orange">Fix</span>
                <span className="ml-1.5 rounded-md bg-tech-slate px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-clean-white">
                  Admin
                </span>
              </span>
            </div>
          </div>

          {/* User Controls & Logout */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-flash-orange transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {user && (
              <div className="flex items-center gap-2 rounded-full bg-mist-gray px-3 py-1 border border-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-tech-slate truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-8 space-y-8">
        {/* Hello World Hero Greeting */}
        <div className="rounded-2xl bg-linear-to-r from-tech-slate to-[#262c36] p-6 sm:p-8 text-clean-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs mb-3 border border-white/15">
              <ShieldCheck className="h-4 w-4" />
              <span>Authenticated Admin Session</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hello World! Welcome to QuickFix Admin
            </h1>
            <p className="mt-2 text-sm text-zinc-300 max-w-xl">
              You are signed in as an authorized administrator. Database schemas and connection modules are ready for management APIs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xs border border-white/20">
              ⚡ Next.js 16 App Router
            </span>
            <span className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xs border border-white/20">
              🍃 Mongoose Ready
            </span>
          </div>
        </div>

        {/* Overview Metric Placeholders */}
        <div>
          <h2 className="font-heading text-lg font-bold text-tech-slate mb-4">
            Operations Overview (Client Placeholder)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <div className="rounded-xl bg-clean-white p-5 border border-zinc-200 shadow-xs hover:border-flash-orange/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Repair Requests
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-flash-orange">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 font-heading text-2xl font-extrabold text-tech-slate">
                12
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                4 Doorstep • 8 Express pickup
              </p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl bg-clean-white p-5 border border-zinc-200 shadow-xs hover:border-flash-orange/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Supported Brands
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-electric-amber">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 font-heading text-2xl font-extrabold text-tech-slate">
                8 Brands
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Apple, Samsung, OnePlus, Xiaomi
              </p>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl bg-clean-white p-5 border border-zinc-200 shadow-xs hover:border-flash-orange/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Repair Services
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Wrench className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 font-heading text-2xl font-extrabold text-tech-slate">
                6 Active
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Screen, Battery, Camera, Water
              </p>
            </div>

            {/* Metric 4 */}
            <div className="rounded-xl bg-clean-white p-5 border border-zinc-200 shadow-xs hover:border-flash-orange/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Contact Inquiries
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 font-heading text-2xl font-extrabold text-tech-slate">
                4 New
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Corporate bulk & support tickets
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Status Info Card */}
        <div className="rounded-xl border border-zinc-200 bg-clean-white p-6 shadow-xs">
          <h3 className="font-heading text-base font-bold text-tech-slate mb-2">
            System Architecture Status
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
            This admin route is protected by Firebase Admin token verification and an email allowlist check via <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-800">AUTH_EMAILS</code>. The Mongoose schemas (<code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">RepairService</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">Brand</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">DeviceModel</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">RepairRequest</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">ContactSubmission</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">BlogPost</code>) are compiled and ready to be connected to admin CRUD APIs.
          </p>
        </div>
      </main>
    </div>
  );
}
