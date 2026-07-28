import type { Metadata } from "next";
import { AdminCustomersView } from "@/components/admin";
import { getAdminCustomers } from "@/services/admin-customers";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  const { customers, stats } = await getAdminCustomers();
  return <AdminCustomersView customers={customers} stats={stats} />;
}
