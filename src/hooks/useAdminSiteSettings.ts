"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  fetchAdminSiteSettings,
  patchAdminSiteSettings,
} from "@/services/admin-settings";
import type { SiteSettings } from "@/types/site-settings";

export function useAdminSiteSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.settings(),
    queryFn: fetchAdminSiteSettings,
  });

  const saveMutation = useMutation({
    mutationFn: (partial: Partial<SiteSettings>) => patchAdminSiteSettings(partial),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.settings(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.site.settings() });
    },
  });

  return { ...query, saveMutation };
}
