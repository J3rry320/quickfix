"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RotateCcw,
  PhoneCall,
  MessageCircle,
  Mail,
  Home,
  AlertTriangle,
  Copy,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log unexpected runtime error
    console.error("Marketing Layout Error:", error);
  }, [error]);

  const handleCopyDigest = () => {
    if (error.digest) {
      navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello QuickFix Support, I encountered a technical issue on QuickFixMobile.in${
      error.digest ? ` (Error code: ${error.digest})` : ""
    }. Could you please assist me with mobile repair service in Pune?`
  );

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-radial from-mist-gray/60 via-clean-white to-clean-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-flash-orange/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-2xl w-full text-center">
        {/* Logo & Error Visual */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group mb-5">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-error to-flash-orange rounded-3xl blur-sm opacity-35 transition duration-300" />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-clean-white border border-border-default shadow-lg p-3">
              <Image
                src="/logo.png"
                alt="QuickFixMobile.in Logo"
                width={84}
                height={84}
                priority
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-error text-clean-white shadow-md">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-error-border bg-error-light text-error-text font-bold text-xs uppercase tracking-wider mb-4 shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5 text-error" />
            <span>{t("badge")}</span>
          </div>

          {/* Headings */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-tech-slate tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>

          {/* Digest code display if available */}
          {error.digest && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-clean-white/90 text-xs text-text-muted shadow-2xs font-mono">
              <span className="font-semibold text-text-secondary">{t("referenceCode")}:</span>
              <span>{error.digest}</span>
              <button
                type="button"
                onClick={handleCopyDigest}
                aria-label="Copy error reference code"
                className="p-1 hover:text-tech-slate transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-semibold text-sm shadow-md shadow-flash-orange/25 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("retry")}</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tech-slate hover:bg-tech-slate-hover text-clean-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-clean-white" />
            <span>{t("backHome")}</span>
          </Link>
        </div>

        {/* Contact Support Section */}
        <div className="rounded-2xl border border-border-default bg-clean-white/80 backdrop-blur-xs p-5 sm:p-6 text-left shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-flash-orange" />
              {t("contactSupport")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WhatsApp Support Button */}
            <a
              href={`https://wa.me/918308686454?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-whatsapp/30 bg-whatsapp/5 hover:bg-whatsapp/10 hover:border-whatsapp/50 text-tech-slate transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-whatsapp/20 flex items-center justify-center text-whatsapp shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-whatsapp/20" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-tech-slate group-hover:text-whatsapp transition-colors truncate">
                  {t("whatsappSupport")}
                </span>
                <span className="block text-2xs text-text-muted">Instant Chat</span>
              </div>
            </a>

            {/* Direct Phone Call Button */}
            <a
              href="tel:+918308686454"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-flash-orange/30 bg-flash-orange/5 hover:bg-flash-orange/10 hover:border-flash-orange/50 text-tech-slate transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-flash-orange/20 flex items-center justify-center text-flash-orange shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-tech-slate group-hover:text-flash-orange transition-colors truncate">
                  {t("callHelpline")}
                </span>
                <span className="block text-2xs text-text-muted">+91 83086 86454</span>
              </div>
            </a>

            {/* Contact Page Link */}
            <Link
              href="/contact"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border-default bg-mist-gray/40 hover:bg-clean-white hover:border-border-strong text-tech-slate transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-clean-white border border-border-subtle flex items-center justify-center text-tech-slate shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-tech-slate group-hover:text-flash-orange transition-colors truncate">
                  {t("contactSupport")}
                </span>
                <span className="block text-2xs text-text-muted">Sadashiv Peth Lab</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
