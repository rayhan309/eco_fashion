import type { HeroSideBanner, HeroSlide } from "@/types/hero";

export type SiteSocialLink = {
  platform: string;
  url: string;
  visible: boolean;
};

export type SiteShippingArea = {
  id: string;
  name: string;
};

export type SiteShippingClass = {
  id: string;
  name: string;
  description: string;
  freeDelivery: boolean;
  /** Fee (BDT) aligned by index with `shippingAreas`. */
  fees: number[];
};

export type SiteSettings = {
  shopName: string;
  shopTagline: string;
  shopShortDescription: string;
  copyrightText: string;
  primaryColor: string;
  primaryColorHover: string;
  primaryColorDark: string;
  primaryColorSoft: string;
  primaryColorBorder: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  businessName: string;
  city: string;
  supportHours: string;
  supportNote: string;
  freeDeliveryEnabled: boolean;
  freeDeliveryMinimum: number;
  shippingEstimateInsideDhaka: string;
  shippingEstimateOutsideDhaka: string;
  shippingAreas: SiteShippingArea[];
  shippingClasses: SiteShippingClass[];
  heroSlides: HeroSlide[];
  heroSideBanners: HeroSideBanner[];
  socialLinks: SiteSocialLink[];
  metaPixelEnabled: boolean;
  metaPixelId: string;
  steadfastEnabled: boolean;
  steadfastBaseUrl: string;
  steadfastApiKey: string;
  steadfastSecretKey: string;
};

export type PublicSiteSettings = Omit<
  SiteSettings,
  "steadfastApiKey" | "steadfastSecretKey"
>;
