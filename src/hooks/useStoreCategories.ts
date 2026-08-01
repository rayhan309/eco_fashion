"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchStoreCategories } from "@/services/store-queries";
import type { Category } from "@/types/category";

export function useStoreCategories(): Category[] {
  const { data } = useQuery({
    queryKey: queryKeys.site.categories(),
    queryFn: fetchStoreCategories,
  });

  return data ?? [];
}
