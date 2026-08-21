import type { Metadata } from "next";
import Link from "next/link";
import { Users, Target, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Who we are, how we work, and why students trust us with their online coursework.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: Users,
    title: "Real, Verified Experts",
    body: "Every expert is vetted for subject knowledge and academic background before they take a single order.",
  },
  {
    icon: Target,
    title: "Consistent Results",
    body: "Clear expectations, tracked progress, and a grade guarantee behind every course we take on.",
  },
  {
    icon: HeartHandshake,
    title: "Support That Answers",
    body: "Reachable around the clock — for questions, updates, or changes to an order already underway.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="font-display text-text-primary text-4xl tracking-wide sm:text-5xl">
            Built for <span className="text-gold">Students</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mx-auto mt-5 max-w-2xl text-base leading-relaxed">
            {SITE.name} exists to take the pressure off students juggling online
            coursework alongside work and life. We pair you with a verified
            academic expert in your subject, keep you updated throughout, and
            stand behind the outcome.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-text-primary text-center text-3xl tracking-wide sm:text-4xl">
            Our <span className="text-gold">Approach</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={0.06 * i}>
                <Card className="h-full">
                  <div className="bg-gold-soft text-gold mb-4 flex h-11 w-11 items-center justify-center rounded-md">
                    <Icon size={22} aria-hidden />
                  </div>
                  <CardTitle>{v.title}</CardTitle>
                  <CardDescription>{v.body}</CardDescription>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border bg-bg-1 rounded-lg border px-6 py-14 text-center">
            <h2 className="font-display text-text-primary text-3xl tracking-wide sm:text-4xl">
              Get <span className="text-gold">Started</span>
            </h2>
            <p className="text-text-secondary mx-auto mt-3 max-w-xl">
              Tell us about your course and we&apos;ll take it from there.
            </p>
            <Link href="/place-order" className="mt-8 inline-block">
              <Button size="lg">Place your order</Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
