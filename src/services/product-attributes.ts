import { dummyProductAttributes, type ProductAttribute } from "@/data/dummy/product-attributes";

export async function getProductAttributes(): Promise<ProductAttribute[]> {
  return [...dummyProductAttributes];
}
