import { useTranslations } from "next-intl";
import {
  CalendarCheck,
  Truck,
  Eye,
  CreditCard,
  PlayCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      num: "01",
      icon: CalendarCheck,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      icon: Truck,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      icon: Eye,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      num: "04",
      icon: CreditCard,
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-zinc-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <PlayCircle className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-body">
            {t("subtitle")}
          </p>
        </div>

        {/* 4 Steps Grid with Step Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-mist-gray/90 border border-zinc-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:border-flash-orange/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-2xl sm:text-3xl font-black text-flash-orange/40">
                      {step.num}
                    </span>
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-clean-white text-flash-orange shadow-2xs border border-zinc-200">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-tech-slate mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Doorstep Assurance Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-tech-slate p-6 sm:p-10 text-clean-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-md bg-flash-orange px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-clean-white">
                100% In-Front-of-You Repair
              </span>
              <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-clean-white mt-3 tracking-tight">
                {t("videoTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-body leading-relaxed">
                {t("videoSubtitle")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-electric-amber">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  No Passcode / PIN Shared
                </span>
                <span>•</span>
                <span>Zero Risk of Data Leak</span>
                <span>•</span>
                <span>Sterile Antistatic Mat Setup</span>
              </div>
            </div>

            <div className="shrink-0 pt-2 lg:pt-0">
              <Link
                href="/book-repair"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
              >
                <span>Book Doorstep Now</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
