export type SiteSocialLink = {
  platform: string;
  url: string;
  visible: boolean;
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
  freeDeliveryMinimum: number;
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
