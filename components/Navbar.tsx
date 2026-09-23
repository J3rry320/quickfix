"use client";

import contactConfig from "@/config/contact";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Smartphone,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface ServiceNav {
  name: string;
  href: string;
  startingPrice: string;
}

interface BrandNav {
  name: string;
  href: string;
  tag: string;
}

const TOP_SERVICES: ServiceNav[] = [
  {
    name: "Screen Replacement",
    href: "/services/screen-replacement",
    startingPrice: "₹1,499",
  },
  {
    name: "Battery Replacement",
    href: "/services/battery-replacement",
    startingPrice: "₹999",
  },
  {
    name: "Charging Port Repair",
    href: "/services/charging-port",
    startingPrice: "₹699",
  },
  {
    name: "Camera Module Repair",
    href: "/services/front-rear-camera",
    startingPrice: "₹899",
  },
  {
    name: "Motherboard Diagnostic",
    href: "/services/motherboard-chip-level",
    startingPrice: "₹1,999",
  },
];

const TOP_BRANDS: BrandNav[] = [
  { name: "Apple iPhone", href: "/brands/apple", tag: "OEM Screens" },
  { name: "Samsung Galaxy", href: "/brands/samsung", tag: "AMOLED" },
  { name: "OnePlus", href: "/brands/oneplus", tag: "Fast Charge" },
  { name: "Xiaomi / Redmi", href: "/brands/xiaomi", tag: "Express" },
  { name: "Google Pixel", href: "/brands/google-pixel", tag: "Original" },
];

const COMPANY_LINKS = [
  {
    key: "about",
    href: "/about",
    icon: Building2,
  },
  {
    key: "contact",
    href: "/contact",
    icon: MessageSquare,
  },
  {
    key: "locations",
    href: "/locations",
    icon: MapPin,
  },
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

  // Close menu and dropdown on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-clean-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Pune Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.png"
              alt="QuickFixMobile.in Logo"
              width={34}
              height={34}
              priority
              className="h-8 w-8 object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline">
              <span className="font-heading text-lg font-extrabold tracking-tight text-tech-slate">
                QuickFix<span className="text-flash-orange">Mobile</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-semibold text-text-secondary"
        >
          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("services")}
              onMouseEnter={() => setOpenDropdown("services")}
              className={`flex items-center gap-1 py-2 hover:text-flash-orange transition-colors whitespace-nowrap cursor-pointer ${
                pathname.startsWith("/services")
                  ? "text-flash-orange font-bold"
                  : ""
              }`}
              aria-expanded={openDropdown === "services"}
            >
              <span>{t("nav.services")}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "services" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 top-full mt-1 w-64 rounded-2xl bg-clean-white border border-border-default p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {t("nav.services")}
                </div>
                {TOP_SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={closeMenus}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-mist-gray text-xs font-bold text-tech-slate transition-colors"
                  >
                    <span>{s.name}</span>
                    <span className="text-[11px] text-text-muted font-medium">
                      {s.startingPrice}
                    </span>
                  </Link>
                ))}
                <div className="pt-1.5 mt-1.5 border-t border-border-default/60">
                  <Link
                    href="/services"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-bold text-flash-orange hover:bg-flash-orange/10 transition-colors"
                  >
                    <span>{t("nav.viewAllServices")}</span>
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
                pathname.startsWith("/brands")
                  ? "text-flash-orange font-bold"
                  : ""
              }`}
              aria-expanded={openDropdown === "brands"}
            >
              <span>{t("nav.brands")}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "brands" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "brands" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 top-full mt-1 w-56 rounded-2xl bg-clean-white border border-border-default p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {t("nav.brands")}
                </div>
                {TOP_BRANDS.map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    onClick={closeMenus}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-mist-gray text-xs font-bold text-tech-slate transition-colors"
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] bg-mist-gray px-1.5 py-0.5 rounded text-text-muted font-semibold">
                      {b.tag}
                    </span>
                  </Link>
                ))}
                <div className="pt-1.5 mt-1.5 border-t border-border-default/60">
                  <Link
                    href="/brands"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-bold text-flash-orange hover:bg-flash-orange/10 transition-colors"
                  >
                    <span>{t("nav.viewAllBrands")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <Link
            href="/reviews"
            onClick={closeMenus}
            className={`hover:text-flash-orange transition-colors whitespace-nowrap ${
              pathname.startsWith("/reviews")
                ? "text-flash-orange font-bold"
                : ""
            }`}
          >
            {t("nav.reviews")}
          </Link>

          {/* Blogs & Guides */}
          <Link
            href="/blogs"
            onClick={closeMenus}
            className={`hover:text-flash-orange transition-colors whitespace-nowrap ${
              pathname.startsWith("/blogs") ? "text-flash-orange font-bold" : ""
            }`}
          >
            {t("nav.blogs")}
          </Link>

          {/* Track Repair Utility Link */}
          <Link
            href="/track"
            onClick={closeMenus}
            className={`inline-flex items-center gap-1 hover:text-flash-orange transition-colors whitespace-nowrap ${
              pathname.startsWith("/track") ? "text-flash-orange font-bold" : ""
            }`}
          >
            <Search className="h-3.5 w-3.5 text-flash-orange shrink-0" />
            <span>{t("nav.track")}</span>
          </Link>

          {/* Company / More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("company")}
              onMouseEnter={() => setOpenDropdown("company")}
              className={`flex items-center gap-1 py-2 hover:text-flash-orange transition-colors whitespace-nowrap cursor-pointer ${
                ["/about", "/contact", "/locations"].some((p) =>
                  pathname.startsWith(p),
                )
                  ? "text-flash-orange font-bold"
                  : ""
              }`}
              aria-expanded={openDropdown === "company"}
            >
              <span>{t("nav.company")}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === "company" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "company" && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute right-0 top-full mt-1 w-64 rounded-2xl bg-clean-white border border-border-default p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
              >
                {COMPANY_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-mist-gray transition-colors group"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-gray text-text-secondary group-hover:bg-flash-orange/10 group-hover:text-flash-orange transition-colors shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                          {t(`company.${item.key}Title`)}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 leading-snug">
                          {t(`company.${item.key}Desc`)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Desktop Action Controls */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher />

          {/* Direct Phone Helpline */}
          <a
            href={`tel:${contactConfig.phone.value}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate hover:bg-mist-gray hover:border-border-default transition-colors whitespace-nowrap shrink-0"
            title="Call QuickFix Pune Helpline"
          >
            <Phone className="h-3.5 w-3.5 text-flash-orange shrink-0" />
            <span className="hidden xl:inline">
              {contactConfig.phone.display}
            </span>
            <span className="xl:hidden">{t("actions.callNow")}</span>
          </a>

          {/* Booking CTA Button */}
          <Link
            href="/book-repair"
            className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-4 py-2 text-xs font-extrabold text-clean-white shadow-xs hover:bg-flash-orange-hover active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            {t("actions.bookRepair")}
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
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-tech-slate" />
            ) : (
              <Menu className="h-5 w-5 text-tech-slate" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border-default bg-clean-white px-4 py-5 lg:hidden space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* Top Quick Actions */}
          <div className="space-y-2">
            <Link
              href="/book-repair"
              onClick={closeMenus}
              className="flex items-center justify-center gap-2 rounded-xl bg-flash-orange py-3 px-4 text-xs font-bold text-clean-white shadow-xs hover:bg-flash-orange-hover transition-colors w-full"
            >
              <span>{t("actions.bookRepair")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/track"
                onClick={closeMenus}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-mist-gray border border-border-default text-xs font-bold text-tech-slate hover:bg-border-default/60 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-flash-orange" />
                <span>{t("nav.track")}</span>
              </Link>
              <a
                href={`tel:${contactConfig.phone.value}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-mist-gray border border-border-default text-xs font-bold text-tech-slate hover:bg-border-default/60 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-flash-orange" />
                <span>{t("actions.callDesk")}</span>
              </a>
            </div>
          </div>

          {/* Section 1: Customer Resources */}
          <div className="pt-3 border-t border-border-default">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
              {t("explore.title")}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/reviews"
                onClick={closeMenus}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
              >
                <Star className="h-4 w-4 text-electric-amber shrink-0" />
                <span>{t("explore.reviews")}</span>
              </Link>
              <Link
                href="/blogs"
                onClick={closeMenus}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
              >
                <BookOpen className="h-4 w-4 text-flash-orange shrink-0" />
                <span>{t("explore.blogs")}</span>
              </Link>
              <Link
                href="/locations"
                onClick={closeMenus}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
              >
                <MapPin className="h-4 w-4 text-success shrink-0" />
                <span>{t("explore.locations")}</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Services */}
          <div className="pt-3 border-t border-border-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t("nav.services")}
              </span>
              <Link
                href="/services"
                onClick={closeMenus}
                className="text-[11px] font-bold text-flash-orange hover:underline"
              >
                {t("nav.viewAllServices")} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {TOP_SERVICES.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={closeMenus}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:bg-mist-gray transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="h-3 w-3 text-text-muted" />
                    <span>{s.name}</span>
                  </span>
                  <span className="text-[11px] text-text-muted font-normal">
                    {s.startingPrice}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Brands */}
          <div className="pt-3 border-t border-border-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t("nav.brands")}
              </span>
              <Link
                href="/brands"
                onClick={closeMenus}
                className="text-[11px] font-bold text-flash-orange hover:underline"
              >
                {t("nav.viewAllBrands")} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TOP_BRANDS.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  onClick={closeMenus}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:bg-mist-gray transition-colors"
                >
                  <Smartphone className="h-3 w-3 text-text-muted shrink-0" />
                  <span className="truncate">{b.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: Company Links */}
          <div className="pt-3 border-t border-border-default">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
              {t("nav.company")}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/about"
                onClick={closeMenus}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
              >
                <Building2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>{t("nav.about")}</span>
              </Link>
              <Link
                href="/contact"
                onClick={closeMenus}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-tech-slate hover:bg-mist-gray transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>{t("nav.contact")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
