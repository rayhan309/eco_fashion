import type { Metadata } from "next";
import { HeroSettings } from "@/components/admin/settings/HeroSettings";

export const metadata: Metadata = {
  title: "Hero",
};

export default function HeroSettingsPage() {
  return <HeroSettings />;
}
