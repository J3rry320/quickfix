"use client";

import Image from "next/image";
import { useEffect } from "react";
import { RotateCcw, PhoneCall, MessageCircle, Home, AlertTriangle } from "lucide-react";
import "@/app/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global System Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-base-surface text-dark-neutral font-body flex flex-col items-center justify-center p-4 sm:p-6 bg-radial from-mist-gray/60 via-clean-white to-clean-white">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error/5 rounded-full blur-3xl pointer-events-none" />

        <main className="relative max-w-lg w-full text-center">
          {/* Logo & Error Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-5">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-error to-flash-orange rounded-3xl blur-sm opacity-35" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-clean-white border border-border-default shadow-lg p-3">
                <Image
                  src="/logo.png"
                  alt="QuickFixMobile.in Logo"
                  width={80}
                  height={80}
                  priority
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-error text-clean-white shadow-md">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-tech-slate tracking-tight mb-2">
              System Recovery • QuickFixMobile
            </h1>
            <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed mb-4">
              An unexpected system error occurred. You can retry refreshing the application or contact our Pune doorstep repair helpline directly.
            </p>

            {error.digest && (
              <p className="text-xs font-mono text-text-muted mb-4 bg-clean-white border border-border-default px-3 py-1 rounded-md">
                Ref Code: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <a
              href="/en"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-tech-slate hover:bg-tech-slate-hover text-clean-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4 text-clean-white" />
              <span>Return Home</span>
            </a>
            <a
              href="https://wa.me/918308686454?text=Hi%20QuickFix%20support%2C%20I%20encountered%20an%20error%20on%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-whatsapp/30 bg-whatsapp/10 hover:bg-whatsapp/15 text-tech-slate font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-whatsapp" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+918308686454"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border-default bg-clean-white hover:bg-mist-gray text-tech-slate font-semibold text-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-flash-orange" />
              <span>+91 83086 86454</span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
