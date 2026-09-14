import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import contactConfig from "@/config/contact";

export interface CTABlockProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function CTABlock({
  title = "Ready for Doorstep Pickup & Certified Lab Repair?",
  subtitle = "Our Pune team picks up your smartphone, repairs it with genuine OEM parts in our Sadashiv Peth cleanroom lab, and returns it with a 90-day warranty.",
  badge,
  className = "",
}: CTABlockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-tech-slate text-clean-white p-8 sm:p-12 lg:p-16 shadow-xl ${className}`}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-flash-orange/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-electric-amber/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
          {title}
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-300 font-body leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/book-repair"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
          >
            <span>Book Doorstep Repair</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={`tel:${contactConfig.phone.value}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white text-tech-slate px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-surface-hover active:scale-95 transition-all"
          >
            <Phone className="h-4 w-4 text-flash-orange" />
            <span>{contactConfig.phone.display}</span>
          </a>

          <a
            href={contactConfig.whatsapp.getDefaultUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp text-clean-white px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-whatsapp-hover active:scale-95 transition-all"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.19 1.564 5.946l-1.664 6.082 6.221-1.632c1.707.935 3.666 1.465 5.751 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
            </svg>
            <span>WhatsApp Quick Quote</span>
          </a>
        </div>
      </div>
    </div>
  );
}
