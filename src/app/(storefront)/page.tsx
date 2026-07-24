import { CollectionsSection } from "@/components/home/CollectionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { TopCategories } from "@/components/home/TopCategories";
import { getTopCategories } from "@/services/categories";
import { getHomeCategoryProducts } from "@/services/products";

export default async function HomePage() {
  const [categories, categoryGroups] = await Promise.all([
    getTopCategories(10),
    getHomeCategoryProducts(5),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-10 md:gap-12">
      <HeroSection />
      <TopCategories categories={categories} />
      <CollectionsSection groups={categoryGroups} />
    </div>
  );
}
