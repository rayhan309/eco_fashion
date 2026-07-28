import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminProductAttributesPageContent } from "@/components/admin/products/AdminProductAttributesPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getProductAttributes } from "@/services/product-attributes";

export const metadata: Metadata = {
  title: "Product attributes",
};

export default async function AdminProductAttributesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.productAttributes(),
    queryFn: getProductAttributes,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductAttributesPageContent />
    </QueryHydrationBoundary>
  );
}
