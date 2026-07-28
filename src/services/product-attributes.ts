import { getProductAttributesFromDbOrFallback } from "@/lib/db/readers/product-attributes";
import type { ProductAttribute } from "@/data/dummy/product-attributes";

export async function getProductAttributes(): Promise<ProductAttribute[]> {
  return getProductAttributesFromDbOrFallback();
}
