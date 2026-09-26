"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Navigation,
  Zap,
  ShieldCheck,
  ArrowRight,
  Search,
  X,
  Building,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocalityItem } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";

interface LocationsDirectoryClientProps {
  localities: LocalityItem[];
}

export default function LocationsDirectoryClient({
  localities,
}: LocationsDirectoryClientProps) {
  const t = useTranslations("LocationsHub.directory");
  const tLocalities = useTranslations("Localities");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const zones = useMemo(() => {
    return [
      { id: "all", label: t("allZones"), count: localities.length },
      {
        id: "west-pune",
        label: tLocalities("westPune") || "West Pune",
        name: "West Pune",
        count: localities.filter((l) => l.zone.toLowerCase().includes("west")).length,
      },
      {
        id: "east-pune",
        label: tLocalities("eastPune") || "East Pune",
        name: "East Pune",
        count: localities.filter((l) => l.zone.toLowerCase().includes("east")).length,
      },
      {
        id: "central-pune",
        label: tLocalities("centralPune") || "Central Pune",
        name: "Central Pune",
        count: localities.filter((l) => l.zone.toLowerCase().includes("central")).length,
      },
      {
        id: "south-pune",
        label: tLocalities("southPune") || "South Pune",
        name: "South Pune",
        count: localities.filter((l) => l.zone.toLowerCase().includes("south")).length,
      },
      {
        id: "pcmc-north",
        label: tLocalities("pcmcNorth") || "PCMC / North",
        name: "PCMC / North",
        count: localities.filter(
          (l) =>
            l.zone.toLowerCase().includes("pcmc") ||
            l.zone.toLowerCase().includes("north")
        ).length,
      },
    ];
  }, [localities, t, tLocalities]);

  const filteredLocalities = useMemo(() => {
    return localities.filter((loc) => {
      // 1. Zone filter
      if (selectedZone !== "all") {
        const zoneObj = zones.find((z) => z.id === selectedZone);
        if (zoneObj?.name) {
          const match =
            loc.zone.toLowerCase().includes(zoneObj.name.toLowerCase()) ||
            (selectedZone === "pcmc-north" &&
              (loc.zone.toLowerCase().includes("pcmc") ||
                loc.zone.toLowerCase().includes("north")));
          if (!match) return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = loc.name.toLowerCase().includes(query);
        const pincodeMatch = loc.pincode.toLowerCase().includes(query);
        const landmarkMatch = loc.landmark.toLowerCase().includes(query);
        const zoneMatch = loc.zone.toLowerCase().includes(query);
        const neighborhoodMatch = loc.popularNeighborhoods.some((n) =>
          n.toLowerCase().includes(query)
        );

        return (
          nameMatch ||
          pincodeMatch ||
          landmarkMatch ||
          zoneMatch ||
          neighborhoodMatch
        );
      }

      return true;
    });
  }, [localities, selectedZone, searchQuery, zones]);

  return (
    <div className="w-full">
      {/* Search Bar & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-clean-white border border-border-default shadow-xs text-tech-slate placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-flash-orange/30 focus:border-flash-orange text-sm font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-mist-gray text-text-muted hover:text-tech-slate transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          {zones.map((zone) => {
            const isActive = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-tech-slate text-clean-white shadow-xs"
                    : "bg-clean-white border border-border-default text-text-secondary hover:border-border-strong hover:text-tech-slate"
                }`}
              >
                <span>{zone.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive
                      ? "bg-clean-white/20 text-clean-white"
                      : "bg-mist-gray text-text-muted"
                  }`}
                >
                  {zone.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Localities Grid */}
      {filteredLocalities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocalities.map((loc) => (
            <div
              key={loc.slug}
              className="rounded-2xl bg-clean-white border border-border-default p-5 shadow-xs flex flex-col justify-between hover:border-flash-orange/50 hover:shadow-md transition-all group"
            >
              <div>
                {/* Header: Name, Zone, SLA */}
                <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-border-default/60">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Navigation className="h-3.5 w-3.5 text-flash-orange shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        {loc.zone}
                      </span>
                    </div>
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="font-heading text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors"
                    >
                      {loc.name}
                    </Link>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-2xs font-extrabold text-success border border-success-border shrink-0">
                    <Zap className="h-3 w-3 text-success-green" />
                    <span>{loc.dispatchTime}</span>
                  </span>
                </div>

                {/* Landmark & PIN */}
                <div className="space-y-1.5 mb-3.5 text-xs text-text-secondary">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-flash-orange shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{loc.landmark}</span>
                  </div>
                  <div className="flex items-center gap-2 text-2xs font-semibold text-text-muted pl-5">
                    <span>PIN: {loc.pincode}</span>
                  </div>
                </div>

                {/* Neighborhoods Tags */}
                {loc.popularNeighborhoods.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Societies & Areas
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.popularNeighborhoods.slice(0, 4).map((neighborhood, idx) => (
                        <span
                          key={idx}
                          className="inline-block rounded-md bg-mist-gray px-2 py-0.5 text-2xs font-medium text-tech-slate border border-border-default"
                        >
                          {neighborhood}
                        </span>
                      ))}
                      {loc.popularNeighborhoods.length > 4 && (
                        <span className="inline-block rounded-md bg-mist-gray px-1.5 py-0.5 text-2xs font-bold text-text-muted">
                          +{loc.popularNeighborhoods.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border-default/60 flex items-center justify-between gap-2 text-xs">
                <Link
                  href="/book-repair"
                  className="font-bold text-flash-orange group-hover:underline inline-flex items-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Book Pickup</span>
                </Link>

                <Link
                  href={`/locations/${loc.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-tech-slate group-hover:text-flash-orange transition-colors text-xs"
                >
                  <span>{t("viewLocality")}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border-strong bg-clean-white p-10 text-center max-w-xl mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flash-orange/10 text-flash-orange mx-auto mb-3">
            <Building className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-tech-slate">
            {t("noResultsTitle")}
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            {t("noResultsDesc")}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedZone("all");
              }}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-mist-gray text-tech-slate text-xs font-bold hover:bg-border-default transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-flash-orange text-clean-white text-xs font-bold hover:bg-flash-orange-hover transition-colors shadow-xs"
            >
              Call Helpline
            </a>
          </div>
        </div>
      )}

      {/* Central Hub & Doorstep Travel Guarantee Banner */}
      <div className="mt-10 rounded-2xl bg-clean-white border border-border-default p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-tech-slate">
              {contactConfig.serviceAreas.hub}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {contactConfig.guarantees.doorstepTravel} • {contactConfig.serviceAreas.doorstepSla}
            </p>
          </div>
        </div>
        <Link
          href="/book-repair"
          className="inline-flex items-center justify-center rounded-xl bg-flash-orange px-6 py-3 text-xs font-extrabold text-clean-white shadow-xs hover:bg-flash-orange-hover active:scale-95 transition-all shrink-0 w-full sm:w-auto"
        >
          <span>Schedule Doorstep Pickup</span>
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
