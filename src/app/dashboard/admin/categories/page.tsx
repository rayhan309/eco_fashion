import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminCategoriesPageContent } from "@/components/admin/categories/AdminCategoriesPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminCategories } from "@/services/admin-categories";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.categories(),
    queryFn: getAdminCategories,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminCategoriesPageContent />
    </QueryHydrationBoundary>
  );
}
