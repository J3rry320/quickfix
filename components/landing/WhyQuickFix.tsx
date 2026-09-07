import { useTranslations } from "next-intl";
import { ShieldCheck, Check, X, Award, Sparkles } from "lucide-react";

export default function WhyQuickFix() {
  const t = useTranslations("WhyQuickFix");

  const comparisonRows = [
    {
      feature: t("feature1"),
      quickfix: t("qf1"),
      official: t("sc1"),
      local: t("ls1"),
    },
    {
      feature: t("feature2"),
      quickfix: t("qf2"),
      official: t("sc2"),
      local: t("ls2"),
    },
    {
      feature: t("feature3"),
      quickfix: t("qf3"),
      official: t("sc3"),
      local: t("ls3"),
    },
    {
      feature: t("feature4"),
      quickfix: t("qf4"),
      official: t("sc4"),
      local: t("ls4"),
    },
    {
      feature: t("feature5"),
      quickfix: t("qf5"),
      official: t("sc5"),
      local: t("ls5"),
    },
  ];

  return (
    <section
      id="why-us"
      className="py-10 sm:py-16 lg:py-20 bg-mist-gray/60 border-b border-zinc-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <Award className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-body">
            {t("subtitle")}
          </p>
        </div>

        {/* Mobile View: Dedicated High-Impact Comparison Cards (< md) */}
        <div className="block md:hidden space-y-4">
          {/* QuickFix Winning Card */}
          <div className="rounded-2xl bg-clean-white border-2 border-flash-orange p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-flash-orange text-clean-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Recommended</span>
            </div>

            <h3 className="font-heading text-lg font-black text-tech-slate mb-3">
              Quick<span className="text-flash-orange">Fix</span>.in Doorstep
            </h3>

            <div className="space-y-3">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-flash-orange/10 text-flash-orange shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 font-black" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">
                      {row.feature}
                    </span>
                    <span className="text-xs font-bold text-tech-slate">
                      {row.quickfix}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Centers vs Local Shops Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-clean-white border border-zinc-200 p-4 shadow-xs">
              <h4 className="font-heading text-sm font-bold text-zinc-500 mb-3">
                {t("thServiceCenter")}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-600">
                {comparisonRows.map((row, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{row.official}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-clean-white border border-zinc-200 p-4 shadow-xs">
              <h4 className="font-heading text-sm font-bold text-zinc-500 mb-3">
                {t("thLocalShop")}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-600">
                {comparisonRows.map((row, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{row.local}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop View: Full Table (>= md) */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 items-start">
          {/* Comparison Table */}
          <div className="md:col-span-8 overflow-hidden rounded-2xl bg-clean-white border border-zinc-200 shadow-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="py-4 px-6 font-extrabold text-tech-slate">
                    {t("thFeature")}
                  </th>
                  <th className="py-4 px-6 font-extrabold text-flash-orange bg-flash-orange/10 border-x border-flash-orange/20">
                    {t("thQuickFix")}
                  </th>
                  <th className="py-4 px-6 font-bold text-zinc-500">
                    {t("thServiceCenter")}
                  </th>
                  <th className="py-4 px-6 font-bold text-zinc-500">
                    {t("thLocalShop")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-medium">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-tech-slate">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-bold text-tech-slate bg-flash-orange/5 border-x border-flash-orange/20">
                      <div className="flex items-center gap-1.5 text-tech-slate">
                        <Check className="h-4 w-4 text-flash-orange shrink-0 font-black" />
                        <span>{row.quickfix}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <X className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{row.official}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <X className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{row.local}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side Guarantee Card */}
          <div className="md:col-span-4 rounded-2xl bg-clean-white border border-zinc-200 p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-flash-orange" />
                <h3 className="font-heading text-lg font-bold text-tech-slate">
                  {t("mediaTitle")}
                </h3>
              </div>
              <p className="text-xs text-zinc-500 font-body mb-5 leading-relaxed">
                Our technicians travel with ESD-safe antistatic kits, laser debonding tools, and calibrated screwdrivers.
              </p>

              <div className="space-y-3 pt-4 border-t border-zinc-100 text-xs">
                <div className="flex items-center gap-2 text-tech-slate font-semibold">
                  <Check className="h-4 w-4 text-flash-orange shrink-0" />
                  <span>ESD-Safe antistatic grounded mats</span>
                </div>
                <div className="flex items-center gap-2 text-tech-slate font-semibold">
                  <Check className="h-4 w-4 text-flash-orange shrink-0" />
                  <span>Precision micro-screwdrivers & suction</span>
                </div>
                <div className="flex items-center gap-2 text-tech-slate font-semibold">
                  <Check className="h-4 w-4 text-flash-orange shrink-0" />
                  <span>Zero passcode required for screen fixes</span>
                </div>
                <div className="flex items-center gap-2 text-tech-slate font-semibold">
                  <Check className="h-4 w-4 text-flash-orange shrink-0" />
                  <span>On-spot warranty registration receipt</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-flash-orange">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>ESD-Safe & Data-Zero-Access Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
