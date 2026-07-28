import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import type { PublicSiteSettings, SiteSettings } from "@/types/site-settings";

export function toPublicSiteSettings(settings: SiteSettings): PublicSiteSettings {
  const { steadfastApiKey: _a, steadfastSecretKey: _b, ...rest } = settings;
  return rest;
}

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings =
  toPublicSiteSettings(DEFAULT_SITE_SETTINGS);
