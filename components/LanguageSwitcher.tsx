"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { Globe, ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const languageMeta: Record<Locale, { label: string; code: string; short: string }> = {
  en: { label: "English", code: "EN", short: "En" },
  hi: { label: "हिन्दी", code: "HI", short: "हि" },
  mr: { label: "मराठी", code: "MR", short: "म" },
};

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (nextLocale: Locale) => {
    setIsOpen(false);
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-label={`Change language, current is ${languageMeta[currentLocale].label}`}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-clean-white px-2.5 py-1.5 text-xs font-bold text-tech-slate hover:bg-mist-gray hover:border-zinc-300 transition-colors cursor-pointer disabled:opacity-60"
      >
        <Globe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
        <span className="uppercase text-[11px] tracking-wider">{languageMeta[currentLocale].code}</span>
        <ChevronDown
          className={`h-3 w-3 text-zinc-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl bg-clean-white border border-zinc-200 p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 z-50">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Language
          </div>
          {routing.locales.map((loc) => {
            const isActive = loc === currentLocale;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleSelect(loc)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-flash-orange/10 text-flash-orange font-bold"
                    : "text-tech-slate hover:bg-mist-gray font-medium"
                }`}
              >
                <span>{languageMeta[loc].label}</span>
                {isActive && <Check className="h-3.5 w-3.5 text-flash-orange" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
