import { getTopCategories } from "@/services/categories";
import { getCollections } from "@/services/collections";
import { getHomeCategoryProducts } from "@/services/products";
import { getClientReviews } from "@/services/reviews";
import type { Category } from "@/types/category";
import type { CategoryProductGroup } from "@/types/catalog";
import type { Collection } from "@/types/collection";
import type { ClientReview } from "@/types/review";

export type HomePageData = {
  categories: Category[];
  categoryGroups: CategoryProductGroup[];
  collections: Collection[];
  reviews: ClientReview[];
};

export async function loadHomePageData(): Promise<HomePageData> {
  const [categories, categoryGroups, collections, reviews] = await Promise.all([
    getTopCategories(10),
    getHomeCategoryProducts(5),
    getCollections(),
    getClientReviews(6),
  ]);

  return { categories, categoryGroups, collections, reviews };
}
