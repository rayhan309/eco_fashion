import { getAdminOrdersFromDbOrFallback } from "@/lib/db/readers/admin-orders";
import type { AdminOrder } from "@/data/dummy/admin-orders";

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return getAdminOrdersFromDbOrFallback();
}
