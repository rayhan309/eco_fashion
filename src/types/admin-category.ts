import type { Category } from "@/types/category";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  sortOrder: number;
};

export function mapCategoriesToAdmin(categories: Category[]): AdminCategory[] {
  return categories.map((category, index) => ({
    id: category.id,
    name: category.title,
    slug: category.slug,
    image: category.image,
    description: "",
    sortOrder: index + 1,
  }));
}
