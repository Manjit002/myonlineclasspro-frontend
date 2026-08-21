import type { Metadata } from "next";
import {
  Building2,
  Clock,
  Users,
  Globe,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Our Offices & Contact",
  description:
    "How to reach us, our support hours, and where our operations and expert network are based.",
  alternates: { canonical: "/our-offices" },
};

const DETAILS = [
  {
    icon: Building2,
    title: "Primary Operations",
    body: "Our operations team coordinates every order, expert match, and deadline from a single central function.",
  },
  {
    icon: Clock,
    title: "Support Availability",
    body: "Support is reachable 24/7 for questions, order updates, and changes to work already underway.",
  },
  {
    icon: Users,
    title: "Expert Network",
    body: "Over 400 verified subject specialists working remotely across every major academic discipline.",
  },
  {
    icon: Globe,
    title: "Service Coverage",
    body: "We support students studying with institutions across the United States and internationally.",
  },
];

export default function OurOfficesPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="font-display text-text-primary text-4xl tracking-wide sm:text-5xl">
            Our Offices &amp; <span className="text-gold">Contact</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mx-auto mt-5 max-w-2xl text-base leading-relaxed">
            However you prefer to reach us, someone is available to help.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {DETAILS.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.title} delay={0.06 * i}>
                <Card className="h-full">
                  <div className="bg-gold-soft text-gold mb-4 flex h-11 w-11 items-center justify-center rounded-md">
                    <Icon size={22} aria-hidden />
                  </div>
                  <CardTitle>{d.title}</CardTitle>
                  <CardDescription>{d.body}</CardDescription>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-text-primary text-center text-3xl tracking-wide sm:text-4xl">
            Contact <span className="text-gold">Us</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="mt-10 flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="border-border bg-bg-2 text-text-secondary hover:border-gold/40 hover:text-gold flex items-center gap-3 rounded-md border px-5 py-4 text-sm transition-colors"
              >
                <Mail size={18} className="text-gold shrink-0" aria-hidden />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.phoneHref}
                className="border-border bg-bg-2 text-text-secondary hover:border-gold/40 hover:text-gold flex items-center gap-3 rounded-md border px-5 py-4 text-sm transition-colors"
              >
                <Phone size={18} className="text-gold shrink-0" aria-hidden />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-bg-2 text-text-secondary hover:border-gold/40 hover:text-gold flex items-center gap-3 rounded-md border px-5 py-4 text-sm transition-colors"
              >
                <MessageCircle
                  size={18}
                  className="text-gold shrink-0"
                  aria-hidden
                />
                WhatsApp {SITE.whatsapp}
              </a>
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
