import { getAdminOrdersFromDbOrFallback } from "@/lib/db/readers/admin-orders";
import type { AdminOrder } from "@/types/admin-order";

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return getAdminOrdersFromDbOrFallback();
}
