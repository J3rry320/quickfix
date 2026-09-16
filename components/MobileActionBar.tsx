"use client";

import { MessageSquare, Wrench } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import contactConfig from "@/config/contact";

export default function MobileActionBar() {
  const pathname = usePathname();
  const whatsappUrl = contactConfig.whatsapp.getDefaultUrl();

  // Hide sticky mobile action buttons on the repair booking page
  const isBookingPage =
    pathname === "/book-repair" ||
    pathname.startsWith("/book-repair") ||
    pathname.includes("book-repair");

  if (isBookingPage) {
    return null;
  }

  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-clean-white/95 backdrop-blur-md border-t border-border-default px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-whatsapp/30 bg-whatsapp/10 py-3 px-4 text-xs font-bold text-tech-slate active:scale-95 transition-all"
          aria-label="WhatsApp QuickFix"
        >
          <MessageSquare className="h-4 w-4 text-whatsapp shrink-0" />
          <span>WhatsApp Us</span>
        </a>

        {/* Book Repair CTA */}
        <Link
          href="/book-repair"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange py-3 px-4 text-xs font-extrabold text-clean-white shadow-md active:scale-95 hover:bg-flash-orange-hover transition-all"
        >
          <Wrench className="h-4 w-4 shrink-0" />
          <span>Book Repair</span>
        </Link>
      </div>
    </aside>
  );
}
