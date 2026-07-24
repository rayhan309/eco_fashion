export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type HeroSideBanner = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
  tone: "forest" | "sand";
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "New Season Essentials",
    subtitle: "Clean silhouettes for the modern man.",
    ctaLabel: "Shop collection",
    href: "/collections/essentials",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Man in tailored casual menswear",
  },
  {
    id: "slide-2",
    title: "Sharp Everyday Shirts",
    subtitle: "Breathable oxfords and refined layers.",
    ctaLabel: "Shop shirts",
    href: "/shop/shirts",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Stacked mens shirts and jackets",
  },
  {
    id: "slide-3",
    title: "Tailored Pants Edit",
    subtitle: "Chinos and trousers built to move.",
    ctaLabel: "Shop pants",
    href: "/shop/pants",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Man wearing tailored pants",
  },
];

export const heroSideBanners: HeroSideBanner[] = [
  {
    id: "side-1",
    title: "Free Delivery",
    subtitle: "On orders over ৳5,000",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Man in stylish outerwear",
    tone: "forest",
  },
  {
    id: "side-2",
    title: "Accessories Drop",
    subtitle: "Belts, bags & finishing pieces",
    href: "/shop/accessories",
    image:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mens fashion accessories styling",
    tone: "sand",
  },
];
