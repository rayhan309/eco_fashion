import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import { expandBrandColors } from "@/lib/site-settings/colors";
import { toPublicSiteSettings } from "@/lib/site-settings/public";
import type { PublicSiteSettings, SiteSettings, SiteSocialLink } from "@/types/site-settings";

export { toPublicSiteSettings };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function imageUrlFromField(value: unknown): string {
  if (typeof value === "string") return value;
  const o = record(value);
  return String(o.url ?? o.src ?? "");
}

function mapSocialLinks(raw: unknown): SiteSocialLink[] {
  if (!Array.isArray(raw)) return DEFAULT_SITE_SETTINGS.socialLinks;
  return raw.map((item) => {
    const row = record(item);
    return {
      platform: String(row.platform ?? ""),
      url: String(row.url ?? ""),
      visible: row.visible !== false,
    };
  });
}

export function mapSiteSettingsDoc(doc: Record<string, unknown>): SiteSettings {
  const primary =
    String(doc.primaryColor ?? doc.brandColor ?? DEFAULT_SITE_SETTINGS.primaryColor);
  const colors = expandBrandColors(primary);

  return {
    shopName: String(doc.shopName ?? doc.businessName ?? DEFAULT_SITE_SETTINGS.shopName),
    shopTagline: String(doc.shopTagline ?? DEFAULT_SITE_SETTINGS.shopTagline),
    shopShortDescription: String(
      doc.shopShortDescription ?? doc.shortDescription ?? DEFAULT_SITE_SETTINGS.shopShortDescription,
    ),
    copyrightText: String(doc.copyrightText ?? DEFAULT_SITE_SETTINGS.copyrightText),
    primaryColor: String(doc.primaryColor ?? colors.primaryColor),
    primaryColorHover: String(doc.primaryColorHover ?? colors.primaryColorHover),
    primaryColorDark: String(doc.primaryColorDark ?? colors.primaryColorDark),
    primaryColorSoft: String(doc.primaryColorSoft ?? colors.primaryColorSoft),
    primaryColorBorder: String(doc.primaryColorBorder ?? colors.primaryColorBorder),
    logoUrl: imageUrlFromField(doc.logoUrl ?? doc.logo ?? doc.shopLogo),
    faviconUrl: imageUrlFromField(doc.faviconUrl ?? doc.favicon),
    contactEmail: String(doc.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail),
    contactPhone: String(doc.contactPhone ?? DEFAULT_SITE_SETTINGS.contactPhone),
    contactAddress: String(doc.contactAddress ?? doc.address ?? DEFAULT_SITE_SETTINGS.contactAddress),
    businessName: String(doc.businessName ?? doc.shopName ?? DEFAULT_SITE_SETTINGS.businessName),
    city: String(doc.city ?? DEFAULT_SITE_SETTINGS.city),
    supportHours: String(doc.supportHours ?? DEFAULT_SITE_SETTINGS.supportHours),
    supportNote: String(doc.supportNote ?? DEFAULT_SITE_SETTINGS.supportNote),
    freeDeliveryMinimum: Number(doc.freeDeliveryMinimum ?? DEFAULT_SITE_SETTINGS.freeDeliveryMinimum),
    socialLinks: mapSocialLinks(doc.socialLinks),
    metaPixelEnabled: Boolean(doc.metaPixelEnabled ?? false),
    metaPixelId: String(doc.metaPixelId ?? ""),
    steadfastEnabled: Boolean(doc.steadfastEnabled ?? false),
    steadfastBaseUrl: String(doc.steadfastBaseUrl ?? DEFAULT_SITE_SETTINGS.steadfastBaseUrl),
    steadfastApiKey: String(doc.steadfastApiKey ?? ""),
    steadfastSecretKey: String(doc.steadfastSecretKey ?? ""),
  };
}

export async function readSiteSettingsFromDb(): Promise<SiteSettings | null> {
  await dbConnect();
  const Model = getSeedModel("site_settings");
  const doc = await Model.findOne({ legacyId: "global" }).lean();
  if (!doc) return null;
  return mapSiteSettingsDoc(doc as unknown as Record<string, unknown>);
}

export async function getSiteSettingsFromDbOrFallback(): Promise<SiteSettings> {
  try {
    const fromDb = await readSiteSettingsFromDb();
    if (fromDb) return fromDb;
  } catch (error) {
    console.error("[db] site_settings read failed:", error);
  }
  return { ...DEFAULT_SITE_SETTINGS };
}
