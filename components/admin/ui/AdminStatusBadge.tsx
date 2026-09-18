"use client";

import React from "react";
import { XCircle, Clock, Check } from "lucide-react";

export type AdminStatusType =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "new"
  | "contacted"
  | "resolved"
  | "archived"
  | "published"
  | "draft"
  | "active"
  | "inactive"
  | "popular"
  | "paid"
  | "unpaid"
  | "cod"
  | string;

interface AdminStatusBadgeProps {
  status: AdminStatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export default function AdminStatusBadge({
  status,
  label,
  showIcon = false,
  className = "",
}: AdminStatusBadgeProps) {
  const normalized = String(status).toLowerCase();

  let colorClasses = "bg-surface-hover text-tech-slate border-border-default";
  let icon: React.ReactNode = null;

  switch (normalized) {
    case "pending":
    case "new":
    case "draft":
    case "unpaid":
      colorClasses = "bg-warning-light text-warning-text border-warning-border";
      icon = <Clock className="h-3 w-3" />;
      break;

    case "confirmed":
    case "in_progress":
    case "cod":
      colorClasses = "bg-info-light text-info-text border-info-border";
      break;

    case "contacted":
      colorClasses = "bg-electric-amber/10 text-electric-amber border-electric-amber/20";
      break;

    case "completed":
    case "resolved":
    case "published":
    case "active":
    case "approved":
    case "true":
    case "paid":
      colorClasses = "bg-success-light text-success-text border-success-border";
      icon = <Check className="h-3 w-3" />;
      break;

    case "popular":
      colorClasses = "bg-warning-light text-warning-text border-warning-border font-extrabold";
      break;

    case "cancelled":
    case "rejected":
    case "archived":
    case "inactive":
    case "false":
      colorClasses = "bg-surface-hover text-text-muted border-border-default";
      icon = <XCircle className="h-3 w-3" />;
      break;

    default:
      colorClasses = "bg-surface-hover text-tech-slate border-border-default";
  }

  // Format label
  const displayLabel =
    label ||
    (normalized === "true"
      ? "Active"
      : normalized === "false"
      ? "Inactive"
      : normalized.replace(/_/g, " "));

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border select-none ${colorClasses} ${className}`}
    >
      {showIcon && icon}
      <span>{displayLabel}</span>
    </span>
  );
}
