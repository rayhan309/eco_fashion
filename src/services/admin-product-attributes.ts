import { api } from "@/lib/axios";
import type { ProductAttribute } from "@/data/dummy/product-attributes";
import type { ProductAttributeFormValues } from "@/lib/validations/product-attribute";

export async function createProductAttribute(payload: ProductAttributeFormValues) {
  const { data } = await api.post<ProductAttribute>("/api/admin/product-attributes", payload);
  return data;
}

export async function updateProductAttribute(id: string, payload: ProductAttributeFormValues) {
  const { data } = await api.patch<ProductAttribute>(
    `/api/admin/product-attributes/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

export async function deleteProductAttribute(id: string) {
  await api.delete(`/api/admin/product-attributes/${encodeURIComponent(id)}`);
}
