"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminCustomersView } from "@/components/admin/customers/AdminCustomersView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminCustomers } from "@/services/store-queries";

export function AdminCustomersPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.customers(),
    queryFn: fetchAdminCustomers,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminCustomersView customers={data.customers} stats={data.stats} />;
}
