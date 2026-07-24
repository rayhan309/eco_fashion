import { products } from "@/data/products";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return products.filter((product) => product.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.featured);
}
