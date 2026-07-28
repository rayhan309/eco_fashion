import type { Metadata } from "next";
import { GeneralSettings } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "General",
};

export default function AdminSettingsPage() {
  return <GeneralSettings />;
}
