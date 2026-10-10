import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { OrderForm } from "@/components/sections/order-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "place order online class help",
    "hire class taker",
    "pay for online class help",
    "get academic assistance",
  ],
  title: {
    absolute: "Place Your Order - Online Class Help | MyOnlineClassPro",
  },
  description:
    "Share your class details and get matched with a verified academic expert in minutes.",
  alternates: { canonical: "/place-order" },
};

export default function PlaceOrderPage() {
  return (
    <>
      <PageSchema
        path="/place-order"
        title={"Place Your Order - Online Class Help | MyOnlineClassPro"}
        description={
          "Place your order for expert online class help. Expert assigned in 10 minutes, Grade B guaranteed, 100% confidential. Affordable rates, easy process."
        }
        type="WebPage"
        breadcrumbs={[{ name: "Place An Order", path: "/place-order" }]}
      />
      <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="page-h text-text-primary">
            Place Your <span className="text-gold">Order</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mx-auto mt-4 mb-10 max-w-md text-center">
            Three quick steps. An expert is assigned as soon as your order is
            in.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <OrderForm />
        </Reveal>
      </section>
    </>
  );
}
