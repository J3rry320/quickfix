"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import contactConfig from "@/config/contact";
import LanguageSwitcher from "./LanguageSwitcher";

const TOP_SERVICES = [
  { name: "Screen Replacement", href: "/services/screen-replacement", startingPrice: "₹1,499" },
  { name: "Battery Replacement", href: "/services/battery-replacement", startingPrice: "₹999" },
  { name: "Charging Port Repair", href: "/services/charging-port", startingPrice: "₹699" },
  { name: "Camera Module Repair", href: "/services/front-rear-camera", startingPrice: "₹899" },
  { name: "Motherboard Diagnostic", href: "/services/motherboard-chip-level", startingPrice: "₹1,999" },
];

const TOP_BRANDS = [
  { name: "Apple iPhone", href: "/brands/apple", tag: "OEM Screens" },
  { name: "Samsung Galaxy", href: "/brands/samsung", tag: "AMOLED" },
  { name: "OnePlus", href: "/brands/oneplus", tag: "Fast Charge" },
  { name: "Xiaomi / Redmi", href: "/brands/xiaomi", tag: "Express" },
  { name: "Google Pixel", href: "/brands/google-pixel", tag: "Original" },
];

const TOP_LOCATIONS = [
  { name: "Kothrud", href: "/locations/kothrud", time: "25 Mins" },
  { name: "Hinjawadi", href: "/locations/hinjawadi", time: "35 Mins" },
  { name: "Baner", href: "/locations/baner", time: "30 Mins" },
  { name: "Viman Nagar", href: "/locations/viman-nagar", time: "30 Mins" },
  { name: "Wakad", href: "/locations/wakad", time: "30 Mins" },
];

export default function Navbar() {
  const t = useTranslations("Common");
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust dropdown and drawer state when route changes (React-recommended pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/90 bg-clean-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Pune Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.png"
              alt="QuickFix.in Logo"
              width={34}
              height={34}
              className="h-8.5 w-8.5 object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline">
              <span className="font-heading text-lg font-extrabold tracking-tight text-tech-slate">
                Quick<span className="text-flash-orange">Fix</span>
                <span className="text-xs font-semibold text-zinc-400">.in</span>
              </span>
            </div>
          </Link>

          {/* Pune City Pill (visible on xl screens to keep navbar spacious) */}
          <span className="hidden xl:inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-600 border border-zinc-200/80 whitespace-nowrap">
            {t("city")}
          </span>
        </div>

        {/* Center: Desktop Clean Nav Links (lg+ only, strictly whitespace-nowrap) */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-semibold text-zinc-600"
        >
          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("services")}
              onMouseEnter={() => setOpenDropdown("services")}
              className={`flex items-center gap-1 py-2 hover:text-flash-orange transition-colors whitespace-nowrap cursor-pointer ${
                pathname.startsWith("/services") ? "text-flash-orange font-bold" : ""
              }`}
              aria-expanded={openDropdown === "services"}
            >
              <span>Services</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "services" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 top-full mt-1 w-64 rounded-2xl bg-clean-white border border-zinc-200 p-2 shadow-xl animate-in fade-in-50 zoom-in-95 z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Doorstep Repairs
                </div>
                {TOP_SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-mist-gray text-xs font-bold text-tech-slate transition-colors"
                  >
                    <span>{s.name}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">{s.startingPrice}</span>
                  </Link>
                ))}
                <div className="pt-1.5 mt-1.5 border-t border-zinc-100">
                  <Link
                    href="/book-repair"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-bold text-flash-orange hover:bg-flash-orange/10 transition-colors"
                  >
                    <span>View All Services</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Brands Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("brands")}
              onMouseEnter={() => setOpenDropdown("brands")}
              className={`flex items-center gap-1 py-2 hover:text-flash-orange transition-colors whitespace-nowrap cursor-pointer ${
                pathname.startsWith("/brands") ? "text-flash-orange font-bold" : ""
              }`}
              aria-expanded={openDropdown === "brands"}
            >
              <span>Brands</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "brands" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "brands" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 top-full mt-1 w-56 rounded-2xl bg-clean-white border border-zinc-200 p-2 shadow-xl animate-in fade-in-50 zoom-in-95 z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Supported Brands
                </div>
                {TOP_BRANDS.map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-mist-gray text-xs font-bold text-tech-slate transition-colors"
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] bg-mist-gray px-1.5 py-0.5 rounded text-zinc-500 font-semibold">
                      {b.tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* Pune Locations Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("locations")}
              onMouseEnter={() => setOpenDropdown("locations")}
              className={`flex items-center gap-1 py-2 hover:text-flash-orange transition-colors whitespace-nowrap cursor-pointer ${
                pathname.startsWith("/locations") ? "text-flash-orange font-bold" : ""
              }`}
              aria-expanded={openDropdown === "locations"}
            >
              <span>Pune Areas</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "locations" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "locations" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 top-full mt-1 w-56 rounded-2xl bg-clean-white border border-zinc-200 p-2 shadow-xl animate-in fade-in-50 zoom-in-95 z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Coverage Hubs
                </div>
                {TOP_LOCATIONS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-mist-gray text-xs font-bold text-tech-slate transition-colors"
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">⚡ {l.time}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About Us Link */}
          <Link
            href="/about"
            className={`hover:text-flash-orange transition-colors whitespace-nowrap ${
              pathname === "/about" ? "text-flash-orange font-bold" : ""
            }`}
          >
            {t("nav.about")}
          </Link>

          {/* Contact Page Link */}
          <Link
            href="/contact"
            className={`hover:text-flash-orange transition-colors whitespace-nowrap ${
              pathname === "/contact" ? "text-flash-orange font-bold" : ""
            }`}
          >
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Right: Desktop Action Controls (Compact Lang + Helpline + Clean CTA) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher />

          {/* Direct Phone Helpline (Single-line guaranteed) */}
          <a
            href={`tel:${contactConfig.phone.value}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate hover:bg-mist-gray hover:border-zinc-300 transition-colors whitespace-nowrap shrink-0"
            title="Call QuickFix Pune Helpline"
          >
            <Phone className="h-3.5 w-3.5 text-flash-orange shrink-0" />
            <span className="hidden xl:inline">{contactConfig.phone.display}</span>
            <span className="xl:hidden">Call Helpline</span>
          </a>

          {/* Short, Punchy CTA Button (Single line, never wraps) */}
          {/* Short, Punchy CTA Button (Single line, never wraps) */}
          <Link
            href="/book-repair"
            className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-4 py-2 text-xs font-extrabold text-clean-white shadow-xs hover:bg-flash-orange-hover active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            Book Repair & Estimate
          </Link>
        </div>

        {/* Mobile / Tablet Controls (<lg screens) */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />

          <a
            href={`tel:${contactConfig.phone.value}`}
            className="inline-flex items-center justify-center rounded-xl border border-border-default p-2 text-tech-slate hover:bg-mist-gray"
            aria-label="Call Helpline"
          >
            <Phone className="h-4 w-4 text-flash-orange" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-tech-slate hover:bg-mist-gray focus:outline-none cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer (<lg screens) */}
      {mobileMenuOpen && (
        <div className="border-b border-border-default bg-clean-white px-4 py-5 lg:hidden space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2">
          {/* Quick Action Top Bar */}
          <Link
            href="/book-repair"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-flash-orange py-3 px-4 text-xs font-bold text-clean-white shadow-xs hover:bg-flash-orange-hover transition-colors w-full"
          >
            <span>Book Doorstep Repair (Free Instant Quote)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Services Section */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Popular Repairs
            </span>
            <div className="grid grid-cols-1 gap-1">
              {TOP_SERVICES.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-mist-gray"
                >
                  <span>{s.name}</span>
                  <span className="text-[11px] text-zinc-400 font-normal">{s.startingPrice}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Brands Section */}
          <div className="pt-3 border-t border-zinc-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Top Brands
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {TOP_BRANDS.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-mist-gray"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Pune Locations Section */}
          <div className="pt-3 border-t border-zinc-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Pune Coverage Zones
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {TOP_LOCATIONS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-mist-gray"
                >
                  📍 {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Static Pages Links */}
          <div className="pt-3 border-t border-zinc-100 flex flex-col space-y-1">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray"
            >
              About Us (Sadashiv Peth Origin)
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray"
            >
              Contact Us & Helpline
            </Link>
            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray"
            >
              90-Day Warranty & Terms
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray"
            >
              Privacy Policy & Data Guarantee
            </Link>
          </div>

          {/* Direct Phone Assistance */}
          <div className="pt-3 border-t border-zinc-100">
            <a
              href={`tel:${contactConfig.phone.value}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>Call Helpline: {contactConfig.phone.display}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
