"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/container";

const VALUES = [
  {
    title: "Lasting fabrics",
    text: "We choose materials that hold shape, color, and comfort through seasons of real wear.",
  },
  {
    title: "Clear silhouettes",
    text: "Cuts are refined and practical — sharp enough for the office, easy enough for the weekend.",
  },
  {
    title: "Honest value",
    text: "Every piece is priced for quality you can feel, without seasonal noise or throwaway trends.",
  },
] as const;

export function AboutPage() {
  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 md:-mt-10 md:-mb-10 lg:-mx-8">
      <section className="relative isolate min-h-[72vh] overflow-hidden sm:min-h-[78vh]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=2000&q=80"
            alt="Man in tailored casual menswear"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#14221f]/88 via-[#14221f]/55 to-[#14221f]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221f]/50 via-transparent to-transparent" />

        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-12 pt-28 sm:min-h-[78vh] sm:pb-16 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="max-w-2xl"
          >
            <p className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
              Eco Fashion
            </p>
            <h1 className="mt-4 max-w-xl text-xl font-semibold tracking-[-0.02em] text-white/95 sm:text-2xl md:text-3xl">
              Men&apos;s wear built for everyday clarity.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Thoughtful cuts, lasting fabrics, and pieces that work harder in
              your wardrobe — without the noise of fast fashion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#20312d] transition-colors hover:bg-[#f6f3ed]"
              >
                Shop the collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-white/35 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-[#f6f3ed]">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#1f6f5b] uppercase">
              Our story
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
              From closet clutter to a clearer uniform.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#61716a] sm:text-base">
              Eco Fashion started with a simple frustration: too many clothes,
              too few pieces that actually fit how men live. We set out to edit
              the wardrobe down to essentials that look sharp, feel considered,
              and last longer than a single season.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#61716a] sm:text-base">
              Today we design and curate menswear for Bangladesh and beyond —
              shirts, pants, jackets, and finishing pieces chosen for fabric
              integrity, honest fit, and quiet confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="relative aspect-[4/5] overflow-hidden rounded-md sm:aspect-[5/6]"
          >
            <Image
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80"
              alt="Man in refined outerwear"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </Container>
      </section>

      <section className="border-y border-[rgba(32,49,45,0.1)] bg-[#fffdf8]">
        <Container className="py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#1f6f5b] uppercase">
              What we stand for
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
              Three principles guide every drop.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#61716a] sm:text-base">
              We keep the brand focused so your wardrobe stays focused too.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 md:mt-14">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
              >
                <span className="font-mono text-sm font-medium text-[#e6a34a]">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-[-0.02em] text-[#20312d]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#61716a]">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#f6f3ed]">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative order-2 aspect-[5/4] overflow-hidden rounded-md md:order-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=80"
              alt="Stacked shirts and jackets in a considered wardrobe"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="order-1 md:order-2"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#1f6f5b] uppercase">
              How we build
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
              Craft you can wear on repeat.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#61716a] sm:text-base">
              We favor breathable oxfords, reliable chinos, and layers that move
              with you. Details matter — stitching, drape, and finish — so each
              piece earns its place instead of filling a shelf.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-flex text-sm font-semibold text-[#1f6f5b] transition-colors hover:text-[#185a4a]"
            >
              Explore collections →
            </Link>
          </motion.div>
        </Container>
      </section>

      <section className="bg-[#20312d]">
        <Container className="flex flex-col items-start justify-between gap-8 py-14 sm:flex-row sm:items-center md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              Ready to rebuild your rotation?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Start with essentials that earn their hangers — then build from
              there.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#20312d] transition-colors hover:bg-[#f6f3ed]"
            >
              Shop now
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
