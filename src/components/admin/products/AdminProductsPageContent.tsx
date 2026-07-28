"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminProductsView } from "@/components/admin/products/AdminProductsView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminProductsCatalog } from "@/services/store-queries";

export function AdminProductsPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.productsCatalog(),
    queryFn: fetchAdminProductsCatalog,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminProductsView products={data.products} categories={data.categories} />;
}
