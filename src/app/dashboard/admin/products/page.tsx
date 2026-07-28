import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminProductsPageContent } from "@/components/admin/products/AdminProductsPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminProductsCatalog } from "@/services/admin-products";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.productsCatalog(),
    queryFn: getAdminProductsCatalog,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductsPageContent />
    </QueryHydrationBoundary>
  );
}
