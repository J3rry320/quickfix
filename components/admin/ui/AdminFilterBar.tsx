"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface FilterTab {
  label: string;
  value: string;
  count?: number;
}

interface AdminFilterBarProps {
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function AdminFilterBar({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  className = "",
}: AdminFilterBarProps) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center ${className}`}
    >
      {/* Tabs */}
      {tabs && tabs.length > 0 && onTabChange && (
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-clean-white border border-zinc-200 shadow-2xs">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-tech-slate text-clean-white shadow-2xs"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-tech-slate"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Right controls: search + optional extra dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {children}

        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-8 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden transition-colors shadow-2xs"
            />
            {search && search.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
