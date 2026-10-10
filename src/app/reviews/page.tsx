import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { ReviewStats } from "@/components/reviews/review-stats";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { OG_DEFAULTS } from "@/constants/seo";

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "myonlineclasspro reviews",
    "student testimonials",
    "online class help reviews",
    "verified student feedback",
    "take my class reviews",
    "academic help ratings",
  ],
  title: "Student Reviews & Testimonials",
  description:
    "Read verified reviews from real students who used MyOnlineClassPro. See ratings, feedback, and results from our online class help and tutoring services.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Student Reviews & Testimonials | MyOnlineClassPro",
    description:
      "Read verified reviews from real students who used MyOnlineClassPro.",
    url: "/reviews",
  },
};

const TRUST = [
  { t: "A Grade Guarantee", s: "or Money Back" },
  { t: "100% Human Experts", s: "No AI, No Bots" },
  { t: "Secure & Confidential", s: "Your Privacy Matters" },
  { t: "Flexible Payments", s: "Installments Available" },
];

export default function ReviewsPage() {
  return (
    <>
      <PageSchema
        path="/reviews"
        title={"Student Reviews & Testimonials | MyOnlineClassPro"}
        description={
          "Read verified reviews from real students who used MyOnlineClassPro. See ratings, feedback, and results from our online class help and tutoring services."
        }
        type="WebPage"
        breadcrumbs={[{ name: "Reviews", path: "/reviews" }]}
      />
      <>
        {/* Hero + static showcase stats */}
        <section className="rv-hero">
          <div className="site-container">
            <Reveal>
              <span className="rv-badge">Real Reviews. Real Results.</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="rv-h1">
                Student <span className="text-gold">Reviews</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="rv-lead">
                Verified feedback from students who used our online class help
                and tutoring services.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ReviewStats />
            </Reveal>
          </div>
        </section>

        {/* Reviews */}
        <section className="rv-listing">
          <div className="site-container">
            <ReviewList />
          </div>
        </section>

        {/* Submit */}
        <section className="rv-submit-section">
          <div className="site-container">
            <Reveal>
              <h2 className="rv-h2">
                Share Your <span className="text-gold">Experience</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="rv-lead">
                Your review helps other students choose with confidence.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <ReviewForm />
            </Reveal>
          </div>
        </section>

        {/* Trust */}
        <section className="rv-trust-section">
          <div className="site-container">
            <ul className="rv-trust-row">
              {TRUST.map((t, i) => (
                <Reveal key={t.t} delay={0.05 * i}>
                  <li className="rv-trust-item">
                    <span className="rv-trust-icon" aria-hidden>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <p className="rv-trust-t">{t.t}</p>
                    <p className="rv-trust-s">{t.s}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </>
    </>
  );
}
