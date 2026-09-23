import Image from "next/image";
import Link from "next/link";
import { Home, PhoneCall, MessageCircle, Globe, Search } from "lucide-react";
import "@/app/globals.css";

export const metadata = {
  title: "404 - Page Not Found | QuickFixMobile Pune",
  description: "The page you are looking for does not exist. Connect with QuickFixMobile Pune for doorstep mobile repairs.",
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-base-surface text-dark-neutral font-body flex flex-col items-center justify-center p-4 sm:p-6 bg-radial from-mist-gray/60 via-clean-white to-clean-white">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-flash-orange/5 rounded-full blur-3xl pointer-events-none" />

        <main className="relative max-w-xl w-full text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-5">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-flash-orange to-electric-amber rounded-3xl blur-sm opacity-35" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-clean-white border border-border-default shadow-lg p-3">
                <Image
                  src="/logo.png"
                  alt="QuickFixMobile.in Logo"
                  width={80}
                  height={80}
                  priority
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-flash-orange/20 bg-flash-orange-subtle text-flash-orange-text font-bold text-xs uppercase tracking-wider mb-4 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-flash-orange" />
              <span>404 • Page Not Found</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-tech-slate tracking-tight mb-3">
              QuickFix<span className="text-flash-orange">Mobile</span> Pune
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find the page you were looking for. Please choose your preferred language or return to the homepage.
            </p>
          </div>

          {/* Language Selection */}
          <div className="rounded-2xl border border-border-default bg-clean-white p-4 mb-6 shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              <Globe className="w-3.5 h-3.5 text-flash-orange" />
              <span>Select Language / भाषा निवडा / भाषा चुनें</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/en"
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-flash-orange hover:shadow-2xs transition-all font-semibold text-xs text-tech-slate"
              >
                <span>English</span>
                <span className="text-2xs text-text-muted font-normal">EN</span>
              </Link>
              <Link
                href="/hi"
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-flash-orange hover:shadow-2xs transition-all font-semibold text-xs text-tech-slate"
              >
                <span>हिन्दी</span>
                <span className="text-2xs text-text-muted font-normal">HI</span>
              </Link>
              <Link
                href="/mr"
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-border-subtle bg-mist-gray/40 hover:bg-clean-white hover:border-flash-orange hover:shadow-2xs transition-all font-semibold text-xs text-tech-slate"
              >
                <span>मराठी</span>
                <span className="text-2xs text-text-muted font-normal">MR</span>
              </Link>
            </div>
          </div>

          {/* Navigation and Support Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/en"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-tech-slate hover:bg-tech-slate-hover text-clean-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4 text-clean-white" />
              <span>Return Home</span>
            </Link>
            <a
              href="https://wa.me/918308686454?text=Hi%20QuickFix%20team%2C%20I%20need%20doorstep%20mobile%20repair%20in%20Pune."
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
