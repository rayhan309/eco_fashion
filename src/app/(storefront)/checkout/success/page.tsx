import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccessView } from "@/components/checkout/CheckoutSuccessView";

export const metadata: Metadata = {
  title: "Order placed",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-[#61716a]">Loading…</p>}>
      <CheckoutSuccessView />
    </Suspense>
  );
}
