"use client";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";
import { Container } from "@/components/container";
import { FOOTER_HELP, FOOTER_SHOP } from "@/lib/constants/navigation";

const trustItems = [
  {
    icon: LocalShippingOutlinedIcon,
    title: "Free delivery",
    text: "On orders over ৳5,000",
  },
  {
    icon: ReplayOutlinedIcon,
    title: "Easy returns",
    text: "7-day return policy",
  },
  {
    icon: SecurityOutlinedIcon,
    title: "Secure checkout",
    text: "Protected payments",
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookOutlinedIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
];

const linkClassName =
  "text-sm text-[#61716a] transition-colors hover:text-[#1f6f5b]";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[rgba(32,49,45,0.1)] bg-[#fffdf8]">
      <div className="border-b border-[rgba(32,49,45,0.1)] bg-[#f6f3ed]/60">
        <Container className="py-5 md:py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-md border border-[rgba(32,49,45,0.08)] bg-white/70 px-4 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[rgba(31,111,91,0.1)] text-[#1f6f5b]">
                  <item.icon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#20312d]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#61716a]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-[-0.04em] text-[#20312d]"
            >
              Eco Fashion
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#61716a]">
              Men&apos;s fashion built for everyday clarity — thoughtful cuts,
              lasting fabrics, and pieces that work harder in your wardrobe.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(32,49,45,0.12)] text-[#20312d] transition-colors hover:border-[#1f6f5b] hover:bg-[#1f6f5b] hover:text-white"
                >
                  <social.icon sx={{ fontSize: 18 }} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-[0.08em] text-[#20312d] uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_SHOP.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-[0.08em] text-[#20312d] uppercase">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_HELP.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-sm font-bold tracking-[0.08em] text-[#20312d] uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#61716a]">
                <LocationOnOutlinedIcon sx={{ fontSize: 18, mt: "2px", color: "#1f6f5b" }} />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li>
                <a
                  href="mailto:hello@ecofashion.com"
                  className="flex items-center gap-2.5 text-sm text-[#61716a] transition-colors hover:text-[#1f6f5b]"
                >
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: "#1f6f5b" }} />
                  hello@ecofashion.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 text-sm text-[#61716a] transition-colors hover:text-[#1f6f5b]"
                >
                  <PhoneOutlinedIcon sx={{ fontSize: 18, color: "#1f6f5b" }} />
                  +880 1700-000000
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-md border border-[rgba(32,49,45,0.1)] bg-[#f6f3ed]/80 p-4">
              <p className="text-sm font-bold text-[#20312d]">Need help?</p>
              <p className="mt-1 text-xs leading-relaxed text-[#61716a]">
                Our support team is here for sizing, orders, and delivery questions.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex rounded-md bg-[#1f6f5b] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#185a4a]"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-[rgba(32,49,45,0.1)]">
        <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#61716a]">
            © {year} Eco Fashion. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#61716a]">
            <Link href="/about" className="hover:text-[#1f6f5b]">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-[#1f6f5b]">
              Terms
            </Link>
            <span>Made for modern men</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
