import { api } from "@/lib/axios";
import type { AdminOrderUpdateValues } from "@/lib/validations/admin-order";
import type { StoreOrder } from "@/types/store-order";

export async function fetchAdminOrderDetail(id: string) {
  const { data } = await api.get<StoreOrder>(
    `/api/admin/orders/${encodeURIComponent(id)}`,
  );
  return data;
}

export async function updateAdminOrder(id: string, payload: AdminOrderUpdateValues) {
  const { data } = await api.patch<StoreOrder>(
    `/api/admin/orders/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

export async function deleteAdminOrder(id: string) {
  await api.delete(`/api/admin/orders/${encodeURIComponent(id)}`);
}
