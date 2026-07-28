import {
  computeCustomerStats,
  dummyAdminCustomers,
  type AdminCustomer,
  type AdminCustomerStats,
} from "@/data/dummy/admin-customers";

export type AdminCustomersData = {
  customers: AdminCustomer[];
  stats: AdminCustomerStats;
};

export async function getAdminCustomers(): Promise<AdminCustomersData> {
  const customers = [...dummyAdminCustomers].sort(
    (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime(),
  );
  return {
    customers,
    stats: computeCustomerStats(customers),
  };
}
