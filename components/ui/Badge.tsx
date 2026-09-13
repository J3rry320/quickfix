import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "amber" | "success" | "slate" | "outline";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses = {
  default: "bg-mist-gray text-tech-slate border border-border-default",
  accent: "bg-flash-orange/10 text-flash-orange border border-flash-orange/20",
  amber: "bg-electric-amber/15 text-tech-slate border border-electric-amber/30",
  success: "bg-success-green/10 text-success-green border border-success-green/20",
  slate: "bg-tech-slate text-clean-white",
  outline: "bg-transparent text-tech-slate border border-border-default",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[11px] font-semibold gap-1",
  md: "px-2.5 py-1 text-xs font-bold gap-1.5",
};

export default function Badge({
  variant = "default",
  size = "md",
  className = "",
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full tracking-tight select-none transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
