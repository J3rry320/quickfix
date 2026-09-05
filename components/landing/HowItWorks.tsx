import { useTranslations } from "next-intl";
import {
  CalendarCheck,
  Truck,
  Eye,
  CreditCard,
  PlayCircle,
} from "lucide-react";
import MediaPlaceholder from "./MediaPlaceholder";

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
    <section id="how-it-works" className="py-16 lg:py-24 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <PlayCircle className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-body">
            {t("subtitle")}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-mist-gray border border-zinc-200 p-6 shadow-xs flex flex-col justify-between hover:border-flash-orange/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-3xl font-black text-flash-orange/40">
                      {step.num}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clean-white text-flash-orange shadow-2xs border border-zinc-200">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-bold text-tech-slate mb-2">
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

        {/* Featured Video Showcase Card */}
        <div className="rounded-3xl bg-tech-slate p-6 sm:p-10 text-clean-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="rounded-md bg-flash-orange px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-clean-white">
                Live Video Demo
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-clean-white mt-4 tracking-tight">
                {t("videoTitle")}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 font-body leading-relaxed">
                {t("videoSubtitle")}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-electric-amber">
                <span>✓ 100% On-Spot Doorstep Transparency</span>
              </div>
            </div>

            {/* Video Placeholder Container (Aspect Ratio 16:9) */}
            <div className="lg:col-span-7">
              <MediaPlaceholder
                src=""
                alt="QuickFix Doorstep Repair Video Demo"
                aspectRatio="16/9"
                type="video"
                badge={t("videoBadge")}
                label="Click to play 30-min express repair demonstration video"
                className="bg-zinc-800 border-zinc-700 shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
