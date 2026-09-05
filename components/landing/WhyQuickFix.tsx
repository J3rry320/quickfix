import { useTranslations } from "next-intl";
import { ShieldCheck, Check, X, Award } from "lucide-react";
import MediaPlaceholder from "./MediaPlaceholder";

export default function WhyQuickFix() {
  const t = useTranslations("WhyQuickFix");

  const comparisonRows = [
    {
      feature: t("feature1"),
      quickfix: t("qf1"),
      official: t("sc1"),
      local: t("ls1"),
      highlight: true,
    },
    {
      feature: t("feature2"),
      quickfix: t("qf2"),
      official: t("sc2"),
      local: t("ls2"),
      highlight: true,
    },
    {
      feature: t("feature3"),
      quickfix: t("qf3"),
      official: t("sc3"),
      local: t("ls3"),
      highlight: true,
    },
    {
      feature: t("feature4"),
      quickfix: t("qf4"),
      official: t("sc4"),
      local: t("ls4"),
      highlight: false,
    },
    {
      feature: t("feature5"),
      quickfix: t("qf5"),
      official: t("sc5"),
      local: t("ls5"),
      highlight: false,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-mist-gray/60 border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
            <Award className="h-3.5 w-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-body">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Comparison Table */}
          <div className="lg:col-span-8 overflow-x-auto rounded-2xl bg-clean-white border border-zinc-200 shadow-md">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="py-4 px-4 sm:px-6 font-extrabold text-tech-slate">
                    {t("thFeature")}
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-extrabold text-flash-orange bg-flash-orange/10 border-x border-flash-orange/20">
                    {t("thQuickFix")}
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-zinc-500">
                    {t("thServiceCenter")}
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-zinc-500">
                    {t("thLocalShop")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-medium">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-tech-slate">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-tech-slate bg-flash-orange/5 border-x border-flash-orange/20">
                      <div className="flex items-center gap-1.5 text-tech-slate">
                        <Check className="h-4 w-4 text-flash-orange shrink-0 font-black" />
                        <span>{row.quickfix}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <X className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{row.official}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-500">
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

          {/* Side Media Card (Aspect Ratio 4:3) */}
          <div className="lg:col-span-4 rounded-2xl bg-clean-white border border-zinc-200 p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                {t("mediaTitle")}
              </h3>
              <p className="text-xs text-zinc-500 font-body mb-4">
                Our technicians travel with ESD-safe antistatic kits, laser debonding tools, and calibrated screwdrivers.
              </p>
              <MediaPlaceholder
                src=""
                alt="QuickFix Sterile Technician Workstation"
                aspectRatio="4/3"
                type="image"
                badge={t("mediaBadge")}
                label="Technician precision kit and clean repair setup"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-tech-slate">
              <ShieldCheck className="h-4 w-4 text-flash-orange shrink-0" />
              <span>ESD-Safe & Data-Zero-Access Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
