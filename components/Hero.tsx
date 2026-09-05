import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import contactConfig from "@/config/contact";

// User can set their image path here (e.g. "/hero-technician.jpg")
const heroImageSrc = "";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <>
      {/* 1. Hero Section - Engineered to fit within 100vh (minus navbar) */}
      <section className="relative flex flex-col justify-center bg-flash-orange text-clean-white min-h-[calc(100svh-4rem)] lg:h-[calc(100svh-4rem)] overflow-hidden py-8 sm:py-12 lg:py-0">
        {/* Subtle background atmospheric accents */}
        <div
          className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-black/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Subtitle, High-Contrast CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Main Headline (High-Contrast Clean White Text) */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-clean-white leading-[1.12]">
                {t("titleStart")}{" "}
                <span className="text-clean-white underline decoration-clean-white/80 decoration-4 underline-offset-8 font-black">
                  {t("titleCity")}
                </span>
              </h1>

              {/* Subtitle with high legibility */}
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-clean-white/95 font-body max-w-2xl font-normal">
                {t("subtitle")}
              </p>

              {/* High Contrast CTA Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <a
                  href="#book"
                  className="inline-flex items-center justify-center rounded-xl bg-clean-white px-7 py-3.5 text-base font-extrabold text-tech-slate shadow-xl hover:bg-zinc-100 hover:shadow-2xl active:scale-[0.98] transition-all"
                >
                  <span>{t("ctaPrimary")}</span>
                  <ArrowRight className="ml-2 h-5 w-5 text-flash-orange" />
                </a>

                <a
                  href={`tel:${contactConfig.phone.value}`}
                  className="inline-flex items-center justify-center rounded-xl bg-tech-slate px-7 py-3.5 text-base font-extrabold text-clean-white shadow-xl hover:bg-black hover:shadow-2xl active:scale-[0.98] transition-all border border-tech-slate"
                >
                  <Phone className="mr-2 h-5 w-5 text-flash-orange" />
                  <span>{t("ctaSecondary")}</span>
                </a>
              </div>

              {/* Reassurance note in crisp high-contrast white */}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-clean-white">
                <CheckCircle2 className="h-4 w-4 text-clean-white shrink-0" />
                <span>{t("quickNote")}</span>
              </div>
            </div>

            {/* Right Column: Media Placeholder using next/image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-4/3 w-full max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-2xl flex flex-col items-center justify-center group">
                {heroImageSrc ? (
                  <Image
                    src={heroImageSrc}
                    alt="QuickFix Pune mobile repair service"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-clean-white">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-clean-white/20 backdrop-blur-sm border border-white/40 text-clean-white mb-3 shadow-inner">
                      <ImageIcon className="h-8 w-8 text-clean-white" />
                    </div>
                    <span className="text-base font-bold text-clean-white tracking-wide">
                      {t("mediaPlaceholder.title")}
                    </span>
                    <span className="text-xs text-clean-white/90 mt-1 max-w-xs font-medium">
                      {t("mediaPlaceholder.hint")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Below Hero - Trust Badges, Supported Brands, & Pune Coverage */}
      <section className="bg-clean-white py-12 lg:py-16 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Trust Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-mist-gray border border-zinc-200/80 shadow-2xs hover:border-flash-orange/40 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-tech-slate leading-tight">
                  {t("trustBadges.fastService")}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                  {t("trustBadges.fastServiceDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-mist-gray border border-zinc-200/80 shadow-2xs hover:border-flash-orange/40 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-tech-slate leading-tight">
                  {t("trustBadges.warranty")}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                  {t("trustBadges.warrantyDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-mist-gray border border-zinc-200/80 shadow-2xs hover:border-flash-orange/40 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-tech-slate leading-tight">
                  {t("trustBadges.genuineParts")}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                  {t("trustBadges.genuinePartsDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-mist-gray border border-zinc-200/80 shadow-2xs hover:border-flash-orange/40 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-tech-slate leading-tight">
                  {t("trustBadges.doorstep")}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                  {t("trustBadges.doorstepDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Supported Brands & Pune Coverage Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Supported Brands */}
            <div className="lg:col-span-5 rounded-2xl bg-mist-gray border border-zinc-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-tech-slate">
                    {t("supportedBrands.title")}
                  </h3>
                  <span className="text-[11px] font-bold text-flash-orange">
                    {t("supportedBrands.badge")}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Apple iPhone",
                    "OnePlus",
                    "Samsung Galaxy",
                    "Xiaomi",
                    "Vivo",
                    "Oppo",
                    "Google Pixel",
                    "Realme",
                  ].map((brand) => (
                    <span
                      key={brand}
                      className="rounded-lg bg-clean-white px-3 py-1.5 text-xs font-bold text-tech-slate border border-zinc-200 shadow-2xs hover:border-flash-orange transition-colors"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pune Coverage Areas */}
            <div className="lg:col-span-7 rounded-2xl bg-tech-slate text-clean-white p-5 sm:p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-white/15">
                  <MapPin className="h-5 w-5 text-flash-orange" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-electric-amber">
                    {t("coverage.label")}
                  </h3>
                </div>
                <p className="mt-3.5 text-sm leading-relaxed text-zinc-200">
                  {t("coverage.areas")}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>{t("coverage.subtext")}</span>
                <a href="#book" className="font-bold text-clean-white hover:text-flash-orange transition-colors">
                  {t("coverage.cta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
