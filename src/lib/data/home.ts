import { getTopCategories } from "@/services/categories";
import { getHomeCategoryProducts } from "@/services/products";
import { getClientReviews } from "@/services/reviews";
import type { Category } from "@/types/category";
import type { CategoryProductGroup } from "@/types/catalog";
import type { ClientReview } from "@/types/review";

export type HomePageData = {
  categories: Category[];
  categoryGroups: CategoryProductGroup[];
  reviews: ClientReview[];
};

export async function loadHomePageData(): Promise<HomePageData> {
  const [categories, categoryGroups, reviews] = await Promise.all([
    getTopCategories(10),
    getHomeCategoryProducts(5),
    getClientReviews(6),
  ]);

  return { categories, categoryGroups, reviews };
}
