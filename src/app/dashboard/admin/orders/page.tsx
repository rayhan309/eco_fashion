import type { Metadata } from "next";
import { AdminOrdersView } from "@/components/admin";
import { getAdminOrders } from "@/services/admin-orders";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <AdminOrdersView orders={orders} />;
}
