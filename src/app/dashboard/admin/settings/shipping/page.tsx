import type { Metadata } from "next";
import { ShippingSettings } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "Shipping",
};

export default function ShippingSettingsPage() {
  return <ShippingSettings />;
}
