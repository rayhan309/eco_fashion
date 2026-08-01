import { api } from "@/lib/axios";
import type { AdminCategoryFormValues } from "@/lib/validations/admin-category";
import type { AdminCategory } from "@/types/admin-category";

export async function createAdminCategory(payload: AdminCategoryFormValues) {
  const { data } = await api.post<AdminCategory>("/api/admin/categories", payload);
  return data;
}

export async function updateAdminCategory(id: string, payload: AdminCategoryFormValues) {
  const { data } = await api.patch<AdminCategory>(
    `/api/admin/categories/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

export async function deleteAdminCategory(id: string) {
  await api.delete(`/api/admin/categories/${encodeURIComponent(id)}`);
}

export async function reorderAdminCategories(orderedIds: string[]) {
  const { data } = await api.patch<AdminCategory[]>("/api/admin/categories", {
    orderedIds,
  });
  return data;
}
