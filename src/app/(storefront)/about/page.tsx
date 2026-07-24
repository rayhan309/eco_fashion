import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Eco Fashion — men's wear built for everyday clarity. Thoughtful cuts, lasting fabrics, and pieces that work harder in your wardrobe.",
};

export default function About() {
  return <AboutPage />;
}
