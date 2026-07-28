import { dehydrate } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { SiteSettingsRoot } from "@/components/site/SiteSettingsRoot";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getPublicSiteSettings } from "@/services/site-settings";

type SiteSettingsShellProps = {
  children: ReactNode;
};

export async function SiteSettingsShell({ children }: SiteSettingsShellProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.site.settings(),
    queryFn: getPublicSiteSettings,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <SiteSettingsRoot>{children}</SiteSettingsRoot>
    </QueryHydrationBoundary>
  );
}
