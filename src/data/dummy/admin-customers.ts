export type AdminCustomer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
};

export const dummyAdminCustomers: AdminCustomer[] = [
  {
    id: "cust-1",
    name: "Rayhan Ahmed",
    phone: "01712345678",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    orderCount: 3,
    totalSpent: 18400,
    lastOrderAt: "2026-07-28T10:30:00+06:00",
  },
  {
    id: "cust-2",
    name: "Sabbir Hasan",
    phone: "01876543210",
    address: "Zindabazar, Sylhet",
    orderCount: 1,
    totalSpent: 11500,
    lastOrderAt: "2026-07-26T14:00:00+06:00",
  },
  {
    id: "cust-3",
    name: "Imran Khan",
    phone: "01911223344",
    address: "Agrabad, Chattogram",
    orderCount: 2,
    totalSpent: 13200,
    lastOrderAt: "2026-07-24T09:20:00+06:00",
  },
  {
    id: "cust-4",
    name: "Nayeem Islam",
    phone: "01566778899",
    address: "Kazla, Rajshahi",
    orderCount: 1,
    totalSpent: 8900,
    lastOrderAt: "2026-07-22T16:45:00+06:00",
  },
  {
    id: "cust-5",
    name: "Arif Rahman",
    phone: "01700000000",
    address: "Uttara Sector 7, Dhaka",
    orderCount: 4,
    totalSpent: 24600,
    lastOrderAt: "2026-07-20T11:10:00+06:00",
  },
  {
    id: "cust-6",
    name: "Rafi Ahmed",
    phone: "01655443322",
    address: "Gulshan 2, Dhaka",
    orderCount: 2,
    totalSpent: 15800,
    lastOrderAt: "2026-07-18T08:55:00+06:00",
  },
  {
    id: "cust-7",
    name: "Tanvir Hossain",
    phone: "01309876543",
    address: "Bailey Road, Dhaka",
    orderCount: 1,
    totalSpent: 4200,
    lastOrderAt: "2026-07-15T19:30:00+06:00",
  },
  {
    id: "cust-8",
    name: "Mehedi Hasan",
    phone: "01455667788",
    address: "Khulna Sadar, Khulna",
    orderCount: 5,
    totalSpent: 31200,
    lastOrderAt: "2026-07-12T13:00:00+06:00",
  },
  {
    id: "cust-9",
    name: "Fahim Karim",
    phone: "01988776655",
    address: "Mirpur 10, Dhaka",
    orderCount: 1,
    totalSpent: 5600,
    lastOrderAt: "2026-07-10T10:15:00+06:00",
  },
  {
    id: "cust-10",
    name: "Kamal Uddin",
    phone: "01811223344",
    address: "Barishal Sadar, Barishal",
    orderCount: 2,
    totalSpent: 9800,
    lastOrderAt: "2026-07-08T17:40:00+06:00",
  },
  {
    id: "cust-11",
    name: "Shuvo Das",
    phone: "01755664433",
    address: "Panchlaish, Chattogram",
    orderCount: 1,
    totalSpent: 3200,
    lastOrderAt: "2026-07-05T12:25:00+06:00",
  },
  {
    id: "cust-12",
    name: "Asif Mahmud",
    phone: "01677889900",
    address: "Motijheel, Dhaka",
    orderCount: 3,
    totalSpent: 20100,
    lastOrderAt: "2026-07-02T15:50:00+06:00",
  },
];

export type AdminCustomerStats = {
  totalCustomers: number;
  repeatCustomers: number;
  lifetimeValue: number;
};

export function computeCustomerStats(customers: AdminCustomer[]): AdminCustomerStats {
  return {
    totalCustomers: customers.length,
    repeatCustomers: customers.filter((c) => c.orderCount > 1).length,
    lifetimeValue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };
}
