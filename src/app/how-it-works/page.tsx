import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { HOW_IT_WORKS_STEPS, TRUST_POINTS } from "@/constants/content";

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "how online class help works",
    "hire someone to take my class",
    "online class help process",
    "academic expert assignment",
  ],
  title: { absolute: "How It Works - Hire Someone to Take Your Online Class" },
  description:
    "Five simple steps from placing your order to receiving your grades.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageSchema
        path="/how-it-works"
        title={"How It Works - Hire Someone to Take Your Online Class"}
        description={
          "See how MyOnlineClassPro works. Place order, get expert assigned in 10 minutes, track progress, receive top grades."
        }
        type="WebPage"
        breadcrumbs={[{ name: "How It Works", path: "/how-it-works" }]}
      />
      <>
        <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h1 className="page-h text-text-primary">
              How It <span className="text-gold">Works</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-text-secondary mx-auto mt-4 max-w-xl text-center">
              From your first message to your final grade, here&apos;s exactly
              what happens.
            </p>
          </Reveal>

          <ol className="mt-14 flex flex-col gap-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={0.06 * i}>
                <li className="border-border bg-bg-2 flex gap-5 rounded-lg border p-6">
                  <span
                    aria-hidden
                    className="bg-gold-soft font-display text-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="card-h text-text-primary">{step.title}</h2>
                    <p className="text-text-secondary mt-1.5 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="section-h text-text-primary">
              Built on <span className="text-gold">Trust</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={0.06 * i}>
                <Card className="h-full">
                  <div className="bg-gold-soft text-gold mb-4 flex h-11 w-11 items-center justify-center rounded-md">
                    <ShieldCheck size={22} aria-hidden />
                  </div>
                  <CardTitle>{point.title}</CardTitle>
                  <CardDescription>{point.body}</CardDescription>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 text-center">
              <Link href="/place-order">
                <Button size="lg">Place your order</Button>
              </Link>
            </div>
          </Reveal>
        </section>
      </>
    </>
  );
}
