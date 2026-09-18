"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import AdminModal from "./AdminModal";

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: AdminConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      isSubmitting={submitting}
    >
      <div className="space-y-4 py-2">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDestructive
                ? "bg-error-light text-error border border-error-border"
                : "bg-warning-light text-warning border border-warning-border"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed pt-1">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-clean-white shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${
              isDestructive
                ? "bg-error hover:bg-error-text shadow-error/20"
                : "bg-flash-orange hover:bg-flash-orange-hover shadow-flash-orange/20"
            }`}
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
