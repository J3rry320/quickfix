"use client";

import React, { useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  error?: string | null;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = "lg",
  children,
  footer,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Changes",
  cancelText = "Cancel",
  error,
}: AdminModalProps) {
  // Listen for Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div>{children}</div>

      {/* Default footer if onSubmit provided and no custom footer */}
      {footer !== undefined ? (
        footer
      ) : onSubmit ? (
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{submitText}</span>
          </button>
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} rounded-2xl bg-clean-white p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 pb-3 shrink-0">
          <div className="min-w-0 pr-3">
            <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-zinc-500 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
          {onSubmit ? (
            <form onSubmit={onSubmit}>{content}</form>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
