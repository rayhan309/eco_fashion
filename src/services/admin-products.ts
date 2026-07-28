import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type AdminProductsCatalog = {
  products: Product[];
  categories: Category[];
};

export async function getAdminProductsCatalog(): Promise<AdminProductsCatalog> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return { products, categories };
}
