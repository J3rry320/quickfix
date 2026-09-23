import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";

export interface ServiceCardItem {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  estimatedTimeMinutes?: number;
  startingPrice?: number;
  warrantyDays?: number;
  image?: string;
  isPopular?: boolean;
  icon?: string;
}

export interface ServiceCardProps {
  service: ServiceCardItem;
  href?: string;
  fromPriceLabel?: string;
  estimatedTimeLabel?: string;
  warrantyDaysLabel?: string;
  actionLabel?: string;
  className?: string;
  priority?: boolean;
}

export default function ServiceCard({
  service,
  href,
  fromPriceLabel,
  estimatedTimeLabel,
  warrantyDaysLabel,
  actionLabel,
  className = "",
  priority = false,
}: ServiceCardProps) {
  const categoryLabel = service.name.split("&")[0].trim();
  const targetHref = href || `/services/${service.slug}`;

  return (
    <Link
      href={targetHref}
      className={`p-4 sm:p-5 rounded-2xl bg-clean-white border border-border-default/90 hover:border-flash-orange/50 hover:shadow-md transition-all flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Service Image / Fallback Media Container */}
        <div className="relative mb-4 aspect-4/3 w-full overflow-hidden rounded-xl bg-gradient-to-br from-mist-gray to-border-default/60 border border-border-default flex items-center justify-center">
          {service.image && (
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Popular Tag Overlay */}
          {service.isPopular && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded-md bg-tech-slate/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-clean-white shadow-xs border border-clean-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-flash-orange" />
                Popular
              </span>
            </div>
          )}
        </div>

        {/* Category & Starting Price */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-flash-orange-text uppercase tracking-wider">
            {categoryLabel}
          </span>
          <span className="text-xs font-bold text-text-secondary">
            {fromPriceLabel ||
              (service.startingPrice !== undefined
                ? `from ₹${service.startingPrice}`
                : "")}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="font-heading text-base font-bold text-tech-slate group-hover:text-flash-orange-text transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* SLA & Warranty Footer */}
      <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-text-secondary font-medium">
          {service.estimatedTimeMinutes !== undefined && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-text-muted" />
              {estimatedTimeLabel || `${service.estimatedTimeMinutes} mins`}
            </span>
          )}
          {service.warrantyDays !== undefined && (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-success-text" />
              {warrantyDaysLabel || `${service.warrantyDays}-day warranty`}
            </span>
          )}
        </div>
        {actionLabel ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-flash-orange-text group-hover:translate-x-0.5 transition-transform">
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ArrowRight className="h-3.5 w-3.5 text-flash-orange-text group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </Link>
  );
}
