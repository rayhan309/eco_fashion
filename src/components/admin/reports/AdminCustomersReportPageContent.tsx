"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminCustomersReportView } from "@/components/admin/reports/AdminCustomersReportView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminOrders } from "@/services/store-queries";

export function AdminCustomersReportPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.orders(),
    queryFn: fetchAdminOrders,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminCustomersReportView orders={data} />;
}
