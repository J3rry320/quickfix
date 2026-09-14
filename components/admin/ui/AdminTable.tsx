"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react";

export interface AdminTableColumn {
  key: string;
  label: string;
  className?: string;
  align?: "left" | "center" | "right";
}

interface AdminTableProps {
  columns: AdminTableColumn[];
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  skeletonRows?: number;
  children: React.ReactNode;
  className?: string;
  tableClassName?: string;
}

export default function AdminTable({
  columns,
  loading = false,
  empty = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching the current filter criteria.",
  skeletonRows = 5,
  children,
  className = "",
  tableClassName = "",
}: AdminTableProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto [scrollbar-width:thin] touch-pan-x">
        <table className={`w-full text-left text-xs ${tableClassName}`}>
          <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 sm:px-5 py-3.5 whitespace-nowrap ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length} className="px-5 py-4">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : empty ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8">
                  <EmptyState
                    icon={Inbox}
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-0 bg-transparent py-4"
                  />
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
