import { getAdminCustomersFromDbOrFallback } from "@/lib/db/readers/customers";
import type { AdminCustomer, AdminCustomerStats } from "@/data/dummy/admin-customers";

export type AdminCustomersData = {
  customers: AdminCustomer[];
  stats: AdminCustomerStats;
};

export async function getAdminCustomers(): Promise<AdminCustomersData> {
  return getAdminCustomersFromDbOrFallback();
}
