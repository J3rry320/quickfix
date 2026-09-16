"use client";

import { clientSignOut } from "@/lib/firebase/client";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Smartphone,
  Star,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminUser {
  email: string;
  name: string;
  picture?: string | null;
}

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        label: "Repair Requests",
        href: "/admin/repairs",
        icon: Wrench,
      },
      {
        label: "Contact Inquiries",
        href: "/admin/contacts",
        icon: MessageSquare,
      },
      {
        label: "Customer Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    group: "Catalogue",
    items: [
      {
        label: "Repair Services",
        href: "/admin/catalogue/services",
        icon: Settings,
      },
      {
        label: "Smartphone Brands",
        href: "/admin/catalogue/brands",
        icon: Layers,
      },
      {
        label: "Device Models",
        href: "/admin/catalogue/models",
        icon: Smartphone,
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        label: "Blog Posts",
        href: "/admin/blogs",
        icon: BookOpen,
      },
    ],
  },
];

function SidebarNavigation({
  pathname,
  user,
  loggingOut,
  onLogout,
  onItemClick,
  showLogo = true,
}: {
  pathname: string;
  user: AdminUser | null;
  loggingOut: boolean;
  onLogout: () => void;
  onItemClick?: () => void;
  showLogo?: boolean;
}) {
  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col justify-between">
      {/* Brand Logo (when enabled) */}
      {showLogo && (
        <div className="flex items-center gap-3 px-3 py-2 shrink-0 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flash-orange text-clean-white shadow-md shadow-orange-500/20">
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
            <span className="font-heading text-lg font-extrabold text-tech-slate tracking-tight">
              Quick<span className="text-flash-orange">Fix</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Admin Portal
            </span>
          </div>
        </div>
      )}

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 -mr-1 space-y-6 [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.200)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300">
        <nav className="space-y-6 px-1 py-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isLinkActive(item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                        active
                          ? "bg-tech-slate text-clean-white shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-tech-slate"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            active
                              ? "text-flash-orange"
                              : "text-zinc-400 group-hover:text-tech-slate"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {active && (
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer / User Profile */}
      <div className="shrink-0 border-t border-zinc-200 pt-3.5 space-y-2.5 px-1 mt-auto">
        <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/80">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tech-slate text-clean-white text-xs font-bold uppercase">
            {user?.name?.[0] || user?.email?.[0] || "A"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-tech-slate truncate">
              {user?.name || "Administrator"}
            </span>
            <span className="text-[10px] text-zinc-500 truncate">
              {user?.email || "admin@quickfixmobile.in"}
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-zinc-600 hover:text-tech-slate hover:bg-zinc-50 transition-all shadow-2xs"
        >
          <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          <span>View Public Site</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
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
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      await clientSignOut();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row w-full max-w-full overflow-x-clip">
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-zinc-200 bg-clean-white p-4 h-full max-h-screen">
        <SidebarNavigation
          pathname={pathname}
          user={user}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Slide-over Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-clean-white p-5 shadow-2xl transition-all duration-300 ease-in-out md:hidden flex flex-col justify-between h-full max-h-screen ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flash-orange text-clean-white font-bold">
              Q
            </div>
            <span className="font-heading font-extrabold text-tech-slate">
              Quick<span className="text-flash-orange">Fix</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <SidebarNavigation
            pathname={pathname}
            user={user}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onItemClick={() => setIsMobileMenuOpen(false)}
            showLogo={false}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:pl-64">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 flex h-16 w-full max-w-full items-center justify-between border-b border-zinc-200 bg-clean-white/90 backdrop-blur-md px-3 sm:px-6 md:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Title / Breadcrumb */}
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-sm sm:text-base md:text-lg font-bold text-tech-slate truncate">
                {title || "Admin Dashboard"}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-zinc-500 hidden sm:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Top Bar Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {actions}

            <Link
              href="/"
              target="_blank"
              title="View Public Site"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-flash-orange hover:border-flash-orange/40 transition-colors shadow-2xs shrink-0"
            >
              <span className="hidden md:inline">View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {user && (
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-tech-slate border border-zinc-200/80 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[140px] truncate">
                  Welcome, {user.name || user.email.split("@")[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
