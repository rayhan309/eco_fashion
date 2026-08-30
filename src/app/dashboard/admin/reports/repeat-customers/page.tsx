import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { AdminRepeatCustomersPageContent } from "@/components/admin/reports/AdminRepeatCustomersPageContent";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";
import { getAdminOrders } from "@/services/admin-orders";

export const metadata: Metadata = {
  title: "Repeat Customer Report",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ReportFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
      <CircularProgress size={32} />
    </Box>
  );
}

export default async function AdminRepeatCustomersReportPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admin.orders(),
    queryFn: getAdminOrders,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ReportFallback />}>
        <AdminRepeatCustomersPageContent />
      </Suspense>
    </QueryHydrationBoundary>
  );
}
