import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrderView } from "@/components/orders/TrackOrderView";

export const metadata: Metadata = {
  title: "Track order",
  description: "Track your Hidden Urban order status with your order number and phone.",
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-[#61716a]">Loading…</p>}>
      <TrackOrderView />
    </Suspense>
  );
}
