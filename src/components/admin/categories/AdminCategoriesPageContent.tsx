"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminCategoriesView } from "@/components/admin/categories/AdminCategoriesView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminCategories } from "@/services/store-queries";

export function AdminCategoriesPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.categories(),
    queryFn: fetchAdminCategories,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminCategoriesView initialCategories={data} />;
}
