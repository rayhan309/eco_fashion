"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchSiteSettings } from "@/services/store-queries";
import type { PublicSiteSettings } from "@/types/site-settings";
import { DEFAULT_PUBLIC_SITE_SETTINGS, normalizePublicSiteSettings } from "@/lib/site-settings/public";

export function useSiteSettings(): PublicSiteSettings {
  const { data } = useQuery({
    queryKey: queryKeys.site.settings(),
    queryFn: fetchSiteSettings,
  });

  return normalizePublicSiteSettings(data ?? DEFAULT_PUBLIC_SITE_SETTINGS);
}
