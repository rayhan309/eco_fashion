import { api } from "@/lib/axios";
import type { AdminOrderUpdateValues } from "@/lib/validations/admin-order";
import type { OrderHistoryResponse } from "@/types/order-history";
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

export async function sendOrderToSteadfast(id: string) {
  const { data } = await api.post<{
    order: StoreOrder;
    consignmentId: string | number;
    trackingCode: string;
  }>(`/api/admin/orders/${encodeURIComponent(id)}/steadfast`);
  return data;
}

export async function fetchAdminOrderHistory(id: string) {
  const { data } = await api.get<OrderHistoryResponse>(
    `/api/admin/orders/${encodeURIComponent(id)}/history`,
  );
  return data;
}
