import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminOrdersPageContent } from "@/components/admin/orders/AdminOrdersPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminOrders } from "@/services/admin-orders";

export const metadata: Metadata = {
  title: "Orders",
};

/** Always read live orders from MongoDB — never serve a cached page after checkout. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.orders(),
    queryFn: getAdminOrders,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminOrdersPageContent />
    </QueryHydrationBoundary>
  );
}
