import type { Metadata } from "next";
import { MetaPixelSettings } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "Pixel & CAPI",
};

export default function MetaPixelSettingsPage() {
  return <MetaPixelSettings />;
}
