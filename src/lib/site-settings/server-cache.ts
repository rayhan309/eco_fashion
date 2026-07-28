import { revalidateTag, unstable_cache } from "next/cache";
import { getSiteSettingsFromDbOrFallback } from "@/lib/db/readers/site-settings";
import { SITE_SETTINGS_REVALIDATE_SECONDS } from "@/lib/queries/constants";
import { toPublicSiteSettings } from "@/lib/site-settings/public";
import type { PublicSiteSettings, SiteSettings } from "@/types/site-settings";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

const getCachedSiteSettingsInner = unstable_cache(
  async (): Promise<SiteSettings> => getSiteSettingsFromDbOrFallback(),
  ["site-settings"],
  {
    revalidate: SITE_SETTINGS_REVALIDATE_SECONDS,
    tags: [SITE_SETTINGS_CACHE_TAG],
  },
);

export async function getCachedSiteSettings(): Promise<SiteSettings> {
  return getCachedSiteSettingsInner();
}

export async function getCachedPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await getCachedSiteSettings();
  return toPublicSiteSettings(settings);
}

export function revalidateSiteSettingsCache(): void {
  revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
}
