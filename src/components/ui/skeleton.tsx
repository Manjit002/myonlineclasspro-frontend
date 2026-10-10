import { cn } from "@/lib/utils";

/**
 * Placeholder block for content that hasn't loaded yet. Marked
 * aria-hidden because the shimmer conveys nothing to a screen reader --
 * announce loading state with a live region or sr-only text instead.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("bg-bg-3 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

/** Matching skeleton for the Card component's shape. */
export function CardSkeleton() {
  return (
    <div className="border-border bg-bg-2 rounded-lg border p-6">
      <Skeleton className="h-11 w-11 rounded-md" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}
