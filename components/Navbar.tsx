"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import contactConfig from "@/config/contact";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-clean-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & City Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flash-orange text-clean-white shadow-xs group-hover:scale-105 transition-transform">
              {/* Lightning / Mobile repair icon */}
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
              <span className="font-heading text-lg font-extrabold tracking-tight text-tech-slate">
                Quick<span className="text-flash-orange">Fix</span>
                <span className="text-xs font-semibold text-zinc-500">.in</span>
              </span>
            </div>
          </Link>

          {/* Pune City Pill */}
          <span className="hidden sm:inline-flex items-center rounded-full bg-mist-gray px-2.5 py-0.5 text-xs font-semibold text-tech-slate border border-zinc-200">
            {t("city")}
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
          <a
            href="#services"
            className="hover:text-flash-orange transition-colors"
          >
            {t("nav.services")}
          </a>
          <a
            href="#why-us"
            className="hover:text-flash-orange transition-colors"
          >
            {t("nav.whyUs")}
          </a>
          <a
            href="#pune-locations"
            className="hover:text-flash-orange transition-colors"
          >
            {t("nav.puneLocations")}
          </a>
          <a
            href="#pricing"
            className="hover:text-flash-orange transition-colors"
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#contact"
            className="hover:text-flash-orange transition-colors"
          >
            {t("nav.contact")}
          </a>
        </nav>

        {/* Desktop Right Controls (Language Switcher + CTA) */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <a
            href={`tel:${contactConfig.phone.value}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-3 py-1.5 text-xs font-semibold text-tech-slate hover:bg-mist-gray transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-flash-orange"
            >
              <path
                fillRule="evenodd"
                d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{contactConfig.phone.display}</span>
          </a>

          <Link
            href="/book-repair"
            className="inline-flex items-center justify-center rounded-lg bg-flash-orange px-4 py-2 text-xs font-bold text-clean-white shadow-xs hover:bg-[#e64a19] active:scale-95 transition-all"
          >
            {t("actions.bookRepair")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-tech-slate hover:bg-mist-gray focus:outline-none"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-clean-white px-4 py-4 md:hidden space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-zinc-700">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-mist-gray"
            >
              {t("nav.services")}
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-mist-gray"
            >
              {t("nav.whyUs")}
            </a>
            <a
              href="#pune-locations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-mist-gray"
            >
              {t("nav.puneLocations")}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-mist-gray"
            >
              {t("nav.pricing")}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-mist-gray"
            >
              {t("nav.contact")}
            </a>
          </nav>

          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <a
              href={`tel:${contactConfig.phone.value}`}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2.5 text-sm font-semibold text-tech-slate"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>{contactConfig.phone.display}</span>
            </a>

            <Link
              href="/book-repair"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center rounded-lg bg-flash-orange py-2.5 text-sm font-bold text-clean-white shadow-xs"
            >
              {t("actions.bookRepair")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
