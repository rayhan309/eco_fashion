import { getCachedPublicSiteSettings } from "@/lib/site-settings/server-cache";
import type { PublicSiteSettings } from "@/types/site-settings";

/** Public storefront settings (15m Next.js server cache; invalidated on admin save). */
export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  return getCachedPublicSiteSettings();
}
