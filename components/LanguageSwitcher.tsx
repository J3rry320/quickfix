"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
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

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative inline-flex items-center rounded-lg bg-mist-gray p-1 border border-zinc-200">
      {routing.locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => handleSelect(loc)}
            disabled={isPending}
            aria-label={`Switch to ${languageMeta[loc].label}`}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              isActive
                ? "bg-clean-white text-tech-slate shadow-xs"
                : "text-zinc-600 hover:text-tech-slate hover:bg-black/5"
            } ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span>{languageMeta[loc].label}</span>
          </button>
        );
      })}
    </div>
  );
}
