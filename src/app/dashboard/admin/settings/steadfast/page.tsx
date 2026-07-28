import type { Metadata } from "next";
import { SteadfastSettings } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "Steadfast",
};

export default function SteadfastSettingsPage() {
  return <SteadfastSettings />;
}
