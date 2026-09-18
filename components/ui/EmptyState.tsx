import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-dashed border-border-default bg-mist-gray/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clean-white border border-border-default text-text-muted shadow-2xs mb-4">
        <Icon className="h-7 w-7 stroke-[1.5]" />
      </div>

      <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-text-muted font-body max-w-md leading-relaxed">
        {description}
      </p>

      {actionLabel && (actionHref || onAction) && (
        <div className="mt-5">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center rounded-xl bg-tech-slate px-5 py-2.5 text-xs font-bold text-clean-white shadow-xs hover:bg-tech-slate-dark transition-all"
            >
              {actionLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center rounded-xl bg-tech-slate px-5 py-2.5 text-xs font-bold text-clean-white shadow-xs hover:bg-tech-slate-dark transition-all cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
