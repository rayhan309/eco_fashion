import { api } from "@/lib/axios";
import type { AdminOrderUpdateValues } from "@/lib/validations/admin-order";
<<<<<<< HEAD
import type { OrderHistoryResponse } from "@/types/order-history";
=======
import type { AdminOrderProductOption } from "@/types/admin-order-product";
>>>>>>> cf78953116bac3a4109b3e0c1d7b2f731d0144d0
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

<<<<<<< HEAD
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
=======
export async function fetchAdminOrderProductOptions() {
  const { data } = await api.get<{ products: AdminOrderProductOption[] }>(
    "/api/admin/orders/product-options",
  );
  return Array.isArray(data.products) ? data.products : [];
>>>>>>> cf78953116bac3a4109b3e0c1d7b2f731d0144d0
}
