import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type CategoryProductGroup = {
  category: Category;
  products: Product[];
};
