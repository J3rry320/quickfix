import contactConfig from "@/config/contact";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  Phone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// User can set their image/video path here (e.g. "/hero-technician.jpg")
const heroImageSrc = "/assets/images/landing.webp";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative bg-flash-orange text-clean-white overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Subtle background atmospheric blur accents */}
      <div
        className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-black/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, High-Contrast CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-clean-white leading-[1.15]">
              {t("titleStart")}{" "}
              <span className="underline decoration-clean-white/80 decoration-4 underline-offset-8 font-black">
                {t("titleCity")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-clean-white/95 font-body max-w-2xl font-normal">
              {t("subtitle")}
            </p>

            {/* High Contrast CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/book-repair"
                className="inline-flex items-center justify-center rounded-xl bg-clean-white px-7 py-3.5 text-base font-extrabold text-tech-slate shadow-xl hover:bg-mist-gray hover:shadow-2xl active:scale-[0.98] transition-all"
              >
                <span>{t("ctaPrimary")}</span>
                <ArrowRight className="ml-2 h-5 w-5 text-flash-orange" />
              </Link>

              <a
                href={`tel:${contactConfig.phone.value}`}
                className="inline-flex items-center justify-center rounded-xl bg-tech-slate px-7 py-3.5 text-base font-extrabold text-clean-white shadow-xl hover:bg-tech-slate-hover hover:shadow-2xl active:scale-[0.98] transition-all border border-tech-slate"
              >
                <Phone className="mr-2 h-5 w-5 text-flash-orange" />
                <span>{t("ctaSecondary")}</span>
              </a>
            </div>

            {/* Reassurance note */}
            <div className="mt-4 sm:mt-5 flex items-center gap-2 text-xs font-semibold text-clean-white">
              <CheckCircle2 className="h-4 w-4 text-clean-white shrink-0" />
              <span>{t("quickNote")}</span>
            </div>
          </div>

          {/* Right Column: Hero Media Container with 4:3 Aspect Ratio */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-1/1 overflow-hidden rounded-2xl sm:rounded-3xl bg-clean-white/10 backdrop-blur-md border border-clean-white/20 shadow-2xl flex items-center justify-center">
              {heroImageSrc ? (
                <Image
                  src={heroImageSrc}
                  alt="QuickFix Pune mobile repair service"
                  fill
                  preload={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 512px"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center select-none text-clean-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-clean-white/15 border border-clean-white/30 text-clean-white mb-3 shadow-inner">
                    <ImageIcon className="h-8 w-8 text-clean-white" />
                  </div>
                  <span className="text-sm font-bold text-clean-white tracking-wide">
                    Doorstep Pickup & Lab Repair
                  </span>
                  <span className="text-xs text-clean-white/80 mt-1 max-w-xs">
                    Free doorstep pickup, ESD-safe lab repair & same-day return
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
