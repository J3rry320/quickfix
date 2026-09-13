import contactConfig from "@/config/contact";
import { Navigation, MapPin, ExternalLink } from "lucide-react";

interface GoogleMapEmbedProps {
  className?: string;
  heightClass?: string;
  showCardHeader?: boolean;
  showDirectionsButton?: boolean;
  title?: string;
}

export default function GoogleMapEmbed({
  className = "",
  heightClass = "h-60 sm:h-72",
  showCardHeader = false,
  showDirectionsButton = false,
  title = "QuickFix Pune Hub Location - Sadashiv Peth",
}: GoogleMapEmbedProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border-default bg-surface-hover shadow-xs flex flex-col ${className}`}
    >
      {showCardHeader && (
        <div className="flex items-center justify-between border-b border-border-default bg-clean-white px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-tech-slate font-medium truncate">
            <MapPin className="h-4 w-4 shrink-0 text-flash-orange" />
            <span className="truncate">{contactConfig.address.short}</span>
          </div>
          <a
            href={contactConfig.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 font-bold text-flash-orange hover:text-flash-orange-hover transition-colors ml-2 hover:underline"
          >
            <span>Directions</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      <div className={`w-full ${heightClass} relative bg-surface-hover`}>
        <iframe
          src={contactConfig.mapEmbedUrl}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>

      {showDirectionsButton && (
        <div className="border-t border-border-default bg-clean-white p-3 flex items-center justify-between">
          <div className="text-2xs text-text-muted font-medium truncate">
            {contactConfig.address.landmark} • {contactConfig.hours.time}
          </div>
          <a
            href={contactConfig.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-tech-slate px-3 py-1.5 text-xs font-bold text-clean-white hover:bg-tech-slate-hover transition-colors shrink-0 shadow-2xs"
          >
            <Navigation className="h-3 w-3 text-electric-amber" />
            <span>Open in Maps</span>
          </a>
        </div>
      )}
    </div>
  );
}
