import { api } from "@/lib/axios";
import type { SiteSettings } from "@/types/site-settings";

export async function fetchAdminSiteSettings(): Promise<SiteSettings> {
  const { data } = await api.get<SiteSettings>("/api/admin/settings");
  return data;
}

export async function patchAdminSiteSettings(partial: Partial<SiteSettings>) {
  const { data } = await api.patch<SiteSettings>("/api/admin/settings", partial);
  return data;
}
