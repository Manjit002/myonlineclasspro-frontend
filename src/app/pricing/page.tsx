import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PRICING_TIERS } from "@/constants/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "online class help pricing",
    "cost to take my online class",
    "affordable class help rates",
    "pay someone for online class",
  ],
  title: { absolute: "Online Class Help Pricing & Rates | MyOnlineClassPro" },
  description:
    "Transparent pricing for single tasks, weekly help, or full course support — with no hidden fees.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageSchema
        path="/pricing"
        title={"Online Class Help Pricing & Rates | MyOnlineClassPro"}
        description={
          "Transparent, affordable pricing for online class help. Full course from $299, weekly help from $100, single assignments from $15. B grade guaranteed."
        }
        type="WebPage"
        breadcrumbs={[{ name: "Pricing", path: "/pricing" }]}
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="page-h text-text-primary">
            Simple, Transparent <span className="text-gold">Pricing</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mx-auto mt-4 max-w-xl text-center">
            Pick the level of support that matches your workload. No hidden
            fees, no surprises.
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={0.07 * i}>
              <div
                className={cn(
                  "bg-bg-2 relative flex h-full flex-col rounded-lg border p-7",
                  tier.featured
                    ? "border-gold/50 shadow-[0_0_0_1px_var(--gold-soft)]"
                    : "border-border",
                )}
              >
                {tier.featured && (
                  <span className="bg-gold text-gold-foreground absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-bold">
                    Most Popular
                  </span>
                )}
                <h2 className="card-h text-text-primary">{tier.name}</h2>
                <p className="text-text-muted mt-2 text-sm">{tier.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display gold-gradient-text text-4xl tracking-wide">
                    {tier.price}
                  </span>
                  <span className="text-text-muted text-sm">
                    {tier.cadence}
                  </span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="text-text-secondary flex items-start gap-2 text-sm"
                    >
                      <Check
                        size={16}
                        className="text-gold mt-0.5 shrink-0"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/place-order" className="mt-8 block">
                  <Button
                    variant={tier.featured ? "primary" : "secondary"}
                    className="w-full"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
