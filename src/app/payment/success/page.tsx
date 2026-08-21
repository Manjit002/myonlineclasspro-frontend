import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessView } from "@/components/payment/success-view";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  // useSearchParams needs a Suspense boundary during prerender.
  return (
    <Suspense fallback={null}>
      <SuccessView />
    </Suspense>
  );
}
