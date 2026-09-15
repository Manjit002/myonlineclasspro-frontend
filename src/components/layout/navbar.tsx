"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SOCIAL_LINKS } from "@/constants/socials";
import { LOGO_SRC } from "@/constants/images";
import { SERVICE_LINKS } from "@/constants/site";
import { ThemeToggle } from "@/components/theme-toggle";

/** Contact icons, lifted from the original top bar. */
const PHONE_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";
const WA_PATH =
  "M16 2C8.268 2 2 8.268 2 16c0 2.49.652 4.83 1.792 6.858L2 30l7.338-1.765A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.248 0-4.348-.6-6.15-1.646l-.44-.26-4.356 1.05 1.076-4.238-.286-.458A11.564 11.564 0 014.4 16C4.4 9.594 9.594 4.4 16 4.4S27.6 9.594 27.6 16 22.406 27.6 16 27.6zm6.348-8.72c-.348-.174-2.06-1.016-2.38-1.132-.318-.116-.55-.174-.78.174-.232.348-.9 1.132-1.1 1.364-.202.232-.404.26-.75.086-.35-.174-1.476-.544-2.81-1.734-1.04-.928-1.742-2.072-1.946-2.42-.204-.348-.022-.536.152-.708.158-.156.35-.406.524-.61.174-.202.232-.348.348-.58.116-.232.058-.434-.03-.61-.086-.174-.78-1.882-1.07-2.578-.282-.676-.568-.584-.78-.594-.202-.01-.434-.012-.666-.012-.232 0-.61.086-.928.434-.318.348-1.214 1.188-1.214 2.896 0 1.708 1.244 3.358 1.418 3.59.174.232 2.448 3.738 5.934 5.24.83.358 1.478.572 1.982.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.29-.812.29-1.508.204-1.656-.086-.144-.318-.232-.668-.406z";
const MAIL_PATH =
  "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z";
const LOGIN_PATH =
  "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z";

const MAIN_NAV = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "https://myonlineclasspro.com/blog", external: true },
  { label: "Reviews", href: "/reviews" },
  { label: "Experts", href: "/experts" },
  { label: "About", href: "/about" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Payment Policy", href: "/legal/payment-refund-policy" },
];

/* Login now lives inside this app at /login, not on the Spring Boot
   origin — that external link is what made auth feel like a separate site. */
const LOGIN_URL = "/login";

/**
 * Live expert counter.
 *
 * The original is not backed by an API -- it picks 42 + random(18) on
 * load and re-rolls every 5s. That's reproduced exactly, but the first
 * value is only generated after mount: rendering a random number during
 * SSR would produce different markup on server and client and trigger a
 * hydration mismatch. Until then it shows a stable placeholder.
 */
function useLiveCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const roll = () => setCount(42 + Math.floor(Math.random() * 18));
    roll();
    const id = setInterval(roll, 5000);
    return () => clearInterval(id);
  }, []);

  return count;
}

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const liveCount = useLiveCount();

  // Close the drawer on route change. Adjusted during render rather than
  // in an effect so the drawer never paints open over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="site-nav">
        {/* Top contact + social bar (desktop) */}
        <div className="nav-topbar">
          <div className="nav-topbar-left">
            <a className="nav-top-phone" href="tel:+15855222449">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d={PHONE_PATH} />
              </svg>
              +1 (585) 522-2449
            </a>
            <a
              className="nav-top-wa"
              href="https://wa.me/15818096586"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32" aria-hidden>
                <path fill="#25D366" d={WA_PATH} />
              </svg>
              WhatsApp +1 (581) 809-6586
            </a>
            <a
              className="nav-top-email"
              href="mailto:support@myonlineclasspro.com"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path fill="#4d8fff" d={MAIL_PATH} />
              </svg>
              support@myonlineclasspro.com
            </a>
          </div>
          <div className="nav-topbar-right">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                className={`nav-soc-link ${
                  {
                    Facebook: "fb",
                    X: "tw",
                    LinkedIn: "li",
                    YouTube: "yt",
                    Instagram: "ig",
                    Bluesky: "bsky",
                    Threads: "threads",
                    Tumblr: "tumblr",
                  }[s.name] ?? ""
                }`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
              >
                <svg viewBox={s.viewBox} aria-hidden>
                  {s.paths.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile contact strip — replaces the top bar below 900px */}
        <div className="mob-contacts">
          <a className="mob-contact-phone" href="tel:+15855222449">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d={PHONE_PATH} />
            </svg>
            Call Us
          </a>
          <a
            className="mob-contact-wa"
            href="https://wa.me/15818096586"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 32 32" aria-hidden>
              <path fill="#25D366" d={WA_PATH} />
            </svg>
            WhatsApp
          </a>
          <a
            className="mob-contact-email"
            href="mailto:support@myonlineclasspro.com"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d={MAIL_PATH} />
            </svg>
            Email
          </a>
        </div>

        {/* Main bar */}
        <div className="nav-mainbar">
          <Link
            href="/"
            className="nav-logo"
            aria-label="MyOnlineClassPro home"
          >
            <Image
              src={LOGO_SRC}
              alt="MyOnlineClassPro"
              width={42}
              height={42}
              priority
              unoptimized
            />
            <span className="nav-logo-text">
              MyOnlineClass<span>Pro</span>
            </span>
          </Link>

          <div className="nav-links">
            <div className="nav-drop-wrap">
              <button className="nav-drop-btn" aria-label="Services menu">
                Services{" "}
                <span className="nav-drop-chevron" aria-hidden>
                  ▾
                </span>
              </button>
              <div className="nav-dropdown">
                {SERVICE_LINKS.filter(
                  (s) => s.href !== "/take-my-online-exam",
                ).map((s) => (
                  <Link key={s.href} className="nav-dd-item sub" href={s.href}>
                    Take My {s.label.replace(" Class Help", "")} Class
                  </Link>
                ))}
                <div className="nav-dd-divider" />
                <Link className="nav-dd-item" href="/take-my-online-exam">
                  Take My Online Exam
                </Link>
                <Link className="nav-dd-item" href="/place-order">
                  Do My Assignment
                </Link>
              </div>
            </div>

            {MAIN_NAV.map((l) =>
              l.external ? (
                <a key={l.href} className="nav-link" href={l.href}>
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  className={["nav-link", isActive(l.href) && "active"]
                    .filter(Boolean)
                    .join(" ")}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>

          <div className="nav-actions">
            <div className="live-badge">
              <span className="live-dot" aria-hidden />
              {/* aria-live off: a count re-rolling every 5s would spam a
                  screen reader with meaningless updates. */}
              <span>{liveCount ?? "—"}</span>&nbsp;Experts Online
            </div>
            <ThemeToggle />
            <Link className="btn-login" href={LOGIN_URL}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d={LOGIN_PATH} />
              </svg>
              Log In
            </Link>
            <button
              className={["nav-hamburger", drawerOpen && "open"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={drawerOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="nav-drawer-backdrop show"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={["nav-drawer", drawerOpen && "open"]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!drawerOpen}
      >
        <div className="drawer-head">
          <span className="nav-logo-text" style={{ fontSize: "1rem" }}>
            MyOnlineClass<span>Pro</span>
          </span>
          <button
            className="nav-hamburger open"
            style={{ display: "flex" }}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="drawer-label">Services</div>
        {SERVICE_LINKS.map((s) => (
          <Link key={s.href} className="drawer-link drawer-sub" href={s.href}>
            {s.label}
          </Link>
        ))}

        <div className="drawer-label">Explore</div>
        {MAIN_NAV.map((l) =>
          l.external ? (
            <a key={l.href} className="drawer-link" href={l.href}>
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              className={["drawer-link", isActive(l.href) && "active"]
                .filter(Boolean)
                .join(" ")}
              href={l.href}
            >
              {l.label}
            </Link>
          ),
        )}

        <div
          style={{
            padding: "16px 20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <ThemeToggle />
          <a
            className="btn-login"
            href={LOGIN_URL}
            style={{ justifyContent: "center" }}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d={LOGIN_PATH} />
            </svg>
            Log In
          </a>
        </div>
      </aside>
    </>
  );
}
