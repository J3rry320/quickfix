"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Home,
  Wrench,
  PhoneCall,
  Smartphone,
  BatteryCharging,
  Search,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-radial from-mist-gray/60 via-clean-white to-clean-white">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-flash-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-electric-amber/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-2xl w-full text-center">
        {/* Logo & 404 Hero Visual */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group mb-5">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-flash-orange to-electric-amber rounded-3xl blur-sm opacity-30 group-hover:opacity-60 transition duration-300" />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-clean-white border border-border-default shadow-lg p-3">
              <Image
                src="/logo.png"
                alt="QuickFixMobile.in Logo"
                width={84}
                height={84}
                priority
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-flash-orange/20 bg-flash-orange-subtle text-flash-orange-text font-bold text-xs uppercase tracking-wider mb-4 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-flash-orange" />
            <span>{t("badge")}</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-tech-slate tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tech-slate hover:bg-tech-slate-hover text-clean-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-clean-white" />
            <span>{t("backHome")}</span>
          </Link>
          <Link
            href="/book-repair"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-semibold text-sm shadow-md shadow-flash-orange/25 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Wrench className="w-4 h-4" />
            <span>{t("bookRepair")}</span>
          </Link>
          <a
            href="tel:+918308686454"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-default bg-clean-white hover:bg-mist-gray text-tech-slate font-semibold text-sm shadow-2xs hover:border-border-strong transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 text-flash-orange" />
            <span>{t("callSupport")}</span>
          </a>
        </div>

        {/* Quick Links Directory */}
        <div className="rounded-2xl border border-border-default bg-clean-white/80 backdrop-blur-xs p-5 sm:p-6 text-left shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-flash-orange" />
              {t("quickLinksTitle")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/services/screen-replacement"
              className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-border-default hover:shadow-2xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-flash-orange shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-tech-slate group-hover:text-flash-orange transition-colors">
                  {t("links.screenRepair")}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-disabled group-hover:text-flash-orange group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/services/battery-replacement"
              className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-border-default hover:shadow-2xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="w-4 h-4 text-electric-amber shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-tech-slate group-hover:text-flash-orange transition-colors">
                  {t("links.batteryRepair")}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-disabled group-hover:text-flash-orange group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/track"
              className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-border-default hover:shadow-2xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-info shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-tech-slate group-hover:text-flash-orange transition-colors">
                  {t("links.trackRepair")}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-disabled group-hover:text-flash-orange group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-border-default hover:shadow-2xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-success shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-tech-slate group-hover:text-flash-orange transition-colors">
                  {t("links.contactUs")}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-disabled group-hover:text-flash-orange group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Urgent Pune helpline strip */}
          <div className="mt-4 pt-3.5 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-secondary">
            <span>{t("urgentHelp")}</span>
            <a
              href="tel:+918308686454"
              className="font-bold text-flash-orange hover:text-flash-orange-hover flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{t("phone")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
