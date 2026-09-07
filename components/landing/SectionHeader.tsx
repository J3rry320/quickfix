import React from "react";

export interface SectionHeaderProps {
  /** The primary heading text or elements */
  title: React.ReactNode;
  /** Optional descriptive subtitle or summary text */
  subtitle?: React.ReactNode;
  /** Header alignment: 'center' (default) or 'left' */
  align?: "center" | "left";
  /** Optional right-aligned action or badge (used in split header layouts) */
  action?: React.ReactNode;
  /** Container CSS class overrides */
  className?: string;
  /** Title CSS class overrides */
  titleClassName?: string;
  /** Subtitle CSS class overrides */
  subtitleClassName?: string;
  /** Additional content placed below the subtitle (e.g. filter pills, buttons) */
  children?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  align = "center",
  action,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  children,
}: SectionHeaderProps) {
  const isCenter = align === "center" && !action;

  if (action) {
    return (
      <div
        className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 ${className}`}
      >
        <div className="max-w-2xl">
          <h2
            className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight ${titleClassName}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-2 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed ${subtitleClassName}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0">{action}</div>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${
        isCenter ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl"
      } mb-8 sm:mb-12 ${className}`}
    >
      <h2
        className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm sm:text-base text-zinc-600 font-body leading-relaxed ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
