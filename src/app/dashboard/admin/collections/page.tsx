import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminCollectionsPageContent } from "@/components/admin/collections/AdminCollectionsPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getCollections } from "@/services/collections";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function AdminCollectionsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.collections(),
    queryFn: getCollections,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminCollectionsPageContent />
    </QueryHydrationBoundary>
  );
}
