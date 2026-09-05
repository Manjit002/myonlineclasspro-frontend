import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Shown when a request succeeds but returns nothing to display. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border-strong bg-bg-1 flex flex-col items-center rounded-lg border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <div className="bg-bg-3 text-text-muted flex h-12 w-12 items-center justify-center rounded-full">
        <Inbox size={22} aria-hidden />
      </div>
      <h3 className="font-display text-text-primary mt-4 text-xl tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="text-text-secondary mt-2 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
