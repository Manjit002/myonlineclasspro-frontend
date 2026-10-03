import Link from "next/link";
import Image from "next/image";
import { PAYMENT_ICONS } from "@/constants/images";
import { PRICING_SECTION_ITEMS } from "@/constants/pricing";

/**
 * Pricing section — ported from the original index.html.
 *
 * One dark container holding a price grid with internal dividers,
 * rather than separate floating tier cards. Badges, guarantees and the
 * payment strip are the originals; prices now come from the shared
 * pricing source so this section and the order form cannot disagree.
 */
const GUARANTEES = [
  "Money-back guarantee",
  "No hidden charges",
  "Expert in 10 minutes",
  "Grade B or higher guaranteed",
];

export function PricingCard() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="site-container pricing-inner">
        <div className="pricing-head">
          <div className="pricing-eyebrow">Transparent Pricing</div>
          <h2 className="pricing-h2">
            The Best <span className="gold">Price Offer</span> You&apos;ve Seen
          </h2>
          <p className="pricing-sub">
            No hidden charges. No surprises. Just guaranteed results at prices
            that won&apos;t break the bank.
          </p>
        </div>

        <div className="pricing-card">
          <div className="pc-header">
            <div className="pc-title">Simple, Transparent Pricing</div>
            <div className="pc-badges">
              <div className="pc-badge green">Money-Back Guarantee</div>
              <div className="pc-badge blue">No Hidden Charges</div>
            </div>
          </div>

          {/* Prices are a description list semantically: each service is a
              term and its rate is the definition. The grid layout comes
              from CSS, so this stays meaningful to screen readers. */}
          <dl className="pc-prices">
            {PRICING_SECTION_ITEMS.map((p) => (
              <div key={p.id} className="pc-price-item">
                <dt className="pc-service">{p.label}</dt>
                <dd className="pc-amount">${p.price}</dd>
                <dd className="pc-unit">{p.unit}</dd>
              </div>
            ))}
          </dl>

          <div className="pc-cta-row">
            <div className="pc-guarantees">
              {GUARANTEES.map((g) => (
                <div key={g} className="pc-guarantee">
                  {g}
                </div>
              ))}
            </div>
            <Link className="pc-order-btn" href="/place-order">
              Order Now
            </Link>
          </div>

          <div className="pc-payments">
            <div className="pc-pay-label">We Accept:</div>
            <div className="pc-pay-logos">
              {PAYMENT_ICONS.map((icon) => (
                <div key={icon.src} className="pc-pay-logo" title={icon.alt}>
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={44}
                    height={30}
                    loading="lazy"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
