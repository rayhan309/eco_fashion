import { dummyProducts } from "@/data/dummy/products";
import { getCategories } from "@/services/categories";
import type { CategoryProductGroup } from "@/types/catalog";
import type { Product } from "@/types/product";

/**
 * Product service.
 * Today: reads dummy data.
 * Later: replace the body with a database / API call — keep the same return type.
 */
export async function getProducts(): Promise<Product[]> {
  return [...dummyProducts];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.category_slug === categorySlug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products
    .slice()
    .sort((a, b) => b.ratings.average - a.ratings.average)
    .slice(0, limit);
}

export async function getCollectionProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, limit);
}

/** Home: products from every category (default 5 each) */
export async function getHomeCategoryProducts(
  perCategory = 5,
): Promise<CategoryProductGroup[]> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return categories
    .map((category) => ({
      category,
      products: products
        .filter((product) => product.category_slug === category.slug)
        .slice(0, perCategory),
    }))
    .filter((group) => group.products.length > 0);
}
