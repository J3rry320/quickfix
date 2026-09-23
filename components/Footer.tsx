"use client";

import { useState, useEffect } from "react";
import contactConfig from "@/config/contact";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Clock,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("Footer");
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-tech-slate text-clean-white pt-12 sm:pt-16 pb-24 md:pb-12 border-t border-border-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border-dark">
          {/* Brand Col */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="QuickFixMobile.in Logo"
                width={42}
                height={42}
                className="h-10 w-10 object-contain rounded-xl"
              />
              <span className="font-heading text-xl font-black text-clean-white tracking-tight">
                QuickFix<span className="text-flash-orange">Mobile</span>
                <span className="text-clean-white/60 text-sm font-semibold">.in</span>
              </span>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-clean-white/75 font-body leading-relaxed max-w-sm">
              {t("brandDesc")}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-electric-amber">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Pune Express Doorstep Coverage</span>
            </div>

            {/* Social Media Links from contactConfig */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-clean-white/70 mb-2">
                Follow & Connect
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={contactConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-dark bg-tech-slate-dark text-clean-white/80 hover:bg-flash-orange hover:text-clean-white hover:border-flash-orange transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-dark bg-tech-slate-dark text-clean-white/80 hover:bg-flash-orange hover:text-clean-white hover:border-flash-orange transition-colors"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Company & Static Links Col */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-clean-white/75 font-medium">
              <li>
                <Link
                  href="/about"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/book-repair"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("bookDoorstep")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("allServices")}
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("allBrands")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="hover:text-flash-orange transition-colors"
                >
                  Blogs & Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-flash-orange transition-colors"
                >
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-flash-orange transition-colors"
                >
                  Track Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Repairs Directory Col */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("services")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-clean-white/75 font-medium">
              <li>
                <Link
                  href="/services/screen-replacement"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("screenRepair")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/battery-replacement"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("batteryReplacement")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/charging-port"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("chargingPort")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/front-rear-camera"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("cameraRepair")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/motherboard-chip-level"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("motherboardRepair")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/water-damage-rescue"
                  className="hover:text-flash-orange transition-colors"
                >
                  {t("waterDamage")}
                </Link>
              </li>
              <li className="pt-2 border-t border-border-dark/80">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 font-bold text-flash-orange hover:text-clean-white transition-colors"
                >
                  <span>{t("viewAllServices")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands Directory Col */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("brands")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-clean-white/75 font-medium">
              <li>
                <Link
                  href="/brands/apple"
                  className="hover:text-flash-orange transition-colors"
                >
                  Apple iPhone
                </Link>
              </li>
              <li>
                <Link
                  href="/brands/samsung"
                  className="hover:text-flash-orange transition-colors"
                >
                  Samsung Galaxy
                </Link>
              </li>
              <li>
                <Link
                  href="/brands/oneplus"
                  className="hover:text-flash-orange transition-colors"
                >
                  OnePlus
                </Link>
              </li>
              <li>
                <Link
                  href="/brands/xiaomi"
                  className="hover:text-flash-orange transition-colors"
                >
                  Xiaomi / Redmi
                </Link>
              </li>
              <li>
                <Link
                  href="/brands/google-pixel"
                  className="hover:text-flash-orange transition-colors"
                >
                  Google Pixel
                </Link>
              </li>
              <li className="pt-2 border-t border-border-dark/80">
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-1.5 font-bold text-flash-orange hover:text-clean-white transition-colors"
                >
                  <span>{t("viewAllBrands")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Pune Contact & Hotline */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("contactInfo")}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-clean-white/80">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-flash-orange shrink-0" />
                <a
                  href={`tel:${contactConfig.phone.value}`}
                  className="font-bold text-clean-white hover:text-flash-orange transition-colors"
                >
                  {contactConfig.phone.display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-flash-orange shrink-0" />
                <a
                  href={contactConfig.whatsapp.getDefaultUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-clean-white hover:text-flash-orange transition-colors"
                >
                  WhatsApp Quick Support
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-flash-orange shrink-0" />
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="font-bold text-clean-white hover:text-flash-orange transition-colors"
                >
                  {contactConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-flash-orange shrink-0 mt-0.5" />
                <span className="text-clean-white/80">{contactConfig.hours.display}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-flash-orange shrink-0 mt-0.5" />
                <span className="text-clean-white/75 text-xs leading-relaxed">
                  {contactConfig.address.full}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-clean-white/75 text-xs">
                  {contactConfig.serviceAreas.doorstepSla}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Privacy Links paired together on left, Credit on right */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-clean-white/70 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>{t("copyright", { year: currentYear })}</p>
            <span className="hidden sm:inline text-clean-white/30">•</span>
            <div className="flex items-center gap-3 text-xs font-medium">
              <Link
                href="/privacy"
                className="text-clean-white/75 hover:text-clean-white hover:underline transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
              <span className="text-clean-white/30">•</span>
              <Link
                href="/terms"
                className="text-clean-white/75 hover:text-clean-white hover:underline transition-colors"
              >
                {t("termsOfService")}
              </Link>
            </div>
          </div>

          {/* Multilingual Developer Credit with clean brand link */}
          <p className="flex items-center justify-center gap-1 text-clean-white/70">
            {t.rich("designedAndDeveloped", {
              heart: () => (
                <span
                  className="inline-flex items-center text-rose-400 mx-0.5 align-middle"
                  title="love"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-400 shrink-0 inline" />
                  <span className="sr-only">&lt;3</span>
                </span>
              ),
              author: (chunks) => (
                <a
                  href="https://codemedialabs.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-clean-white hover:text-flash-orange hover:underline transition-colors ml-0.5"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        {/* Safe Area Spacer: Ensures content is never obscured by the fixed WhatsApp FAB button */}
        <div
          className="h-16 md:h-20 w-full pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </footer>
  );
}
