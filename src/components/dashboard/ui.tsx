"use client";

import type { ReactNode } from "react";

/** Shared dashboard primitives, so panels don't each re-invent them. */

export function Card({
  title,
  action,
  children,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="db-card">
      {(title || action) && (
        <header className="db-card-head">
          <h2 className="db-card-title">{title}</h2>
          {action}
        </header>
      )}
      <div className="db-card-body">{children}</div>
    </section>
  );
}

export function Skeleton({ h = 48, mb = 8 }: { h?: number; mb?: number }) {
  return (
    <div className="db-skeleton" style={{ height: h, marginBottom: mb }} />
  );
}

export function Spinner() {
  return <span className="db-spinner" aria-hidden />;
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="db-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="db-link-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({
  icon,
  title,
  sub,
  children,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  /** Optional CTA. Only pass actions that actually exist in the app. */
  children?: ReactNode;
}) {
  return (
    <div className="db-empty">
      <div className="db-empty-icon" aria-hidden>
        {icon}
      </div>
      <p className="db-empty-title">{title}</p>
      {sub && <p className="db-empty-sub">{sub}</p>}
      {children && <div className="db-empty-cta">{children}</div>}
    </div>
  );
}

export function Alert({
  kind,
  children,
}: {
  kind: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      className={`db-alert db-alert-${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
