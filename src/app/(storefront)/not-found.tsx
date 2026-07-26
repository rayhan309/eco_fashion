import type { Metadata } from "next";
import { NotFoundView } from "@/components/errors";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page could not be found. Return home or continue shopping at Eco Fashion.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function StorefrontNotFound() {
  return <NotFoundView breakout />;
}
