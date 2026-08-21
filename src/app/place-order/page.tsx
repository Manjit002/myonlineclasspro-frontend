import type { Metadata } from "next";
import { OrderForm } from "@/components/sections/order-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Place Your Order",
  description:
    "Share your class details and get matched with a verified academic expert in minutes.",
  alternates: { canonical: "/place-order" },
};

export default function PlaceOrderPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-display text-text-primary text-center text-4xl tracking-wide sm:text-5xl">
          Place Your <span className="text-gold">Order</span>
        </h1>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="text-text-secondary mx-auto mt-4 mb-10 max-w-md text-center">
          Three quick steps. An expert is assigned as soon as your order is in.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
        <OrderForm />
      </Reveal>
    </section>
  );
}
