import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from "@/lib/queries/constants";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

export const getQueryClient = cache(() => makeQueryClient());
