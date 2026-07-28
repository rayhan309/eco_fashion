import { ADMIN_ACCENT } from "@/lib/constants/admin";
import type { SiteSettings } from "@/types/site-settings";
import { expandBrandColors } from "@/lib/site-settings/colors";

const baseColor = ADMIN_ACCENT;
const colors = expandBrandColors(baseColor);

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  shopName: "Eco Fashion",
  shopTagline: "Made for modern men",
  shopShortDescription:
    "Men's fashion built for everyday clarity — thoughtful cuts, lasting fabrics, and pieces that work harder in your wardrobe.",
  copyrightText: "© {year} Eco Fashion. All rights reserved.",
  primaryColor: colors.primaryColor,
  primaryColorHover: colors.primaryColorHover,
  primaryColorDark: colors.primaryColorDark,
  primaryColorSoft: colors.primaryColorSoft,
  primaryColorBorder: colors.primaryColorBorder,
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "hello@ecofashion.com",
  contactPhone: "01700000000",
  contactAddress: "House 12, Road 5, Dhanmondi",
  businessName: "Eco Fashion",
  city: "Dhaka",
  supportHours: "Sat–Thu, 10:00–19:00",
  supportNote: "Our support team is here for sizing, orders, and delivery questions.",
  freeDeliveryMinimum: 5000,
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com", visible: true },
    { platform: "Facebook", url: "https://facebook.com", visible: true },
    { platform: "X", url: "https://x.com", visible: true },
  ],
  metaPixelEnabled: false,
  metaPixelId: "",
  steadfastEnabled: false,
  steadfastBaseUrl: "https://portal.packzy.com/api/v1",
  steadfastApiKey: "",
  steadfastSecretKey: "",
};
