import type { Metadata } from "next";
import { ContactSettings } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactSettingsPage() {
  return <ContactSettings />;
}
