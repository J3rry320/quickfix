import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle2, Star, Smartphone, Wrench, Camera } from "lucide-react";
import SectionHeader from "@/components/landing/SectionHeader";
import { TESTIMONIALS_DATA } from "@/config/testimonials";

export default function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-border-default">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("reviewsCount")}
          className="mb-10 sm:mb-14"
        />

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="relative rounded-2xl bg-mist-gray/60 border border-border-default p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-flash-orange/40 transition-all group"
            >
              <div>
                {/* Media Container (16:9 Aspect Ratio) for Real Repair Picture/Video */}
                <div className="relative mb-4 aspect-16/9 w-full overflow-hidden rounded-xl bg-clean-white border border-border-default/80 flex items-center justify-center shadow-2xs">
                  {rev.mediaPath ? (
                    rev.mediaType === "video" ? (
                      <video
                        src={rev.mediaPath}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={rev.mediaPath}
                        alt={`${rev.deviceModel} doorstep repair`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 select-none">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mb-2">
                        <Camera className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-tech-slate">
                        {rev.deviceModel}
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5">
                        {rev.serviceType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Device & Service Tag Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-clean-white px-2.5 py-1 text-2xs font-bold text-tech-slate border border-border-default">
                    <Smartphone className="h-3 w-3 text-flash-orange" />
                    {rev.deviceModel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-clean-white px-2 py-1 text-2xs font-medium text-text-secondary border border-border-default">
                    <Wrench className="h-2.5 w-2.5 text-electric-amber" />
                    {rev.serviceType}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-2.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-electric-amber text-electric-amber"
                    />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Customer Info Footer */}
              <div className="pt-3.5 border-t border-border-default/80 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tech-slate text-clean-white font-heading font-extrabold text-xs shrink-0 shadow-2xs">
                  {rev.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-tech-slate">
                      {rev.name}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-flash-orange" />
                  </div>
                  <p className="text-[11px] text-text-muted font-medium leading-tight">
                    {rev.role} • {rev.area}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
