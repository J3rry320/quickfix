import AspectBox from "@/components/ui/AspectBox";
import contactConfig from "@/config/contact";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

// User can set their image/video path here (e.g. "/hero-technician.jpg")
const heroImageSrc = "/assets/images/landing.webp";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative bg-flash-orange text-clean-white overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Subtle background atmospheric blur accents */}
      <div
        className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-clean-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-tech-slate-dark/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, High-Contrast CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-clean-white leading-[1.2] sm:leading-[1.18]">
              {t("titleStart")}{" "}
              <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-clean-white px-3 sm:px-4 py-0.5 sm:py-1 text-tech-slate font-black shadow-xl shadow-tech-slate/20">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-flash-orange shrink-0" />
                <span className="tracking-normal">{t("titleCity")}</span>
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

          {/* Right Column: Hero Media Container */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md lg:max-w-lg">
              <AspectBox
                aspectRatio="1/1"
                src={heroImageSrc}
                alt={t("media.alt")}
                variant="glass"
                fallbackType="lab"
                title={t("media.title")}
                label={t("media.label")}
                preload={true}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 512px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
