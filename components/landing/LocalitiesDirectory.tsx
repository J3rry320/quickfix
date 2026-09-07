import { useTranslations } from "next-intl";
import { MapPin, Navigation, Zap } from "lucide-react";

export default function LocalitiesDirectory() {
  const t = useTranslations("Localities");

  const zones = [
    {
      title: t("westPune"),
      areas: t("westAreas"),
    },
    {
      title: t("eastPune"),
      areas: t("eastAreas"),
    },
    {
      title: t("centralPune"),
      areas: t("centralAreas"),
    },
    {
      title: t("southPune"),
      areas: t("southAreas"),
    },
  ];

  return (
    <section
      id="pune-locations"
      className="py-10 sm:py-16 lg:py-20 bg-mist-gray/60 border-b border-zinc-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
              <MapPin className="h-3.5 w-3.5" />
              {t("badge")}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-600 font-body max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-tech-slate px-4 py-2.5 sm:px-5 sm:py-3 text-clean-white shadow-md shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-electric-amber" />
            <div>
              <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-clean-white">
                {t("dispatchBadge")}
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">
                {t("dispatchNote")}
              </p>
            </div>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {zones.map((zone, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-clean-white border border-zinc-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:border-flash-orange/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-zinc-100">
                  <Navigation className="h-4 w-4 text-flash-orange" />
                  <h3 className="font-heading text-sm font-bold text-tech-slate">
                    {zone.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed">
                  {zone.areas}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] sm:text-xs font-bold text-flash-orange">
                Doorstep Available • 30-Min SLA
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
