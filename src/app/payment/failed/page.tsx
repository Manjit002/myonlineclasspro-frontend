import type { Metadata } from "next";
import { Suspense } from "react";
import { FailedView } from "@/components/payment/failed-view";

export const metadata: Metadata = {
  title: "Payment Failed",
  robots: { index: false, follow: false },
};

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedView />
    </Suspense>
  );
}
