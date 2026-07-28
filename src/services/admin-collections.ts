import { api } from "@/lib/axios";
import type { Collection } from "@/types/collection";
import type { CollectionFormValues } from "@/lib/validations/collection";

export async function createCollection(payload: CollectionFormValues) {
  const { data } = await api.post<Collection>("/api/admin/collections", payload);
  return data;
}

export async function updateCollection(id: string, payload: CollectionFormValues) {
  const { data } = await api.patch<Collection>(
    `/api/admin/collections/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

export async function deleteCollection(id: string) {
  await api.delete(`/api/admin/collections/${encodeURIComponent(id)}`);
}
