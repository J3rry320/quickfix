import { useTranslations } from "next-intl";
import {
  CalendarCheck,
  Truck,
  Eye,
  CreditCard,
} from "lucide-react";
import SectionHeader from "@/components/landing/SectionHeader";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";

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
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-10 sm:mb-14"
        />

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

        {/* Reusable Doorstep Pickup & Lab Assurance Banner with 9:16 Video Box */}
        <DoorstepPickupAssurance />
      </div>
    </section>
  );
}

