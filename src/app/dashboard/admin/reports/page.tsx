import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminCustomersReportPageContent } from "@/components/admin/reports/AdminCustomersReportPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminOrders } from "@/services/admin-orders";

export const metadata: Metadata = {
  title: "Customer Report",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCustomersReportPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.orders(),
    queryFn: getAdminOrders,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminCustomersReportPageContent />
    </QueryHydrationBoundary>
  );
}
