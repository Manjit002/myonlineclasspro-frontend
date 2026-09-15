"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/constants/socials";
import { LOGO_SRC } from "@/constants/images";
import { FooterWatermark } from "@/components/layout/footer-watermark";

/**
 * Footer ported from the original index.html (.nf-* markup).
 *
 * Structure, copy, link sets, contact details, disclaimer and the eight
 * brand-coloured social tiles are the originals -- not a generic
 * rebuild. Internal destinations use next/link so they client-navigate
 * instead of doing a full page load; external ones stay plain anchors.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="nf-wrap">
      <div className="nf-body">
        {/* Floating logo badge */}
        <div className="nf-float" aria-hidden="true">
          <div className="nf-float-logo">
            <Image
              src={LOGO_SRC}
              alt=""
              width={88}
              height={88}
              unoptimized
              loading="lazy"
            />
          </div>
          <div className="nf-float-tip" />
        </div>

        <button
          type="button"
          className="nf-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <span className="nf-top-label">Back to</span>
          <span className="nf-top-word">TOP</span>
          <span className="nf-top-arrow" aria-hidden>
            &#8593;
          </span>
        </button>

        <div className="site-container">
          <div className="nf-cols">
            {/* Services */}
            <div className="nf-col">
              <h2 className="nf-col-head">Services</h2>
              <div className="nf-col-links">
                <Link className="nf-col-link" href="/take-my-online-exam">
                  Take My Online Exam
                </Link>
                <Link className="nf-col-link" href="/place-order">
                  Do My Assignment
                </Link>
                <Link className="nf-col-link" href="/take-my-chemistry-class">
                  Chemistry Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-biology-class">
                  Biology Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-math-class">
                  Math Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-nursing-class">
                  Nursing Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-accounting-class">
                  Accounting Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-finance-class">
                  Finance Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-sophia-class">
                  Sophia Class Help
                </Link>
                <Link
                  className="nf-col-link"
                  href="/take-my-computer-science-class"
                >
                  Computer Science Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-wgu-class">
                  WGU Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-database-class">
                  Database Class Help
                </Link>
                <Link className="nf-col-link" href="/take-my-management-class">
                  Management Class Help
                </Link>
              </div>
            </div>

            {/* Explore */}
            <div className="nf-col">
              <h2 className="nf-col-head">Explore</h2>
              <div className="nf-col-links">
                <Link className="nf-col-link" href="/about">
                  About Us
                </Link>
                <Link className="nf-col-link" href="/how-it-works">
                  How It Works
                </Link>
                <Link className="nf-col-link" href="/pricing">
                  Pricing
                </Link>
                <a
                  className="nf-col-link"
                  href="https://myonlineclasspro.com/blog"
                >
                  Blog
                </a>
                <Link className="nf-col-link" href="/reviews">
                  Reviews
                </Link>
                <Link className="nf-col-link" href="/experts">
                  Experts
                </Link>
                <Link className="nf-col-link" href="/login">
                  Student Login
                </Link>
                <Link className="nf-col-link" href="/legal/terms">
                  Terms of Service
                </Link>
                <Link
                  className="nf-col-link"
                  href="/legal/payment-refund-policy"
                >
                  Payment Policy
                </Link>
                <Link className="nf-col-link" href="/legal/privacy">
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="nf-col">
              <h2 className="nf-col-head">Contact</h2>
              <a className="nf-contact-item phone" href="tel:+15855222449">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +1 (585) 522-2449
              </a>
              <a
                className="nf-contact-item wa"
                href="https://wa.me/15818096586"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 32 32" aria-hidden>
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.652 4.83 1.792 6.858L2 30l7.338-1.765A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.248 0-4.348-.6-6.15-1.646l-.44-.26-4.356 1.05 1.076-4.238-.286-.458A11.564 11.564 0 014.4 16C4.4 9.594 9.594 4.4 16 4.4S27.6 9.594 27.6 16 22.406 27.6 16 27.6zm6.348-8.72c-.348-.174-2.06-1.016-2.38-1.132-.318-.116-.55-.174-.78.174-.232.348-.9 1.132-1.1 1.364-.202.232-.404.26-.75.086-.35-.174-1.476-.544-2.81-1.734-1.04-.928-1.742-2.072-1.946-2.42-.204-.348-.022-.536.152-.708.158-.156.35-.406.524-.61.174-.202.232-.348.348-.58.116-.232.058-.434-.03-.61-.086-.174-.78-1.882-1.07-2.578-.282-.676-.568-.584-.78-.594-.202-.01-.434-.012-.666-.012-.232 0-.61.086-.928.434-.318.348-1.214 1.188-1.214 2.896 0 1.708 1.244 3.358 1.418 3.59.174.232 2.448 3.738 5.934 5.24.83.358 1.478.572 1.982.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.29-.812.29-1.508.204-1.656-.086-.144-.318-.232-.668-.406z" />
                </svg>
                WhatsApp +1 (581) 809-6586
              </a>
              <a
                className="nf-contact-item email"
                href="mailto:support@myonlineclasspro.com"
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                support@myonlineclasspro.com
              </a>
              <div className="nf-col-links" style={{ marginTop: 14 }}>
                <Link className="nf-col-link" href="/legal/consumer-feedback">
                  Consumer Feedback
                </Link>
                <Link className="nf-col-link" href="/legal/complaints-policy">
                  Complaints Policy
                </Link>
                <Link className="nf-col-link" href="/our-offices">
                  Our Offices
                </Link>
              </div>
            </div>

            {/* Connect */}
            <div className="nf-col">
              <h2 className="nf-col-head">Connect With Us</h2>
              <a className="nf-phone-num" href="tel:+15855222449">
                +1 (585) 522-2449
              </a>
              <a
                className="nf-phone-num"
                href="https://wa.me/15818096586"
                target="_blank"
                rel="noopener noreferrer"
              >
                +1 (581) 809-6586
              </a>
              <a
                className="nf-email-link"
                href="mailto:support@myonlineclasspro.com"
              >
                support@myonlineclasspro.com
              </a>
              <div className="nf-connect-label">Follow Us</div>
              <div className="nf-socials">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    className="nf-soc"
                    data-net={s.name}
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
          </div>
        </div>
        <div className="site-container nf-disclaimer">
          <strong>Disclaimer:</strong> The reference papers provided by
          MyOnlineClassPro serve as model papers for students and are not to be
          submitted as-is. These papers are intended to be used for research and
          reference purposes only.
        </div>
      </div>

      <div className="nf-bottom">
        <div
          className="site-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="nf-copy">
            &#169; {year} MyOnlineClassPro. All Rights Reserved.
          </span>
          <div className="nf-bottom-links">
            <Link className="nf-bottom-link" href="/legal/privacy">
              Privacy Policy
            </Link>
            <Link className="nf-bottom-link" href="/legal/terms">
              Terms of Use
            </Link>
            <Link
              className="nf-bottom-link"
              href="/legal/payment-refund-policy"
            >
              Payment Policy
            </Link>
            <Link className="nf-bottom-link" href="/legal/cookie-policy">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
      <FooterWatermark />
    </footer>
  );
}
