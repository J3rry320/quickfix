"use client";

import React from "react";
import { Navigation, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import contactConfig from "@/config/contact";

export interface CoverageMapViewProps {
  localityName: string;
  zoneName?: string;
  dispatchTime?: string;
  pincode?: string;
  className?: string;
}

export default function CoverageMapView({
  localityName,
  pincode,
  className = "",
}: CoverageMapViewProps) {
  const t = useTranslations("LocalityPage.map");

  // Google Maps directions to the central service hub address in contact config
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    contactConfig.address.full
  )}`;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-border-default bg-clean-white shadow-xl shadow-tech-slate/5 group select-none flex flex-col justify-between ${className}`}
      style={{ minHeight: "380px" }}
    >
      {/* Top Floating HUD Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between gap-3 pointer-events-none">
        <div className="inline-flex items-center gap-2 rounded-full bg-clean-white/95 backdrop-blur-md border border-border-default px-3 py-1 shadow-2xs pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-flash-orange animate-pulse" />
          <span className="text-2xs font-bold text-tech-slate tracking-wide uppercase">
            {t("serviceArea")}
          </span>
        </div>

        <div className="inline-flex items-center rounded-full bg-clean-white/95 backdrop-blur-md border border-border-default px-3 py-1 text-2xs font-bold text-text-muted shadow-2xs pointer-events-auto">
          <span>{t("puneMh")}</span>
        </div>
      </div>

      {/* Cartographic Vector Map Background (Organic streets, parks, river — NO square tiles) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 500 380"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Base off-white canvas ground */}
          <rect width="100%" height="100%" fill="#F8FAFC" />

          {/* Organic Green Spaces / Parks (Subtle and natural) */}
          <path
            d="M 20,25 Q 75,15 120,45 Q 140,85 85,110 Q 30,95 20,60 Z"
            fill="#EDF7EE"
            opacity="0.8"
          />
          <path
            d="M 370,220 Q 430,205 475,235 Q 490,290 440,320 Q 375,310 360,265 Z"
            fill="#EDF7EE"
            opacity="0.8"
          />
          <path
            d="M 330,30 Q 390,15 440,40 Q 450,75 400,90 Q 340,85 330,55 Z"
            fill="#EDF7EE"
            opacity="0.6"
          />

          {/* River Waterway Arc (Mula-Mutha river soft curve) */}
          <path
            d="M -30,85 C 90,65 190,125 300,95 C 390,70 450,110 530,95"
            fill="none"
            stroke="#E0F2FE"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M -30,85 C 90,65 190,125 300,95 C 390,70 450,110 530,95"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Secondary Street Network (Continuous organic city roads) */}
          <g strokeLinecap="round">
            {/* Road casing (white) for clean contrast */}
            <path d="M -10,45 L 510,75" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M -10,45 L 510,75" stroke="#E2E8F0" strokeWidth="3" />

            <path d="M 15,160 L 505,130" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 15,160 L 505,130" stroke="#E2E8F0" strokeWidth="3" />

            <path d="M -10,270 L 510,250" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M -10,270 L 510,250" stroke="#E2E8F0" strokeWidth="3" />

            <path d="M 85,-10 L 95,390" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 85,-10 L 95,390" stroke="#E2E8F0" strokeWidth="3" />

            <path d="M 405,-10 L 395,390" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 405,-10 L 395,390" stroke="#E2E8F0" strokeWidth="3" />

            {/* Diagonal cross-connectors */}
            <path d="M 30,340 L 220,30" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M 30,340 L 220,30" stroke="#E2E8F0" strokeWidth="2.5" />

            <path d="M 280,390 L 470,80" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M 280,390 L 470,80" stroke="#E2E8F0" strokeWidth="2.5" />
          </g>

          {/* Major Arterial Corridors (Tech Slate arterial avenues with white casing) */}
          <g strokeLinecap="round">
            {/* East-West Arterial Avenue */}
            <path
              d="M -30,215 C 100,200 180,225 250,215 C 330,205 420,175 530,165"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="11"
            />
            <path
              d="M -30,215 C 100,200 180,225 250,215 C 330,205 420,175 530,165"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
            />

            {/* North-South Arterial Highway */}
            <path
              d="M 250,-20 C 248,80 252,145 250,215 C 248,275 244,325 240,400"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="11"
            />
            <path
              d="M 250,-20 C 248,80 252,145 250,215 C 248,275 244,325 240,400"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
            />

            {/* Central Roundabout / Chowk */}
            <circle cx="250" cy="215" r="16" fill="#F8FAFC" stroke="#FFFFFF" strokeWidth="8" />
            <circle cx="250" cy="215" r="16" fill="none" stroke="#334155" strokeWidth="5" />
            <circle cx="250" cy="215" r="6" fill="#CBD5E1" />
          </g>

          {/* Express Doorstep Transit Route (Flash Orange Corridor) */}
          <path
            d="M 60,370 C 130,275 195,230 250,160 C 295,105 385,65 470,25"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 60,370 C 130,275 195,230 250,160 C 295,105 385,65 470,25"
            fill="none"
            stroke="#FF5722"
            strokeWidth="4"
            strokeDasharray="8 5"
            strokeLinecap="round"
          />

          {/* Concentric Doorstep Pickup Radius */}
          <circle
            cx="250"
            cy="160"
            r="120"
            fill="none"
            stroke="#FF5722"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeOpacity="0.22"
          />
          <circle
            cx="250"
            cy="160"
            r="60"
            fill="#FF5722"
            fillOpacity="0.04"
            stroke="#FF5722"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.45"
          />
        </svg>
      </div>

      {/* Central Locality Pin Beacon & Badge Card */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4 py-6">
        {/* Glowing Orange Pin with Gentle Pulsing Aura */}
        <div className="relative mb-2.5 flex items-center justify-center">
          <span className="absolute -inset-4 rounded-full bg-flash-orange/20 animate-ping duration-1000 pointer-events-none" />
          <span className="absolute -inset-7 rounded-full bg-flash-orange/10 animate-pulse duration-700 pointer-events-none" />

          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-flash-orange text-clean-white shadow-lg shadow-flash-orange/30 ring-4 ring-flash-orange/20 group-hover:scale-105 transition-transform">
            <MapPin className="h-5.5 w-5.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Clean Locality Card */}
        <div className="rounded-2xl bg-clean-white/95 backdrop-blur-md border border-border-default px-5 py-2.5 shadow-lg shadow-tech-slate/5 max-w-xs transition-transform group-hover:translate-y-[-2px]">
          <h4 className="font-heading text-sm sm:text-base font-extrabold text-tech-slate tracking-tight">
            {localityName}
          </h4>
          <p className="text-2xs font-semibold text-text-muted mt-0.5">
            {pincode ? `${t("pin", { pincode })} • ` : ""}
            {t("pune")}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer with Directions to Address in Config */}
      <div className="relative z-10 p-3.5 sm:p-4 bg-clean-white/95 backdrop-blur-md border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-2xs sm:text-xs font-semibold text-text-secondary text-center sm:text-left">
          <ShieldCheck className="h-4 w-4 text-flash-orange shrink-0" />
          <span>{t("pickupCoverage", { name: localityName })}</span>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-tech-slate hover:bg-tech-slate-dark text-clean-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Navigation className="h-3.5 w-3.5 text-flash-orange" />
          <span>{t("getDirections")}</span>
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </div>
    </div>
  );
}
