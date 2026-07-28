"use client";

import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AdminCollectionsView } from "@/components/admin/collections/AdminCollectionsView";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminCollections } from "@/services/store-queries";

export function AdminCollectionsPageContent() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.collections(),
    queryFn: fetchAdminCollections,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) return null;

  return <AdminCollectionsView collections={data} />;
}
