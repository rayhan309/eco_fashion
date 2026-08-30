import type { Collection } from "@/types/collection";
import type { HeroContent, HeroSideBanner, HeroSlide } from "@/types/hero";

/** Build homepage hero from collections when admin hero slides are empty. */
export function heroFromCollections(collections: Collection[]): HeroContent {
  const usable = collections.filter((c) => c.image?.trim() && c.title?.trim());
  if (usable.length === 0) {
    return { slides: [], sideBanners: [] };
  }

  const toSlide = (collection: Collection): HeroSlide => ({
    id: `hero-col-${collection.id}`,
    title: collection.title,
    subtitle: collection.description || "Shop the collection",
    ctaLabel: "Shop now",
    href: `/collections/${collection.slug}`,
    image: collection.image,
    imageAlt: collection.title,
  });

  const toSide = (collection: Collection, tone: "forest" | "sand"): HeroSideBanner => ({
    id: `hero-side-${collection.id}`,
    title: collection.title,
    subtitle: collection.description || "Explore the edit",
    href: `/collections/${collection.slug}`,
    image: collection.image,
    imageAlt: collection.title,
    tone,
  });

  if (usable.length === 1) {
    return { slides: [toSlide(usable[0])], sideBanners: [] };
  }

  if (usable.length === 2) {
    return {
      slides: [toSlide(usable[0])],
      sideBanners: [toSide(usable[1], "forest")],
    };
  }

  // 3+: keep first (n-2) in the slider, last two as side cards
  const sideCount = 2;
  const slideItems = usable.slice(0, Math.max(1, usable.length - sideCount));
  const sideItems = usable.slice(-sideCount);

  return {
    slides: slideItems.map(toSlide),
    sideBanners: sideItems.map((collection, index) =>
      toSide(collection, index === 0 ? "forest" : "sand"),
    ),
  };
}
