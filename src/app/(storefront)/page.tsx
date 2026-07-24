import { ClientReviewsSection } from "@/components/home/ClientReviewsSection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { TopCategories } from "@/components/home/TopCategories";
import { getTopCategories } from "@/services/categories";
import { getHomeCategoryProducts } from "@/services/products";
import { getClientReviews } from "@/services/reviews";

export default async function HomePage() {
  const [categories, categoryGroups, reviews] = await Promise.all([
    getTopCategories(10),
    getHomeCategoryProducts(5),
    getClientReviews(6),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-10 md:gap-12">
      <HeroSection />
      <TopCategories categories={categories} />
      <CollectionsSection groups={categoryGroups} />
      <ClientReviewsSection reviews={reviews} />
    </div>
  );
}
