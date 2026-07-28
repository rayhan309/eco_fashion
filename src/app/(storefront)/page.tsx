import type { Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { HomePageContent } from "@/components/home/HomePageContent";
import { QueryHydrationBoundary } from "@/components/query/QueryHydrationBoundary";
import { loadHomePageData } from "@/lib/data/home";
import { getQueryClient } from "@/lib/queries/get-query-client";
import { queryKeys } from "@/lib/queries/query-keys";

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.home.page(),
    queryFn: loadHomePageData,
  });

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </QueryHydrationBoundary>
  );
}
