import { dummyCollections } from "@/data/dummy/collections";
import { getProducts } from "@/services/products";
import type { Collection } from "@/types/collection";
import type { Product } from "@/types/product";

/**
 * Collections service.
 * Today: reads dummy data.
 * Later: replace with a database / API call — keep the same return type.
 */
export async function getCollections(): Promise<Collection[]> {
  return [...dummyCollections];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find((collection) => collection.slug === slug);
}

export async function getCollectionProductsBySlug(slug: string): Promise<Product[]> {
  const [collection, products] = await Promise.all([
    getCollectionBySlug(slug),
    getProducts(),
  ]);

  if (!collection) return [];

  const byId = new Map(products.map((product) => [product.id, product]));
  return collection.productIds
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
}
