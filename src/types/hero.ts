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

export type HeroContent = {
  slides: HeroSlide[];
  sideBanners: HeroSideBanner[];
};
