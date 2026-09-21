import React from "react";
import Container from "./Container";
import Breadcrumbs, { BreadcrumbItem } from "./Breadcrumbs";

export interface PageHeroHighlight {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  color?: string;
}

export interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  highlights?: PageHeroHighlight[];
  actions?: React.ReactNode;
  media?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function PageHero({
  breadcrumbs,
  title,
  subtitle,
  highlights,
  actions,
  media,
  align = "left",
  className = "",
}: PageHeroProps) {
  const isCentered = align === "center" || (!media && align !== "left");

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-mist-gray/90 via-clean-white to-clean-white border-b border-border-default pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pb-20 ${className}`}
    >
      <Container>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={`mb-6 sm:mb-8 ${isCentered ? "flex justify-center" : ""}`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {isCentered ? (
          /* Centered Single-Column Layout */
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-tech-slate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-text-muted leading-relaxed">
                {subtitle}
              </p>
            )}

            {highlights && highlights.length > 0 && (
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mx-auto max-w-2xl">
                {highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-clean-white px-3 py-1.5 text-xs font-medium text-tech-slate border border-border-default/90 shadow-2xs hover:border-flash-orange/40 transition-all whitespace-nowrap"
                    >
                      {Icon && (
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${h.color || "text-flash-orange"}`}
                        />
                      )}
                      <span className="text-text-muted">{h.label}</span>
                      {h.value && (
                        <strong className="font-bold text-tech-slate">
                          {h.value}
                        </strong>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {actions && <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-4">{actions}</div>}

            {media && <div className="mt-10 mx-auto max-w-4xl">{media}</div>}
          </div>
        ) : (
          /* Left-Aligned / Two-Column Responsive Layout */
          <div className={media ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" : "max-w-4xl"}>
            <div className={media ? "lg:col-span-7" : "w-full"}>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-tech-slate">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-4 sm:mt-5 text-base sm:text-lg text-text-muted leading-relaxed">
                  {subtitle}
                </p>
              )}

              {highlights && highlights.length > 0 && (
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {highlights.map((h, i) => {
                    const Icon = h.icon;
                    return (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-clean-white px-3 py-1.5 text-xs font-medium text-tech-slate border border-border-default/90 shadow-2xs hover:border-flash-orange/40 transition-all whitespace-nowrap"
                      >
                        {Icon && (
                          <Icon
                            className={`h-3.5 w-3.5 shrink-0 ${h.color || "text-flash-orange"}`}
                          />
                        )}
                        <span className="text-text-muted">{h.label}</span>
                        {h.value && (
                          <strong className="font-bold text-tech-slate">
                            {h.value}
                          </strong>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {actions && <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4">{actions}</div>}
            </div>

            {media && <div className="lg:col-span-5">{media}</div>}
          </div>
        )}
      </Container>
    </section>
  );
}
