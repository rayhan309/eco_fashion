import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Eco Fashion — sizing help, order support, and styling advice. Email, phone, or send us a message.",
};

export default function Contact() {
  return <ContactPage />;
}
