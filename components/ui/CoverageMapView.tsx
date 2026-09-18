"use client";

import React from "react";
import { Navigation, MapPin, ExternalLink, Zap, Radio } from "lucide-react";

export interface CoverageMapViewProps {
  localityName: string;
  zoneName?: string;
  dispatchTime?: string;
  pincode?: string;
  className?: string;
}

export default function CoverageMapView({
  localityName,
  zoneName = "Pune Express Dispatch",
  dispatchTime = "25-35 Mins",
  pincode,
  className = "",
}: CoverageMapViewProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${localityName}, Pune, Maharashtra`
  )}`;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-border-dark bg-tech-slate-dark shadow-2xl group select-none ${className}`}
      style={{ minHeight: "360px" }}
    >
      {/* Background Cartographic Vector Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
          </pattern>
          <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Stylized Road Network Lines */}
        <path
          d="M-50,180 C80,120 220,240 380,160 C480,100 620,180 750,140"
          fill="none"
          stroke="url(#road-grad)"
          strokeWidth="3.5"
          strokeDasharray="6 4"
        />
        <path
          d="M100,-40 C140,90 180,180 210,320 C240,420 260,500 290,620"
          fill="none"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <path
          d="M20,320 C140,240 280,260 420,200 C560,140 680,240 820,180"
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Stylized River Contour (Mula-Mutha river arc) */}
        <path
          d="M-40,80 C120,60 260,120 360,190 C460,260 580,240 760,280"
          fill="none"
          stroke="#0284c7"
          strokeWidth="4"
          strokeOpacity="0.3"
        />

        {/* Radial Coverage Rings */}
        <circle cx="50%" cy="48%" r="60" fill="none" stroke="#f97316" strokeOpacity="0.25" strokeDasharray="3 3" />
        <circle cx="50%" cy="48%" r="120" fill="none" stroke="#f97316" strokeOpacity="0.15" strokeDasharray="4 4" />
        <circle cx="50%" cy="48%" r="180" fill="none" stroke="#38bdf8" strokeOpacity="0.08" />
      </svg>

      {/* Pulsing Radar Wave Animation radiating from center */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="absolute -inset-16 rounded-full bg-flash-orange/15 animate-ping opacity-75 duration-1000" />
        <span className="absolute -inset-28 rounded-full bg-flash-orange/5 animate-pulse duration-700" />
      </div>

      {/* Top Status & SLA HUD Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-tech-slate-dark/90 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-flash-orange/20 border border-flash-orange/40 text-flash-orange">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <span className="text-2xs font-mono font-bold tracking-wider text-text-muted uppercase block">
              {zoneName}
            </span>
            <span className="text-xs font-heading font-extrabold text-clean-white">
              Live Dispatch Radar
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-tech-slate border border-success/50 px-3 py-1 text-2xs font-mono font-bold text-success shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span>{dispatchTime} SLA</span>
        </div>
      </div>

      {/* Center Locality Pin & Coordinates */}
      <div className="relative z-10 my-10 flex flex-col items-center justify-center text-center px-4">
        {/* Glowing Pin Beacon */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flash-orange text-clean-white shadow-lg shadow-flash-orange/40 ring-4 ring-flash-orange/30 group-hover:scale-110 transition-transform">
            <MapPin className="h-6 w-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Locality Badge Pill */}
        <div className="rounded-xl bg-tech-slate border border-border-dark px-4 py-2 backdrop-blur-sm shadow-xl max-w-xs">
          <h4 className="font-heading text-sm sm:text-base font-black text-clean-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{localityName}</span>
            <span className="text-2xs font-normal text-text-muted font-mono">Pune</span>
          </h4>
          <p className="text-2xs text-text-muted font-mono mt-0.5">
            {pincode ? `PIN: ${pincode} • ` : ""}Active Doorstep Van Sector
          </p>
        </div>
      </div>

      {/* Surrounding Pune Landmark Markers */}
      <div className="absolute top-20 left-6 z-0 hidden sm:block">
        <span className="rounded-md bg-tech-slate/70 border border-border-dark px-2 py-0.5 text-3xs font-mono text-text-muted">
          ● Aundh / Baner Corridor
        </span>
      </div>
      <div className="absolute bottom-20 right-6 z-0 hidden sm:block">
        <span className="rounded-md bg-tech-slate/70 border border-border-dark px-2 py-0.5 text-3xs font-mono text-text-muted">
          ● Shivaji Nagar Hub 3.8 km
        </span>
      </div>

      {/* Bottom Action Footer with Google Maps Link */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-tech-slate-dark via-tech-slate-dark/95 to-transparent border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-2xs text-text-secondary font-medium text-center sm:text-left">
          <Zap className="h-3.5 w-3.5 text-electric-amber shrink-0" />
          <span>Mobile toolkit dispatched direct to residential & IT parks</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange hover:bg-flash-orange-hover text-clean-white px-4 py-2 text-xs font-bold shadow-md shadow-flash-orange/20 transition-all group-hover:shadow-flash-orange/40 active:scale-95 shrink-0"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Open in Google Maps</span>
          <ExternalLink className="h-3 w-3 opacity-80" />
        </a>
      </div>
    </div>
  );
}
