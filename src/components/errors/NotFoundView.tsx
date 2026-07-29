"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/container";

const DESTINATIONS = [
  {
    label: "Shop all",
    href: "/shop",
    description: "Browse the full menswear catalog",
  },
  {
    label: "Shirts",
    href: "/shop/shirts",
    description: "Oxfords, polos, and everyday tops",
  },
  {
    label: "Pants",
    href: "/shop/pants",
    description: "Chinos and trousers built to move",
  },
  {
    label: "Collections",
    href: "/collections",
    description: "Curated edits for the season",
  },
  {
    label: "About",
    href: "/about",
    description: "Our story and how we build",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Sizing help and order support",
  },
] as const;

type NotFoundViewProps = {
  /** Cancel storefront Container padding for a full-bleed layout. */
  breakout?: boolean;
};

export function NotFoundView({ breakout = false }: NotFoundViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={
        breakout
          ? "-mx-4 -mt-6 -mb-6 sm:-mx-6 md:-mt-10 md:-mb-10 lg:-mx-8"
          : "flex w-full flex-1 flex-col"
      }
    >
      <section className="relative isolate flex min-h-[min(100dvh,920px)] flex-col overflow-hidden sm:min-h-[min(88dvh,860px)]">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%] sm:object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[#14221f]/55 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#14221f]/92 sm:via-[#14221f]/68 sm:to-[#14221f]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221f] via-[#14221f]/55 to-[#14221f]/25 sm:via-[#14221f]/25 sm:to-transparent" />

        <Container className="relative flex flex-1 flex-col justify-end pb-10 pt-24 sm:pb-14 sm:pt-28 md:pb-16 md:pt-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full max-w-2xl"
          >
            <p className="font-mono text-[0.7rem] font-medium tracking-[0.22em] text-[#e6a34a] uppercase sm:text-xs">
              Error 404
            </p>

            <p className="mt-3 text-[1.75rem] leading-none font-bold tracking-[-0.04em] text-white sm:mt-4 sm:text-4xl md:text-5xl">
              Hidden Urban
            </p>

            <h1 className="mt-3 max-w-xl text-lg leading-snug font-semibold tracking-[-0.02em] text-white/95 sm:mt-4 sm:text-2xl md:text-3xl">
              This page isn&apos;t in the wardrobe.
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/78 sm:mt-4 sm:max-w-lg sm:text-base">
              The link may be broken, outdated, or mistyped. Return home or keep
              shopping — fresh fits are still waiting.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:max-w-md sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#20312d] transition-colors hover:bg-[#f6f3ed] active:bg-[#efece4]"
              >
                <HomeOutlinedIcon sx={{ fontSize: 18 }} />
                Back to home
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 active:bg-white/15"
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
                Browse shop
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-[rgba(32,49,45,0.1)] bg-[#f6f3ed]">
        <Container className="py-10 sm:py-12 md:py-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-[#1f6f5b] uppercase">
              Where to go next
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-2xl">
              Popular destinations
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#61716a] sm:text-base">
              Jump to a section that still fits — no dead ends.
            </p>
          </motion.div>

          <ul className="mt-7 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {DESTINATIONS.map((item, index) => (
              <motion.li
                key={item.href}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : index * 0.05,
                }}
              >
                <Link
                  href={item.href}
                  className="group flex min-h-[4.5rem] items-center justify-between gap-3 rounded-md border border-[rgba(32,49,45,0.1)] bg-[#fffdf8] px-4 py-3.5 transition-colors hover:border-[rgba(31,111,91,0.35)] hover:bg-white active:bg-[#f6f3ed] sm:min-h-[5rem] sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold tracking-[-0.02em] text-[#20312d] sm:text-[0.95rem]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-[#61716a] sm:text-sm">
                      {item.description}
                    </span>
                  </span>
                  <ArrowForwardRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: "#1f6f5b",
                      flexShrink: 0,
                      transition: "transform 0.2s ease",
                      ".group:hover &": {
                        transform: "translateX(2px)",
                      },
                    }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-[#61716a] sm:mt-10">
            Still stuck?{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#1f6f5b] transition-colors hover:text-[#185a4a]"
            >
              Contact support
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}
