"use client";

import { ClientReviewsSection } from "@/components/home/ClientReviewsSection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { TopCategories } from "@/components/home/TopCategories";
import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchHomePageData } from "@/services/store-queries";

export function HomePageContent() {
  const settings = useSiteSettings();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.home.page(),
    queryFn: fetchHomePageData,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-10 md:gap-12">
      <HeroSection
        slides={settings.heroSlides ?? []}
        sideBanners={settings.heroSideBanners ?? []}
      />
      <TopCategories categories={data.categories} />
      <CollectionsSection groups={data.categoryGroups} />
      <ClientReviewsSection reviews={data.reviews} />
    </div>
  );
}
