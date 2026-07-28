import { dummyAdminOrders, type AdminOrder } from "@/data/dummy/admin-orders";

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return [...dummyAdminOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
