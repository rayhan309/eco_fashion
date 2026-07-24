import { dummyOrders } from "@/data/dummy/orders";
import type { Order } from "@/data/dummy/orders";

export async function getOrders(): Promise<Order[]> {
  return [...dummyOrders];
}
