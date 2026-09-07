import { useTranslations } from "next-intl";
import { MapPin, Navigation, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/landing/SectionHeader";
import contactConfig from "@/config/contact";

export default function LocalitiesDirectory() {
  const t = useTranslations("Localities");

  const zoneTitleMap: Record<string, string> = {
    "west-pune": t("westPune"),
    "east-pune": t("eastPune"),
    "central-pune": t("centralPune"),
    "south-pune": t("southPune"),
    "pcmc-north": t("pcmcNorth"),
  };

  return (
    <section
      id="pune-locations"
      className="py-10 sm:py-16 lg:py-20 bg-mist-gray/60 border-b border-zinc-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-8 sm:mb-12"
          action={
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
          }
        />

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contactConfig.serviceAreas.zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl bg-clean-white border border-zinc-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-flash-orange/50 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-flash-orange shrink-0" />
                    <h3 className="font-heading text-sm sm:text-base font-bold text-tech-slate">
                      {zoneTitleMap[zone.id] || zone.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-2xs font-extrabold text-emerald-700 border border-emerald-200 shrink-0">
                    <Zap className="h-3 w-3 text-emerald-600" />
                    {zone.dispatchTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {zone.areas.map((area) => (
                    <span
                      key={area}
                      className="inline-block rounded-md bg-mist-gray px-2 py-0.5 text-2xs sm:text-xs font-medium text-zinc-700 border border-zinc-200/60"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-2xs sm:text-xs">
                <span className="font-semibold text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-flash-orange" />
                  {t("doorstepBadge")}
                </span>
                <Link
                  href="/book-repair"
                  className="font-bold text-flash-orange group-hover:underline inline-flex items-center gap-0.5"
                >
                  {t("bookHere")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Hub and SLA banner below */}
        <div className="mt-8 rounded-2xl bg-clean-white border border-zinc-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-tech-slate">
                {t("hubLabel")}: {contactConfig.serviceAreas.hub}
              </p>
              <p className="text-2xs sm:text-xs text-zinc-500">
                {contactConfig.guarantees.doorstepTravel} • {contactConfig.serviceAreas.doorstepSla}
              </p>
            </div>
          </div>
          <Link
            href="/book-repair"
            className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white shadow-xs hover:bg-[#e64a19] active:scale-95 transition-all shrink-0"
          >
            <span>{t("checkAvailability")}</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
