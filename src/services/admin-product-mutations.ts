import { api } from "@/lib/axios";
import type { AddProductFormValues } from "@/lib/validations/product";
import { z } from "zod";

const productResponseSchema = z.object({
  product: z.object({
    id: z.string(),
    slug: z.string(),
  }),
});

export async function createProduct(payload: AddProductFormValues) {
  const { data } = await api.post("/api/admin/products", payload);
  return productResponseSchema.parse(data).product;
}

export async function updateProduct(productId: string, payload: AddProductFormValues) {
  const { data } = await api.patch(`/api/admin/products/${encodeURIComponent(productId)}`, payload);
  return productResponseSchema.parse(data).product;
}

export async function deleteProduct(productId: string) {
  await api.delete(`/api/admin/products/${encodeURIComponent(productId)}`);
}
