import type { Metadata } from "next";
import { CheckoutPageView } from "@/components/checkout/CheckoutPageView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Hidden Urban order with cash on delivery.",
};

export default function CheckoutPage() {
  return <CheckoutPageView />;
}
