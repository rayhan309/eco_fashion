"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminProductAttributesView } from "@/components/admin/products/AdminProductAttributesView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchProductAttributes } from "@/services/store-queries";

export function AdminProductAttributesPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.productAttributes(),
    queryFn: fetchProductAttributes,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminProductAttributesView attributes={data} />;
}
