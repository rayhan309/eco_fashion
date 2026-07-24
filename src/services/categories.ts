import { dummyCategories } from "@/data/dummy/categories";
import type { Category } from "@/types/category";

/**
 * Category service.
 * Today: reads dummy data.
 * Later: replace the body with a database / API call — keep the same return type.
 */
export async function getCategories(): Promise<Category[]> {
  return [...dummyCategories];
}

export async function getTopCategories(limit = 10): Promise<Category[]> {
  const categories = await getCategories();

  return categories
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}
