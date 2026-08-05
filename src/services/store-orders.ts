import { api } from "@/lib/axios";
import type { CreateStoreOrderInput, StoreOrder } from "@/types/store-order";

export type PlaceStoreOrderResult = StoreOrder & {
  purchaseEventId?: string;
};

export async function placeStoreOrder(
  input: CreateStoreOrderInput,
): Promise<PlaceStoreOrderResult> {
  const { data } = await api.post<PlaceStoreOrderResult>("/api/store/orders", input);
  return data;
}

export async function lookupStoreOrder(
  orderNumber: string,
  phone?: string,
): Promise<StoreOrder> {
  const { data } = await api.get<StoreOrder>("/api/store/orders/lookup", {
    params: {
      orderNumber,
      ...(phone ? { phone } : {}),
    },
  });
  return data;
}
