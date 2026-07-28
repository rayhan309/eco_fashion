import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminCustomersPageContent } from "@/components/admin/customers/AdminCustomersPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminCustomers } from "@/services/admin-customers";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.customers(),
    queryFn: getAdminCustomers,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <AdminCustomersPageContent />
    </QueryHydrationBoundary>
  );
}
