import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import { getSiteSettingsFromDbOrFallback, mapSiteSettingsDoc } from "@/lib/db/readers/site-settings";
import { expandBrandColors } from "@/lib/site-settings/colors";
import type { SiteSettings } from "@/types/site-settings";

export async function upsertSiteSettingsInDb(
  partial: Partial<SiteSettings>,
): Promise<SiteSettings> {
  await dbConnect();
  const Model = getSeedModel("site_settings");
  const current = await getSiteSettingsFromDbOrFallback();
  const merged: SiteSettings = { ...current, ...partial };

  if (partial.primaryColor && !partial.primaryColorHover) {
    const colors = expandBrandColors(partial.primaryColor);
    Object.assign(merged, colors);
  }

  const payload = {
    legacyId: "global",
    ...merged,
    logo: merged.logoUrl ? { url: merged.logoUrl } : undefined,
    favicon: merged.faviconUrl ? { url: merged.faviconUrl } : undefined,
    shopLogo: merged.logoUrl ? { url: merged.logoUrl } : undefined,
  };

  await Model.updateOne({ legacyId: "global" }, { $set: payload }, { upsert: true });

  const updated = await Model.findOne({ legacyId: "global" }).lean();
  if (!updated) throw new Error("Failed to save settings");
  return mapSiteSettingsDoc(updated as unknown as Record<string, unknown>);
}
