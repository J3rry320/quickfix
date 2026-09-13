import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "white" | "muted" | "slate" | "surface";
  padding?: "tight" | "default" | "loose" | "none";
  className?: string;
  children: React.ReactNode;
}

const variantClasses = {
  white: "bg-clean-white text-tech-slate",
  muted: "bg-mist-gray/70 text-tech-slate border-y border-zinc-200/80",
  surface: "bg-elevated-surface text-tech-slate border-b border-zinc-200/80",
  slate: "bg-tech-slate text-clean-white",
};

const paddingClasses = {
  none: "",
  tight: "py-8 sm:py-12",
  default: "py-12 sm:py-16 lg:py-20",
  loose: "py-16 sm:py-24 lg:py-28",
};

export default function Section({
  variant = "white",
  padding = "default",
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`relative w-full ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
