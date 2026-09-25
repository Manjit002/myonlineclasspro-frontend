"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Wallet,
  CreditCard,
  CalendarDays,
  FolderOpen,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";
import { getToken, logout } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMounted } from "@/hooks/use-mounted";
import { getProfile } from "@/services/student-service";
import type { StudentProfile } from "@/types/dashboard";

const NAV = [
  {
    section: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
      { href: "/dashboard/orders", label: "My Orders", Icon: Package },
    ],
  },
  {
    section: "Finance",
    items: [
      { href: "/dashboard/wallet", label: "Wallet", Icon: Wallet },
      { href: "/dashboard/payments", label: "Payments", Icon: CreditCard },
    ],
  },
  {
    section: "Planner",
    items: [
      { href: "/dashboard/deadlines", label: "Deadlines", Icon: CalendarDays },
    ],
  },
  {
    section: "Files",
    items: [{ href: "/dashboard/files", label: "My Files", Icon: FolderOpen }],
  },
  {
    section: "Account",
    items: [
      {
        href: "/dashboard/place-order",
        label: "Place New Order",
        Icon: PlusCircle,
      },
      { href: "/dashboard/profile", label: "My Profile", Icon: User },
    ],
  },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "My Orders",
  "/dashboard/wallet": "Wallet",
  "/dashboard/payments": "Payments",
  "/dashboard/deadlines": "Deadlines",
  "/dashboard/files": "My Files",
  "/dashboard/place-order": "Place New Order",
  "/dashboard/profile": "My Profile",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  // The JWT lives in localStorage, which the server can't read, so auth is
  // derived after mount rather than written into state from an effect.
  const mounted = useMounted();
  const authed = mounted ? Boolean(getToken()) : null;

  useEffect(() => {
    if (!mounted) return;
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    getProfile().then((r) => {
      if (r.ok) {
        setProfile(r.data);
        if (r.data?.id) localStorage.setItem("userId", String(r.data.id));
        if (r.data?.email) localStorage.setItem("userEmail", r.data.email);
      }
    });
  }, [router, mounted]);

  // Lock background scroll and support Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Edge-swipe opens, swipe-left closes — matching the original gestures.
  const touch = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const start = (e: TouchEvent) => {
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = Math.abs(e.changedTouches[0].clientY - touch.current.y);
      if (touch.current.x < 28 && dx > 60 && dy < 60) setOpen(true);
      if (dx < -80 && dy < 60) setOpen(false);
    };
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    return () => {
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchend", end);
    };
  }, []);

  const refresh = useCallback(() => router.refresh(), [router]);

  if (authed === null) {
    return (
      <div className="db-boot">
        <span className="db-spinner" aria-hidden />
        <span className="sr-only">Loading your dashboard…</span>
      </div>
    );
  }
  if (!authed) return null;

  const name = profile?.name || profile?.email?.split("@")[0] || "Student";
  const title =
    TITLES[pathname] ??
    (pathname.includes("/orders/") ? "Order Details" : "Dashboard");

  return (
    <div className="db-root">
      {open && (
        <button
          className="db-overlay"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={["db-sidebar", open && "is-open"].filter(Boolean).join(" ")}
      >
        <div className="db-sb-logo">
          <span className="db-sb-brand">
            MyOnlineClass<span className="text-gold">Pro</span>
          </span>
          <button
            className="db-sb-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <Link
          href="/dashboard/profile"
          className="db-sb-user"
          onClick={() => setOpen(false)}
        >
          <span className="db-avatar" aria-hidden>
            {name[0]?.toUpperCase()}
          </span>
          <span className="db-sb-user-txt">
            <span className="db-sb-name">{name}</span>
            <span className="db-sb-mail">
              {profile?.email || "Student Account"}
            </span>
          </span>
        </Link>

        <nav className="db-nav">
          {NAV.map((g) => (
            <div key={g.section}>
              <p className="db-nav-title">{g.section}</p>
              {g.items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={["db-nav-item", pathname === href && "is-active"]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon size={17} aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="db-sb-bottom">
          <button className="db-logout" onClick={logout}>
            <LogOut size={16} aria-hidden /> Logout
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button
              className="db-menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="db-topbar-title">{title}</h1>
          </div>
          <div className="db-topbar-right">
            {/* The site navbar no longer renders here, so the existing
                theme toggle moves into the dashboard's own top bar. Same
                component and same provider — not a second theme system. */}
            <ThemeToggle />
            <Link
              href="/dashboard/place-order"
              className="db-btn-primary db-hide-sm"
            >
              <PlusCircle size={15} aria-hidden /> Place New Order
            </Link>
            <button
              className="db-btn-ghost"
              onClick={refresh}
              aria-label="Refresh data"
            >
              <RefreshCw size={15} aria-hidden />
            </button>
            <span className="db-topbar-mail db-hide-md">{profile?.email}</span>
          </div>
        </header>
        <main className="db-content">{children}</main>
      </div>
    </div>
  );
}
