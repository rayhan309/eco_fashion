import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { AdminOverview } from "@/components/admin";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminOverview } from "@/services/admin";

export const metadata: Metadata = {
  title: "Overview",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOverviewPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: getAdminOverview,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminOverview />
    </QueryHydrationBoundary>
  );
}
