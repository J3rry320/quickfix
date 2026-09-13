"use client";

import React from "react";
import { XCircle, Clock, Check } from "lucide-react";

export type AdminStatusType =
  | "pending"
  | "confirmed"
  | "technician_assigned"
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

  let colorClasses = "bg-zinc-100 text-zinc-700 border-zinc-200";
  let icon: React.ReactNode = null;

  switch (normalized) {
    case "pending":
    case "new":
    case "draft":
    case "unpaid":
      colorClasses = "bg-amber-100 text-amber-800 border-amber-200";
      icon = <Clock className="h-3 w-3" />;
      break;

    case "confirmed":
    case "technician_assigned":
    case "in_progress":
    case "cod":
      colorClasses = "bg-blue-100 text-blue-800 border-blue-200";
      break;

    case "contacted":
      colorClasses = "bg-purple-100 text-purple-800 border-purple-200";
      break;

    case "completed":
    case "resolved":
    case "published":
    case "active":
    case "true":
    case "paid":
      colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
      icon = <Check className="h-3 w-3" />;
      break;

    case "popular":
      colorClasses = "bg-amber-100 text-amber-800 border-amber-200 font-extrabold";
      break;

    case "cancelled":
    case "archived":
    case "inactive":
    case "false":
      colorClasses = "bg-zinc-100 text-zinc-600 border-zinc-200";
      icon = <XCircle className="h-3 w-3" />;
      break;

    default:
      colorClasses = "bg-zinc-100 text-zinc-700 border-zinc-200";
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
